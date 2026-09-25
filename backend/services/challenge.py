import os
import json
import time
import logging
from dotenv import load_dotenv
from models import DiscoverResponse, PositionResponse, ShapeResponse, VisualizeResponse, ChallengeResponse

load_dotenv()

logger = logging.getLogger("brandforge.challenge")

CHALLENGE_SYSTEM_INSTRUCTION = """
You are a ruthless, expert Brand Strategy Critic and Quality Assurance Director. Your mission in this Phase 5 CHALLENGE stage is to stress-test, critique, and critically evaluate the complete accumulated brand strategy created across Phase 1 DISCOVER, Phase 2 POSITION, Phase 3 SHAPE, and Phase 4 VISUALIZE.

Your task is NOT to write marketing fluff or simply agree with the previous decisions. You must rigorously inspect the strategy for vulnerabilities, weak reasoning, clichés, cross-stage contradictions, audience disconnects, and unverified assumptions.

REQUIRED ANALYSIS DIMENSIONS:

1. cliches_detected:
   Identify 2 to 4 generic, overused startup tropes, predictable buzzwords, or visual/verbal clichés in the current strategy (e.g., generic 'modern & clean' claims, predictable blue/slate tech palettes, overused 'instant connection' messaging, or standard personality traits).
   For each item, specify:
   - area: The dimension where the cliché lives (e.g., Positioning, Naming, Voice, Visuals).
   - current_choice: The specific cliché or overused element.
   - why_generic: Why this element is weak, generic, or common in tech/startups.
   - stronger_alternative: A concrete, highly distinctive replacement or elevated direction.

2. contradictions:
   Identify 2 to 4 conflicting decisions between different stages (e.g., Position targets academic utility but Voice sounds like casual consumer social; Target user needs fast efficiency but Visualize introduces complex visual density).
   For each item, specify:
   - area: The cross-stage friction point.
   - element_a: First conflicting element.
   - element_b: Second conflicting element.
   - conflict: Detailed explanation of the friction between element_a and element_b.
   - recommended_fix: Clear, actionable resolution to harmonize the two choices.

3. audience_mismatches:
   Identify 2 to 3 decisions that misjudge the target user persona's real-world behavior, mindset, or preferences.
   For each item, specify:
   - decision: The specific strategy decision evaluated.
   - audience_issue: The gap or mismatch with the target audience's reality.
   - why_it_matters: Why this mismatch hurts user adoption or trust.
   - recommended_change: Specific adjustment to align with user needs.

4. weak_assumptions:
   Identify 2 to 4 unproven hypotheses or assumptions made without empirical validation (e.g., assuming users will verify skills voluntarily, assuming students prefer skill matching over social matching).
   For each item, specify:
   - assumption: The underlying unproven assumption.
   - risk: Operational, strategic, or adoption risk if assumption fails.
   - validation_needed: Practical test, survey, or MVP feature needed to validate.

5. distinctiveness_gaps:
   Identify 2 to 3 areas where the brand feels commodity-like or could easily describe 10 other competitors.
   For each item, specify:
   - area: The weak dimension (e.g., Differentiator, Tagline, Primary Color).
   - problem: Specific reason it lacks sharp differentiation.
   - why_generic: Underlying cause of the generic feeling.
   - improvement_direction: Strategic direction to inject sharp distinctiveness.

6. consistency_findings:
   Evaluate how well all 4 stages (Problem -> Position -> Shape -> Visualize) link together into a single unified system.
   For each item, specify:
   - connected_elements: System elements evaluated together (e.g., Problem + Differentiator + Visual Mood).
   - status_or_issue: Status (e.g., 'Strongly Coherent', 'Partial Disconnect', or 'Major Misalignment').
   - explanation: Evaluation of systemic unity.
   - recommended_adjustment: Specific adjustment to achieve tighter coherence.

7. challenge_summary:
   A clear, analytical 3 to 5 sentence summary summarizing the overall health and major vulnerabilities of the strategy.

8. recommended_changes:
   A bulleted list of 3 to 5 high-priority, actionable changes the founder must make before advancing to final brand delivery.

IMPORTANT GUIDELINES:
- Be constructive yet firm. Do NOT praise generic work.
- Evaluate based strictly on internal consistency, audience logic, and distinctiveness.
- Preserve genuinely strong decisions—do not suggest changing things that are already sharp and distinctive.
- Return ONLY a valid JSON object adhering strictly to the requested ChallengeResponse schema.
"""

CANDIDATE_MODELS = [
    "gemini-3.5-flash-lite",
    "gemini-flash-lite-latest",
    "gemini-1.5-flash",
    "gemini-1.5-pro"
]

def generate_challenge_prompt(
    disc: DiscoverResponse,
    pos: PositionResponse,
    shp: ShapeResponse,
    viz: VisualizeResponse
) -> str:
    traits_str = ", ".join(t.trait for t in shp.personality_traits) if shp.personality_traits else "None"
    avoid_traits_str = ", ".join(a.trait for a in shp.traits_to_avoid) if shp.traits_to_avoid else "None"
    naming_str = ", ".join(f"{n.name} (Examples: {', '.join(n.example_names)})" for n in shp.naming_territories) if shp.naming_territories else "None"
    colors_str = f"Primary: {', '.join(viz.color_direction.primary_colors)}, Accent: {viz.color_direction.accent_color}" if viz.color_direction else "None"

    return f"""Accumulated Brand Context across Phases 1–4:

--- PHASE 1: DISCOVER ---
- Core Problem: {disc.problem}
- Target User: {disc.target_user}
- Context: {disc.context}
- Value: {disc.value}
- Pain Points: {', '.join(disc.pain_points)}
- Constraints: {', '.join(disc.constraints)}
- Assumptions: {', '.join(disc.assumptions)}

--- PHASE 2: POSITION ---
- Category: {pos.category}
- Differentiator: {pos.differentiator}
- Value Proposition: {pos.value_proposition}
- Competitive Angle: {pos.competitive_angle}
- Positioning Statement: {pos.positioning_statement}

--- PHASE 3: SHAPE (Verbal Identity) ---
- Tagline: {shp.tagline}
- Personality Traits: {traits_str}
- Traits to Avoid: {avoid_traits_str}
- Naming Territories: {naming_str}
- Brand Voice: {shp.brand_voice.description} (Tone: {', '.join(shp.brand_voice.tone_characteristics)})
- Primary Message: {shp.message_hierarchy.primary_message}

--- PHASE 4: VISUALIZE (Visual Identity Direction) ---
- Typography: Primary ({viz.typography.primary_font_direction}), Secondary ({viz.typography.secondary_font_direction})
- Color Palette: {colors_str} (Mood: {viz.color_direction.color_mood})
- Layout & Composition: {', '.join(viz.composition.layout_principles)}
- Symbols & Shape Language: {viz.symbols_and_graphics.symbol_direction} (Shape: {viz.symbols_and_graphics.shape_language})
- Imagery Style: {viz.imagery.photography_or_illustration_style} (Subject: {viz.imagery.subject_direction})
- Concepts to Avoid: {', '.join(c.concept for c in viz.concepts_to_avoid)}

--- TASK ---
Critically evaluate the complete accumulated brand direction above across the 8 required dimensions (cliches_detected, contradictions, audience_mismatches, weak_assumptions, distinctiveness_gaps, consistency_findings, challenge_summary, recommended_changes).
Highlight vulnerabilities, explain why choices are weak or conflicting, and provide actionable, distinctive alternatives.
"""

def analyze_challenge(
    disc: DiscoverResponse,
    pos: PositionResponse,
    shp: ShapeResponse,
    viz: VisualizeResponse
) -> ChallengeResponse:
    """
    Invokes the Gemini API to perform a critical evaluation of Phases 1-4 and returns a ChallengeResponse.
    """
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key or api_key == "your_gemini_api_key_here":
        raise ValueError("GEMINI_API_KEY is not configured. Please set a valid API key in your backend .env file.")

    user_prompt = generate_challenge_prompt(disc, pos, shp, viz)
    last_error = None

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)

        for model_name in CANDIDATE_MODELS:
            for attempt in range(2):
                try:
                    logger.info(f"Attempting Gemini challenge evaluation with model {model_name} (attempt {attempt + 1})...")
                    response = client.models.generate_content(
                        model=model_name,
                        contents=user_prompt,
                        config=types.GenerateContentConfig(
                            system_instruction=CHALLENGE_SYSTEM_INSTRUCTION,
                            response_mime_type="application/json",
                            response_schema=ChallengeResponse,
                            temperature=0.2,
                        ),
                    )

                    if hasattr(response, "parsed") and response.parsed is not None:
                        if isinstance(response.parsed, ChallengeResponse):
                            return response.parsed
                        elif isinstance(response.parsed, dict):
                            return ChallengeResponse(**response.parsed)

                    raw_text = response.text if hasattr(response, "text") else ""
                    if raw_text:
                        cleaned_text = raw_text.strip()
                        if cleaned_text.startswith("```"):
                            cleaned_text = cleaned_text.split("```")[1]
                            if cleaned_text.startswith("json"):
                                cleaned_text = cleaned_text[4:]
                            cleaned_text = cleaned_text.strip()
                        data = json.loads(cleaned_text)
                        return ChallengeResponse(**data)

                except Exception as model_err:
                    logger.warning(f"Model {model_name} attempt {attempt + 1} challenge evaluation failed: {model_err}")
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
                    system_instruction=CHALLENGE_SYSTEM_INSTRUCTION,
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
                return ChallengeResponse(**data)
            except Exception as legacy_err:
                last_error = legacy_err
                continue

    if last_error:
        raise last_error

    raise RuntimeError("Failed to obtain structured challenge strategy analysis from Gemini API.")
