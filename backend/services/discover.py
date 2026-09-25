import os
import json
import time
import logging
from dotenv import load_dotenv
from models import DiscoverResponse

load_dotenv()

logger = logging.getLogger("brandforge.discover")

SYSTEM_INSTRUCTION = """
You are a senior Product Discovery Strategist helping entrepreneurs and hackathon teams evaluate and structure early-stage product or startup ideas.

Your mission in this DISCOVER stage is to systematically analyze the user's submitted idea and break it down into core strategic dimensions.

IMPORTANT CONSTRAINTS:
1. Do NOT generate brand names, logos, colors, taglines, slogans, visual identities, or marketing copy.
2. Focus strictly on product positioning, problem space, user dynamics, and feasibility analysis.
3. Extract and articulate:
   - Core Problem: The fundamental friction or need being addressed.
   - Target User: The primary persona or audience most impacted.
   - Context: The environment, background trends, or situational trigger.
   - Value: Why solving this problem matters and what benefits it creates.
   - Pain Points: Specific, tangible frustrations experienced by target users.
   - Constraints: Technical, financial, operational, or legal boundaries/limitations.
   - Assumptions: Explicit or implicit hypotheses embedded in the idea that need validation.
   - Open Questions: Unanswered strategic questions that must be resolved before moving into branding or design.
4. If the user's idea is vague or short, do NOT invent unsupported business details. Instead, capture uncertainties in 'open_questions' and mark unverified claims in 'assumptions'.
5. Return ONLY a valid JSON object adhering strictly to the requested schema.
"""

# Candidate models in optimal fallback order
CANDIDATE_MODELS = [
    "gemini-3.5-flash-lite",
    "gemini-flash-lite-latest",
    "gemini-1.5-flash",
    "gemini-1.5-pro"
]

def analyze_idea(idea: str) -> DiscoverResponse:
    """
    Invokes the Gemini API to analyze a rough product idea and returns a structured DiscoverResponse.
    """
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key or api_key == "your_gemini_api_key_here":
        raise ValueError("GEMINI_API_KEY is not configured. Please set a valid API key in your backend .env file.")

    user_prompt = f"Product Idea to Analyze:\n\n{idea.strip()}"

    last_error = None

    # Try modern google-genai SDK first
    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)

        for model_name in CANDIDATE_MODELS:
            for attempt in range(2):
                try:
                    logger.info(f"Attempting Gemini discovery with model {model_name} (attempt {attempt + 1})...")
                    response = client.models.generate_content(
                        model=model_name,
                        contents=user_prompt,
                        config=types.GenerateContentConfig(
                            system_instruction=SYSTEM_INSTRUCTION,
                            response_mime_type="application/json",
                            response_schema=DiscoverResponse,
                            temperature=0.2,
                        ),
                    )

                    if hasattr(response, "parsed") and response.parsed is not None:
                        if isinstance(response.parsed, DiscoverResponse):
                            return response.parsed
                        elif isinstance(response.parsed, dict):
                            return DiscoverResponse(**response.parsed)

                    raw_text = response.text if hasattr(response, "text") else ""
                    if raw_text:
                        cleaned_text = raw_text.strip()
                        if cleaned_text.startswith("```"):
                            cleaned_text = cleaned_text.split("```")[1]
                            if cleaned_text.startswith("json"):
                                cleaned_text = cleaned_text[4:]
                            cleaned_text = cleaned_text.strip()
                        data = json.loads(cleaned_text)
                        return DiscoverResponse(**data)

                except Exception as model_err:
                    logger.warning(f"Model {model_name} attempt {attempt + 1} failed: {model_err}")
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
                    system_instruction=SYSTEM_INSTRUCTION,
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
                return DiscoverResponse(**data)
            except Exception as legacy_err:
                last_error = legacy_err
                continue

    if last_error:
        raise last_error

    raise RuntimeError("Failed to obtain structured discovery analysis from Gemini API.")
