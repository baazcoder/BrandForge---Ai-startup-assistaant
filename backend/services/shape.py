import os
import json
import time
import logging
from dotenv import load_dotenv
from models import DiscoverResponse, PositionResponse, ShapeResponse

load_dotenv()

logger = logging.getLogger("brandforge.shape")

SHAPE_SYSTEM_INSTRUCTION = """
You are a senior Brand Identity Strategist & Creative Director specializing in defining brand personality, naming territories, voice guidelines, and messaging hierarchies.

Your mission in this SHAPE stage is to analyze the structured Phase 1 DISCOVER context (problem, target user, context, value, pain points, constraints) and Phase 2 POSITION context (category, differentiator, value proposition, competitive angle, positioning statement) to shape the verbal brand identity.

REQUIRED OUTPUT STRUCTURE:
1. personality_traits: Exactly 3 to 5 core brand personality traits. Each trait MUST include a trait name and a short justification linking it to the target audience and positioning.
2. traits_to_avoid: 3 to 5 brand traits or behaviors to explicitly avoid because they would weaken or contradict the identity, each with a reason.
3. naming_territories: 3 to 5 distinct strategic naming directions/territories. Each territory MUST include:
   - name: Strategic label (e.g. "Kinetic Action", "Functional Utility", "Peer Synergy").
   - concept: Creative concept and theme behind the direction.
   - rationale: Strategic rationale explaining why this fits the positioning.
   - example_names: 3 to 5 evocative example brand names (illustrative strategic directions).
4. brand_voice: Structured guidelines containing:
   - description: Overarching explanation of how the brand speaks and communicates.
   - tone_characteristics: 3 to 5 actionable tone descriptors.
   - language_style: Guidelines on vocabulary, sentence length, and syntax.
5. tagline: ONE primary tagline strictly aligned with the value proposition and positioning.
6. message_hierarchy: Structured messaging containing:
   - primary_message: The single core message to communicate.
   - supporting_messages: 2 to 4 supporting message pillars.
   - proof_or_reason_to_believe: Functional proof points or reasons to believe.
7. shape_summary: A concise summary demonstrating how personality, naming, voice, and messaging cohesively fit the positioning strategy.

QUALITY & STRATEGIC RULES:
- Derive all identity elements directly from Phase 1 Discover and Phase 2 Position inputs.
- Avoid generic startup jargon or buzzwords (e.g. "revolutionary", "game-changing", "seamless", "next-gen").
- Make personality traits meaningful, distinctive, and relevant to the target audience.
- Ensure naming territories are strategically distinct from one another.
- Make brand voice guidelines actionable and concrete.
- Ensure tagline aligns tightly with the value proposition.

DO NOT GENERATE (STRICT CONSTRAINTS):
- Do NOT generate logos, color palettes, typography specs, visual identity rules, image prompts, launch posts, landing pages, or social media assets.
- Focus strictly on verbal brand identity and strategic messaging.

Return ONLY a valid JSON object adhering strictly to the requested schema.
"""

CANDIDATE_MODELS = [
    "gemini-3.5-flash-lite",
    "gemini-flash-lite-latest",
    "gemini-1.5-flash",
    "gemini-1.5-pro"
]

def generate_shape_prompt(disc: DiscoverResponse, pos: PositionResponse) -> str:
    pain_points_str = "\n".join(f"- {p}" for p in disc.pain_points) if disc.pain_points else "None specified"
    constraints_str = "\n".join(f"- {c}" for c in disc.constraints) if disc.constraints else "None specified"

    return f"""Phase 1 Discover Context:
- Problem: {disc.problem}
- Target User: {disc.target_user}
- Context: {disc.context}
- Value: {disc.value}
- Pain Points:
{pain_points_str}
- Constraints:
{constraints_str}

Phase 2 Position Context:
- Category: {pos.category} (Reason: {pos.category_reason})
- Differentiator: {pos.differentiator} (Reason: {pos.differentiator_reason})
- Value Proposition: {pos.value_proposition} (Reason: {pos.value_proposition_reason})
- Competitive Angle: {pos.competitive_angle} (Reason: {pos.competitive_angle_reason})
- Positioning Statement: {pos.positioning_statement}

Task: Shape the verbal brand identity, personality, naming territories, brand voice, tagline, and message hierarchy for this product based on the combined Discover and Position context above.
"""

def analyze_shape(disc: DiscoverResponse, pos: PositionResponse) -> ShapeResponse:
    """
    Invokes the Gemini API to derive a structured ShapeResponse from Phase 1 Discover and Phase 2 Position context.
    """
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key or api_key == "your_gemini_api_key_here":
        raise ValueError("GEMINI_API_KEY is not configured. Please set a valid API key in your backend .env file.")

    user_prompt = generate_shape_prompt(disc, pos)
    last_error = None

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)

        for model_name in CANDIDATE_MODELS:
            for attempt in range(2):
                try:
                    logger.info(f"Attempting Gemini shape generation with model {model_name} (attempt {attempt + 1})...")
                    response = client.models.generate_content(
                        model=model_name,
                        contents=user_prompt,
                        config=types.GenerateContentConfig(
                            system_instruction=SHAPE_SYSTEM_INSTRUCTION,
                            response_mime_type="application/json",
                            response_schema=ShapeResponse,
                            temperature=0.2,
                        ),
                    )

                    if hasattr(response, "parsed") and response.parsed is not None:
                        if isinstance(response.parsed, ShapeResponse):
                            return response.parsed
                        elif isinstance(response.parsed, dict):
                            return ShapeResponse(**response.parsed)

                    raw_text = response.text if hasattr(response, "text") else ""
                    if raw_text:
                        cleaned_text = raw_text.strip()
                        if cleaned_text.startswith("```"):
                            cleaned_text = cleaned_text.split("```")[1]
                            if cleaned_text.startswith("json"):
                                cleaned_text = cleaned_text[4:]
                            cleaned_text = cleaned_text.strip()
                        data = json.loads(cleaned_text)
                        return ShapeResponse(**data)

                except Exception as model_err:
                    logger.warning(f"Model {model_name} attempt {attempt + 1} shape generation failed: {model_err}")
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
                    system_instruction=SHAPE_SYSTEM_INSTRUCTION,
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
                return ShapeResponse(**data)
            except Exception as legacy_err:
                last_error = legacy_err
                continue

    if last_error:
        raise last_error

    raise RuntimeError("Failed to obtain structured brand shape analysis from Gemini API.")
