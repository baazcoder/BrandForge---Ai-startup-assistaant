import os
import json
import time
import logging
from dotenv import load_dotenv
from models import DiscoverResponse, PositionResponse, ShapeResponse, VisualizeResponse

load_dotenv()

logger = logging.getLogger("brandforge.visualize")

VISUALIZE_SYSTEM_INSTRUCTION = """
You are a senior Design Director & Visual Brand Strategist specializing in translating verbal brand strategy, positioning, and personality into a cohesive visual identity direction.

Your mission in this VISUALIZE stage is to analyze the structured Phase 1 DISCOVER context, Phase 2 POSITION strategy, and Phase 3 SHAPE verbal identity to formulate a clear, strategic visual direction.

REQUIRED OUTPUT STRUCTURE:
1. typography:
   - primary_font_direction: Primary typographic choice/family direction (e.g. Clean geometric sans-serif like Inter or Outfit for modern clarity).
   - secondary_font_direction: Supporting typographic choice for body text or data tables (e.g. Neutral grotesque sans-serif or crisp monospace for technical accuracy).
   - typography_rationale: Strategic rationale explaining why these typography choices embody the brand personality and serve the target audience.
2. color_direction:
   - primary_colors: 1 to 3 primary color specifications with hex codes or clear descriptive terms (e.g. ["#4F46E5 - Deep Indigo", "#0F172A - Slate Navy"]).
   - supporting_colors: 2 to 4 supporting/neutral colors (e.g. ["#64748B - Cool Slate", "#F8FAFC - Ice White"]).
   - accent_color: High-visibility accent color (e.g. "#F59E0B - Electric Amber").
   - color_mood: Overall visual mood created by the palette (e.g. Focused, Tech-Forward, Trustworthy).
   - color_rationale: Strategic rationale for color selection derived from the differentiator and brand personality.
3. composition:
   - layout_principles: 3 to 5 core layout principles (e.g. Grid-aligned structure, Asymmetric focal points, High contrast data blocks).
   - spacing_character: Description of density and negative space (e.g. Generous padding with modular card grouping).
   - visual_hierarchy: Guidance on visual weight, contrast, and focal order.
   - composition_rationale: Rationale explaining how layout structure reinforces user efficiency.
4. symbols_and_graphics:
   - symbol_direction: Visual direction for iconography and core brand mark (e.g. Interlocking geometric nodes symbolizing team chemistry).
   - shape_language: Geometric character (e.g. Softened 12px corner radii with crisp 1px borders).
   - iconography_direction: Icon style specifications (e.g. Monoline 2px stroke vectors with accent color highlights).
   - graphic_motifs: 2 to 4 visual motifs or structural patterns (e.g. Connective line networks, Modular glass card containers).
   - rationale: Rationale explaining why these graphic elements reinforce the differentiator.
5. imagery:
   - photography_or_illustration_style: Style choice (e.g. Authentic candid photography combined with precise UI line art).
   - subject_direction: Subject focus (e.g. Real college students engaged in collaborative project sessions and hackathon builds).
   - lighting_or_mood: Lighting atmosphere (e.g. High-contrast ambient room lighting with crisp, clear focus).
   - image_characteristics: 3 to 5 required traits for visual media (e.g. Genuine expressions, No staged corporate stock, Focus on real tools).
   - imagery_rationale: Rationale explaining how imagery builds trust with the target audience.
6. concepts_to_avoid: 3 to 5 visual clichés, styles, or motifs to explicitly avoid (e.g. Generic 3D clay avatars, Stock handshake photos) with reasons why they weaken the brand strategy.
7. visual_summary: A concise, holistic summary explaining how typography, color, composition, graphics, and imagery unite into a cohesive system reflecting the Position and Shape strategy.

QUALITY & STRATEGIC RULES:
- Derive all visual decisions directly from Phase 1-3 inputs.
- Avoid generic filler (e.g. "modern, clean, minimal") without specific functional justification.
- Connect personality traits directly to visual choices.
- Distinguish visual direction from final logo rendering.

DO NOT GENERATE (STRICT CONSTRAINTS):
- Do NOT generate final logo graphics, final brand kits, social media posts, landing page code, launch assets, or critique workflows.
- Focus strictly on strategic visual direction.

Return ONLY a valid JSON object adhering strictly to the requested schema.
"""

CANDIDATE_MODELS = [
    "gemini-3.5-flash-lite",
    "gemini-flash-lite-latest",
    "gemini-1.5-flash",
    "gemini-1.5-pro"
]

def generate_visualize_prompt(disc: DiscoverResponse, pos: PositionResponse, shp: ShapeResponse) -> str:
    traits_str = "\n".join(f"- {t.trait}: {t.justification}" for t in shp.personality_traits) if shp.personality_traits else "None specified"
    avoid_traits_str = "\n".join(f"- {a.trait}: {a.reason}" for a in shp.traits_to_avoid) if shp.traits_to_avoid else "None specified"
    territories_str = "\n".join(f"- {n.name}: {n.concept} (Examples: {', '.join(n.example_names)})" for n in shp.naming_territories) if shp.naming_territories else "None specified"

    return f"""Phase 1 Discover Context:
- Problem: {disc.problem}
- Target User: {disc.target_user}
- Context: {disc.context}
- Value: {disc.value}

Phase 2 Position Context:
- Category: {pos.category}
- Differentiator: {pos.differentiator}
- Value Proposition: {pos.value_proposition}
- Competitive Angle: {pos.competitive_angle}
- Positioning Statement: {pos.positioning_statement}

Phase 3 Shape Verbal Identity Context:
- Tagline: {shp.tagline}
- Personality Traits:
{traits_str}
- Traits to Avoid:
{avoid_traits_str}
- Naming Territories:
{territories_str}
- Brand Voice: {shp.brand_voice.description} (Tone: {', '.join(shp.brand_voice.tone_characteristics)})
- Primary Message: {shp.message_hierarchy.primary_message}

Task: Formulate a cohesive visual direction (typography, colors, composition, symbols & graphics, imagery, concepts to avoid, and visual summary) based on the combined Discover, Position, and Shape context above.
"""

def analyze_visualize(disc: DiscoverResponse, pos: PositionResponse, shp: ShapeResponse) -> VisualizeResponse:
    """
    Invokes the Gemini API to derive a structured VisualizeResponse from Phase 1, 2, and 3 contexts.
    """
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key or api_key == "your_gemini_api_key_here":
        raise ValueError("GEMINI_API_KEY is not configured. Please set a valid API key in your backend .env file.")

    user_prompt = generate_visualize_prompt(disc, pos, shp)
    last_error = None

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)

        for model_name in CANDIDATE_MODELS:
            for attempt in range(2):
                try:
                    logger.info(f"Attempting Gemini visualize generation with model {model_name} (attempt {attempt + 1})...")
                    response = client.models.generate_content(
                        model=model_name,
                        contents=user_prompt,
                        config=types.GenerateContentConfig(
                            system_instruction=VISUALIZE_SYSTEM_INSTRUCTION,
                            response_mime_type="application/json",
                            response_schema=VisualizeResponse,
                            temperature=0.2,
                        ),
                    )

                    if hasattr(response, "parsed") and response.parsed is not None:
                        if isinstance(response.parsed, VisualizeResponse):
                            return response.parsed
                        elif isinstance(response.parsed, dict):
                            return VisualizeResponse(**response.parsed)

                    raw_text = response.text if hasattr(response, "text") else ""
                    if raw_text:
                        cleaned_text = raw_text.strip()
                        if cleaned_text.startswith("```"):
                            cleaned_text = cleaned_text.split("```")[1]
                            if cleaned_text.startswith("json"):
                                cleaned_text = cleaned_text[4:]
                            cleaned_text = cleaned_text.strip()
                        data = json.loads(cleaned_text)
                        return VisualizeResponse(**data)

                except Exception as model_err:
                    logger.warning(f"Model {model_name} attempt {attempt + 1} visualize generation failed: {model_err}")
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
                    system_instruction=VISUALIZE_SYSTEM_INSTRUCTION,
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
                return VisualizeResponse(**data)
            except Exception as legacy_err:
                last_error = legacy_err
                continue

    if last_error:
        raise last_error

    raise RuntimeError("Failed to obtain structured visual strategy analysis from Gemini API.")
