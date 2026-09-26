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
    DeliverResponse
)

load_dotenv()

logger = logging.getLogger("brandforge.deliver")

DELIVER_SYSTEM_INSTRUCTION = """
You are the final Brand Strategy Synthesizer for BrandForge.

You are given the accumulated outputs of five previous strategic stages:
1. Discover — what the startup is and who it serves.
2. Position — how it competes and differentiates.
3. Shape — verbal identity and messaging.
4. Visualize — visual identity direction.
5. Challenge — risks, weaknesses, failure scenarios, and mitigation recommendations.

Your job is to synthesize these outputs into one coherent, launch-ready Brand Kit matching the requested DeliverResponse schema.

CRITICAL SYNTHESIS RULES:
- Do NOT blindly repeat the previous outputs.
- Resolve cross-stage contradictions identified during the Challenge stage.
- Do NOT invent unsupported facts or claim market validation that has not actually occurred.
- Preserve strong, highly distinctive decisions from earlier stages (e.g. chosen category, differentiator, tagline, color mood).
- Incorporate critical risk findings and mitigation actions from the Challenge stage into the final strategy and next steps.
- Make the final hero messaging, value proposition, and launch copy highly specific to the actual startup idea.
- Keep the visual identity direction harmonized with the brand personality and verbal tone of voice.
- Avoid generic startup clichés and overused buzzwords (e.g., 'revolutionary', 'game-changing', 'seamless solution').
- Clearly distinguish strategic positioning from empirical market validation.
- Produce structured output adhering strictly to the DeliverResponse schema.
"""

CANDIDATE_MODELS = [
    "gemini-3.5-flash-lite",
    "gemini-flash-lite-latest",
    "gemini-1.5-flash",
    "gemini-1.5-pro"
]

def generate_deliver_prompt(
    disc: DiscoverResponse,
    pos: PositionResponse,
    shp: ShapeResponse,
    viz: VisualizeResponse,
    chg: ChallengeResponse
) -> str:
    traits_str = ", ".join(t.trait for t in shp.personality_traits) if shp.personality_traits else "None"
    naming_str = ", ".join(f"{n.name} (Examples: {', '.join(n.example_names)})" for n in shp.naming_territories) if shp.naming_territories else "None"
    colors_str = f"Primary: {', '.join(viz.color_direction.primary_colors)}, Accent: {viz.color_direction.accent_color}" if viz.color_direction else "None"
    risks_str = "; ".join(w.risk for w in chg.weak_assumptions) if chg.weak_assumptions else "Unverified target user adoption"
    recs_str = "\n".join(f"- {rec}" for rec in chg.recommended_changes) if chg.recommended_changes else "None"

    return f"""Accumulated Strategic Outputs from Phases 1–5:

--- PHASE 1: DISCOVER ---
- Problem: {disc.problem}
- Target User: {disc.target_user}
- Context: {disc.context}
- Value: {disc.value}
- Pain Points: {', '.join(disc.pain_points)}
- Constraints: {', '.join(disc.constraints)}
- Key Assumptions: {', '.join(disc.assumptions)}

--- PHASE 2: POSITION ---
- Category: {pos.category} ({pos.category_reason})
- Differentiator: {pos.differentiator}
- Value Proposition: {pos.value_proposition}
- Competitive Angle: {pos.competitive_angle}
- Positioning Statement: {pos.positioning_statement}

--- PHASE 3: SHAPE (Verbal Identity) ---
- Tagline: {shp.tagline}
- Personality Traits: {traits_str}
- Naming Concepts: {naming_str}
- Brand Voice: {shp.brand_voice.description} (Tone: {', '.join(shp.brand_voice.tone_characteristics)})
- Primary Message: {shp.message_hierarchy.primary_message}
- Supporting Messages: {', '.join(shp.message_hierarchy.supporting_messages)}

--- PHASE 4: VISUALIZE (Visual Identity) ---
- Typography: Primary ({viz.typography.primary_font_direction}), Secondary ({viz.typography.secondary_font_direction})
- Colors: {colors_str} (Mood: {viz.color_direction.color_mood})
- Layout & Composition: {', '.join(viz.composition.layout_principles)}
- Symbols & Shape Language: {viz.symbols_and_graphics.symbol_direction} ({viz.symbols_and_graphics.shape_language})
- Imagery Style: {viz.imagery.photography_or_illustration_style}

--- PHASE 5: CHALLENGE (Critical Audit) ---
- Summary of Evaluation: {chg.challenge_summary}
- Identified Risks / Weaknesses: {risks_str}
- High-Priority Recommended Changes:
{recs_str}

--- TASK ---
Synthesize the accumulated outputs above into a complete, launch-ready Final Brand Kit.
Return a structured JSON object matching the DeliverResponse model containing:
- Brand Overview (brand_name, one_line_pitch, brand_summary)
- Core Messaging (hero_headline, hero_subheadline, value_proposition, product_description, primary_cta)
- Audience (target_audience_summary, core_problem)
- Brand Voice (tone_of_voice, messaging_guidelines, brand_personality)
- Launch Copy (launch_announcement, social_media_posts)
- Brand Direction (visual_identity_summary, key_brand_pillars)
- Risk / Validation (key_risks, risk_mitigation_summary)
- Final Recommendation (next_steps)
"""

def analyze_deliver(
    disc: DiscoverResponse,
    pos: PositionResponse,
    shp: ShapeResponse,
    viz: VisualizeResponse,
    chg: ChallengeResponse
) -> DeliverResponse:
    """
    Invokes Gemini API to synthesize Phases 1-5 into a final launch-ready Brand Kit (DeliverResponse).
    """
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key or api_key == "your_gemini_api_key_here":
        raise ValueError("GEMINI_API_KEY is not configured. Please set a valid API key in your backend .env file.")

    user_prompt = generate_deliver_prompt(disc, pos, shp, viz, chg)
    last_error = None

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)

        for model_name in CANDIDATE_MODELS:
            for attempt in range(2):
                try:
                    logger.info(f"Attempting Gemini Deliver synthesis with model {model_name} (attempt {attempt + 1})...")
                    response = client.models.generate_content(
                        model=model_name,
                        contents=user_prompt,
                        config=types.GenerateContentConfig(
                            system_instruction=DELIVER_SYSTEM_INSTRUCTION,
                            response_mime_type="application/json",
                            response_schema=DeliverResponse,
                            temperature=0.2,
                        ),
                    )

                    if hasattr(response, "parsed") and response.parsed is not None:
                        if isinstance(response.parsed, DeliverResponse):
                            return response.parsed
                        elif isinstance(response.parsed, dict):
                            return DeliverResponse(**response.parsed)

                    raw_text = response.text if hasattr(response, "text") else ""
                    if raw_text:
                        cleaned_text = raw_text.strip()
                        if cleaned_text.startswith("```"):
                            cleaned_text = cleaned_text.split("```")[1]
                            if cleaned_text.startswith("json"):
                                cleaned_text = cleaned_text[4:]
                            cleaned_text = cleaned_text.strip()
                        data = json.loads(cleaned_text)
                        return DeliverResponse(**data)

                except Exception as model_err:
                    logger.warning(f"Model {model_name} attempt {attempt + 1} deliver synthesis failed: {model_err}")
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
                    system_instruction=DELIVER_SYSTEM_INSTRUCTION,
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
                return DeliverResponse(**data)
            except Exception as legacy_err:
                last_error = legacy_err
                continue

    if last_error:
        raise last_error

    raise RuntimeError("Failed to obtain structured brand kit synthesis from Gemini API.")
