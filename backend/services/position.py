import os
import json
import time
import logging
from dotenv import load_dotenv
from models import DiscoverResponse, PositionResponse

load_dotenv()

logger = logging.getLogger("brandforge.position")

POSITION_SYSTEM_INSTRUCTION = """
You are a senior Brand Positioning Strategist helping product teams and entrepreneurs define precise, high-impact market positioning.

Your mission in this POSITION stage is to analyze the structured Phase 1 DISCOVER context (problem, target user, context, value, pain points, constraints, assumptions, open questions) and generate a sharp, cohesive market positioning strategy.

REQUIRED POSITIONING OUTPUTS:
1. category: The specific market category or frame of reference for the product (e.g. "Peer Collaboration & Teammate Discovery Platform").
2. category_reason: Explanation of why this category is chosen based on the target user and problem context.
3. differentiator: The primary, specific factor that sets this product apart from current alternatives for the target audience.
4. differentiator_reason: Why this specific differentiator solves the user's key friction point better than existing workarounds.
5. value_proposition: A clear, compelling explanation of the core benefit delivered to the target user.
6. value_proposition_reason: How this value directly resolves the identified pain points and value drivers.
7. competitive_angle: How the product is strategically positioned relative to alternative solutions or status-quo workarounds.
8. competitive_angle_reason: Strategic rationale for why this competitive framing resonates and is difficult to counter.
9. positioning_statement: A concise, unified strategic positioning statement (e.g., "For [target user] who [core problem], [Product] is a [category] that [value proposition]. Unlike [alternatives], [differentiator].").

QUALITY & STRATEGIC RULES:
- Derive all positioning directly from the supplied Discover context.
- Avoid generic startup buzzwords (e.g., "revolutionary", "game-changing", "seamless", "next-generation").
- Ensure the differentiator is concrete and specific to the target audience/problem space.
- Ensure the value proposition clearly explains the functional and emotional benefit to the target user.
- Make the competitive angle meaningfully distinct from existing status-quo options.
- Maintain strict consistency with Phase 1 constraints and context.

DO NOT GENERATE (STRICT CONSTRAINTS):
- Do NOT generate logos, colors, typography, visual identity, brand personality, launch posts, or landing page assets.
- Do NOT generate tagline lists or copy variations unless used strictly inside the supporting positioning_statement.

Return ONLY a valid JSON object adhering strictly to the requested schema.
"""

CANDIDATE_MODELS = [
    "gemini-3.5-flash-lite",
    "gemini-flash-lite-latest",
    "gemini-1.5-flash",
    "gemini-1.5-pro"
]

def generate_position_prompt(ctx: DiscoverResponse) -> str:
    pain_points_str = "\n".join(f"- {p}" for p in ctx.pain_points) if ctx.pain_points else "None specified"
    constraints_str = "\n".join(f"- {c}" for c in ctx.constraints) if ctx.constraints else "None specified"
    assumptions_str = "\n".join(f"- {a}" for a in ctx.assumptions) if ctx.assumptions else "None specified"
    open_questions_str = "\n".join(f"- {q}" for q in ctx.open_questions) if ctx.open_questions else "None specified"

    return f"""Phase 1 Structured Discover Context:

- Core Problem: {ctx.problem}
- Target User: {ctx.target_user}
- Situational Context: {ctx.context}
- Value Drivers: {ctx.value}

Pain Points Identified:
{pain_points_str}

Known Constraints:
{constraints_str}

Key Assumptions:
{assumptions_str}

Open Questions:
{open_questions_str}

Task: Generate a sharp, structured brand positioning strategy for this product based strictly on the Discover context above.
"""

def analyze_position(ctx: DiscoverResponse) -> PositionResponse:
    """
    Invokes the Gemini API to derive a structured PositionResponse from a Phase 1 DiscoverResponse context.
    """
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key or api_key == "your_gemini_api_key_here":
        raise ValueError("GEMINI_API_KEY is not configured. Please set a valid API key in your backend .env file.")

    user_prompt = generate_position_prompt(ctx)
    last_error = None

    # Try modern google-genai SDK first
    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)

        for model_name in CANDIDATE_MODELS:
            for attempt in range(2):
                try:
                    logger.info(f"Attempting Gemini position generation with model {model_name} (attempt {attempt + 1})...")
                    response = client.models.generate_content(
                        model=model_name,
                        contents=user_prompt,
                        config=types.GenerateContentConfig(
                            system_instruction=POSITION_SYSTEM_INSTRUCTION,
                            response_mime_type="application/json",
                            response_schema=PositionResponse,
                            temperature=0.2,
                        ),
                    )

                    if hasattr(response, "parsed") and response.parsed is not None:
                        if isinstance(response.parsed, PositionResponse):
                            return response.parsed
                        elif isinstance(response.parsed, dict):
                            return PositionResponse(**response.parsed)

                    raw_text = response.text if hasattr(response, "text") else ""
                    if raw_text:
                        cleaned_text = raw_text.strip()
                        if cleaned_text.startswith("```"):
                            cleaned_text = cleaned_text.split("```")[1]
                            if cleaned_text.startswith("json"):
                                cleaned_text = cleaned_text[4:]
                            cleaned_text = cleaned_text.strip()
                        data = json.loads(cleaned_text)
                        return PositionResponse(**data)

                except Exception as model_err:
                    logger.warning(f"Model {model_name} attempt {attempt + 1} position generation failed: {model_err}")
                    last_error = model_err
                    if attempt == 0:
                        time.sleep(1.5)
                    continue

    except ImportError:
        logger.info("google-genai SDK not available, falling back to google-generativeai")
        import google.generativeai as genai_legacy

        genai_legacy.configure(api_key=api_key)
        for model_name in CANDIDATE_MODELS:
            try:
                model = genai_legacy.GenerativeModel(
                    model_name=model_name,
                    system_instruction=POSITION_SYSTEM_INSTRUCTION,
                    generation_config={"response_mime_type": "application/json"}
                )
                response = model.generate_content(user_prompt)
                raw_text = response.text.strip()
                if raw_text.startswith("```"):
                    raw_text = raw_text.split("```")[1]
                    if raw_text.startswith("json"):
                        raw_text = raw_text[4:]
                    raw_text = raw_text.strip()
                data = json.loads(raw_text)
                return PositionResponse(**data)
            except Exception as legacy_err:
                last_error = legacy_err
                continue

    if last_error:
        raise last_error

    raise RuntimeError("Failed to obtain structured positioning analysis from Gemini API.")
