import os
import json
import time
import logging
from dotenv import load_dotenv
from models import (
    DiscoverResponse,
    PositionResponse,
    ShapeResponse,
    VisualizeResponse,
    ChallengeResponse,
    DeliverResponse,
    EvaluateResponse
)

load_dotenv()

logger = logging.getLogger("brandforge.evaluate")

EVALUATE_SYSTEM_INSTRUCTION = """
You are BrandForge's final Brand Strategy Evaluator.

Your responsibility is to critically evaluate the coherence and quality of a startup brand strategy generated across all six BrandForge phases (Discover, Position, Shape, Visualize, Challenge, Deliver).

You are NOT a copywriter and you are NOT here to generate more marketing content.

Your job is to identify inconsistencies, unsupported assumptions, generic positioning, audience mismatches, contradictions, unresolved risks, and areas requiring human validation.

CRITICAL EVALUATION RULES:
- Evaluate the final strategy against the evidence contained in the previous stages.
- Do NOT invent market evidence.
- Do NOT claim customer validation or market traction that has not actually occurred.
- Do NOT claim competitor validation unless explicit evidence was supplied.
- Do NOT reward an idea simply because it sounds polished.
- When identifying a weakness, explain what specific evidence from the previous stages caused you to identify it.
- When possible, provide a concrete, actionable improvement recommendation.
- Prioritize the most important issues instead of producing a long generic critique.
- Return structured output adhering strictly to the EvaluateResponse schema.

REQUIRED OUTPUT STRUCTURE:
1. overall_status: Exactly one of ['strong', 'needs_review', 'high_risk'].
2. overall_summary: A 3 to 5 sentence synthesis explaining the holistic coherence and major quality findings.
3. consistency_checks: Evaluates key cross-stage dimensions (e.g. Problem ↔ Audience, Problem ↔ Value Proposition, Position ↔ Differentiation, Messaging ↔ Audience, Verbal ↔ Visual, Challenge ↔ Deliver). Each item must specify:
   - area: The dimension evaluated.
   - status: Exactly one of ['consistent', 'needs_attention', 'inconsistent'].
   - finding: Explanation of the evaluation finding.
   - evidence: Specific text/data from earlier stages supporting the finding.
   - recommendation: Practical recommendation to elevate coherence or fix friction.
4. priority_actions: 3 to 7 prioritized actionable items. Each item must specify:
   - priority: Exactly one of ['high', 'medium', 'low'].
   - area: Strategic area.
   - problem: Clear description of the weakness or risk.
   - recommended_action: Concrete action to resolve.
5. human_review_items: 3 to 6 explicit items that AI cannot validate and require real-world human verification (e.g. customer interviews, trademark search, competitor pricing, legal compliance).
"""

CANDIDATE_MODELS = [
    "gemini-3.5-flash-lite",
    "gemini-flash-lite-latest",
    "gemini-1.5-flash",
    "gemini-1.5-pro"
]

def generate_evaluate_prompt(
    disc: DiscoverResponse,
    pos: PositionResponse,
    shp: ShapeResponse,
    viz: VisualizeResponse,
    chg: ChallengeResponse,
    dlv: DeliverResponse
) -> str:
    traits_str = ", ".join(t.trait for t in shp.personality_traits) if shp.personality_traits else "None"
    colors_str = f"Primary: {', '.join(viz.color_direction.primary_colors)}, Accent: {viz.color_direction.accent_color}" if viz.color_direction else "None"
    risks_str = "; ".join(w.risk for w in chg.weak_assumptions) if chg.weak_assumptions else "None"

    return f"""Accumulated Strategy Outputs across All 6 BrandForge Stages:

--- STAGE 1: DISCOVER ---
- Core Problem: {disc.problem}
- Target User: {disc.target_user}
- Pain Points: {', '.join(disc.pain_points)}
- Key Assumptions: {', '.join(disc.assumptions)}

--- STAGE 2: POSITION ---
- Category: {pos.category}
- Differentiator: {pos.differentiator}
- Value Proposition: {pos.value_proposition}
- Positioning Statement: {pos.positioning_statement}

--- STAGE 3: SHAPE (Verbal) ---
- Brand Name / Tagline: "{dlv.brand_name}" / "{shp.tagline}"
- Personality Traits: {traits_str}
- Tone of Voice: {shp.brand_voice.description}

--- STAGE 4: VISUALIZE (Visual) ---
- Typography: Primary ({viz.typography.primary_font_direction})
- Color Palette: {colors_str} (Mood: {viz.color_direction.color_mood})
- Visual Summary: {viz.visual_summary}

--- STAGE 5: CHALLENGE (Critical Audit) ---
- Challenge Summary: {chg.challenge_summary}
- Identified Risks: {risks_str}
- Recommended Changes: {', '.join(chg.recommended_changes)}

--- STAGE 6: DELIVER (Final Brand Kit) ---
- Brand Summary: {dlv.brand_summary}
- Hero Headline: {dlv.hero_headline}
- One-Line Pitch: {dlv.one_line_pitch}
- Target Audience Summary: {dlv.target_audience_summary}
- Risk Mitigation Summary: {dlv.risk_mitigation_summary}
- Next Steps: {', '.join(dlv.next_steps)}

--- TASK ---
Perform a ruthless, evidence-based Brand Consistency & Quality Evaluation across Stages 1–6.
Identify strong areas, cross-stage inconsistencies, audience mismatches, visual/verbal gaps, and items requiring real-world human review.
Return a structured JSON object matching the EvaluateResponse schema.
"""

def analyze_evaluation(
    disc: DiscoverResponse,
    pos: PositionResponse,
    shp: ShapeResponse,
    viz: VisualizeResponse,
    chg: ChallengeResponse,
    dlv: DeliverResponse
) -> EvaluateResponse:
    """
    Invokes Gemini API to perform a holistic brand consistency & quality evaluation across Stages 1-6.
    """
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key or api_key == "your_gemini_api_key_here":
        raise ValueError("GEMINI_API_KEY is not configured. Please set a valid API key in your backend .env file.")

    user_prompt = generate_evaluate_prompt(disc, pos, shp, viz, chg, dlv)
    last_error = None

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)

        for model_name in CANDIDATE_MODELS:
            for attempt in range(2):
                try:
                    logger.info(f"Attempting Gemini Brand Evaluation with model {model_name} (attempt {attempt + 1})...")
                    response = client.models.generate_content(
                        model=model_name,
                        contents=user_prompt,
                        config=types.GenerateContentConfig(
                            system_instruction=EVALUATE_SYSTEM_INSTRUCTION,
                            response_mime_type="application/json",
                            response_schema=EvaluateResponse,
                            temperature=0.2,
                        ),
                    )

                    if hasattr(response, "parsed") and response.parsed is not None:
                        if isinstance(response.parsed, EvaluateResponse):
                            return response.parsed
                        elif isinstance(response.parsed, dict):
                            return EvaluateResponse(**response.parsed)

                    raw_text = response.text if hasattr(response, "text") else ""
                    if raw_text:
                        cleaned_text = raw_text.strip()
                        if cleaned_text.startswith("```"):
                            cleaned_text = cleaned_text.split("```")[1]
                            if cleaned_text.startswith("json"):
                                cleaned_text = cleaned_text[4:]
                            cleaned_text = cleaned_text.strip()
                        data = json.loads(cleaned_text)
                        return EvaluateResponse(**data)

                except Exception as model_err:
                    logger.warning(f"Model {model_name} attempt {attempt + 1} evaluate service failed: {model_err}")
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
                    system_instruction=EVALUATE_SYSTEM_INSTRUCTION,
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
                return EvaluateResponse(**data)
            except Exception as legacy_err:
                last_error = legacy_err
                continue

    if last_error:
        raise last_error

    raise RuntimeError("Failed to obtain structured brand evaluation from Gemini API.")
