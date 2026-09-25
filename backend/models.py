from pydantic import BaseModel, Field

class DiscoverRequest(BaseModel):
    idea: str = Field(
        ...,
        description="The rough product or startup idea submitted by the user.",
        examples=["I want to build an app that helps college students find teammates for hackathons."]
    )

class DiscoverResponse(BaseModel):
    problem: str = Field(
        ...,
        description="The core problem identified from the idea."
    )
    target_user: str = Field(
        ...,
        description="The primary target user or persona."
    )
    context: str = Field(
        ...,
        description="The relevant context surrounding the idea."
    )
    value: str = Field(
        ...,
        description="Why solving the problem is useful and valuable."
    )
    pain_points: list[str] = Field(
        ...,
        description="List of specific pain points."
    )
    constraints: list[str] = Field(
        ...,
        description="List of known or anticipated constraints."
    )
    assumptions: list[str] = Field(
        ...,
        description="List of underlying assumptions separated from explicit facts."
    )
    open_questions: list[str] = Field(
        ...,
        description="List of unanswered questions that should be addressed before branding."
    )

class PositionRequest(BaseModel):
    discover_context: DiscoverResponse = Field(
        ...,
        description="The structured insights output from Phase 1 Discover stage."
    )

class PositionResponse(BaseModel):
    category: str = Field(
        ...,
        description="Defined product or market category."
    )
    category_reason: str = Field(
        ...,
        description="Strategic reasoning behind selecting this category."
    )
    differentiator: str = Field(
        ...,
        description="Specific factor setting the product apart for the target audience."
    )
    differentiator_reason: str = Field(
        ...,
        description="Why this differentiator matters to the target user and problem space."
    )
    value_proposition: str = Field(
        ...,
        description="Clear explanation of the core benefit delivered to the user."
    )
    value_proposition_reason: str = Field(
        ...,
        description="Why this value proposition aligns with the problem and value drivers."
    )
    competitive_angle: str = Field(
        ...,
        description="How the product is positioned relative to alternatives or the status quo."
    )
    competitive_angle_reason: str = Field(
        ...,
        description="Strategic rationale for this competitive framing."
    )
    positioning_statement: str = Field(
        ...,
        description="Synthesized strategic positioning statement framing category, target, benefit, and differentiator."
    )

# Phase 3: Shape Models
class PersonalityTrait(BaseModel):
    trait: str = Field(..., description="Name of the personality trait.")
    justification: str = Field(..., description="Short justification linking trait to target audience/positioning.")

class TraitToAvoid(BaseModel):
    trait: str = Field(..., description="Trait or brand behavior to explicitly avoid.")
    reason: str = Field(..., description="Why this trait would weaken or contradict the intended identity.")

class NamingTerritory(BaseModel):
    name: str = Field(..., description="Strategic label of the naming territory.")
    concept: str = Field(..., description="Core creative concept and theme behind this naming direction.")
    rationale: str = Field(..., description="Strategic rationale explaining why this territory fits the positioning.")
    example_names: list[str] = Field(..., description="3 to 5 example brand names illustrating this territory.")

class BrandVoice(BaseModel):
    description: str = Field(..., description="Overarching description of how the brand communicates.")
    tone_characteristics: list[str] = Field(..., description="3 to 5 actionable tone descriptors.")
    language_style: str = Field(..., description="Guidelines on vocabulary, syntax, and phrasing style.")

class MessageHierarchy(BaseModel):
    primary_message: str = Field(..., description="The single primary brand message.")
    supporting_messages: list[str] = Field(..., description="Supporting message pillars reinforcing the primary message.")
    proof_or_reason_to_believe: str = Field(..., description="Functional proof points or reasons to believe.")

class ShapeRequest(BaseModel):
    discover_context: DiscoverResponse = Field(..., description="Structured insights output from Phase 1 Discover stage.")
    position_context: PositionResponse = Field(..., description="Structured output from Phase 2 Position stage.")

class ShapeResponse(BaseModel):
    personality_traits: list[PersonalityTrait] = Field(..., description="3 to 5 core brand personality traits with justifications.")
    traits_to_avoid: list[TraitToAvoid] = Field(..., description="Traits or brand behaviors to avoid with reasons.")
    naming_territories: list[NamingTerritory] = Field(..., description="3 to 5 distinct naming territories with concept, rationale, and example names.")
    brand_voice: BrandVoice = Field(..., description="Structured brand voice guidelines.")
    tagline: str = Field(..., description="One primary tagline aligned with the positioning.")
    message_hierarchy: MessageHierarchy = Field(..., description="Structured message hierarchy.")
    shape_summary: str = Field(..., description="Concise summary showing how personality, naming, voice, and messaging fit positioning.")

# Phase 4: Visualize Models
class TypographyDirection(BaseModel):
    primary_font_direction: str = Field(..., description="Primary font choice/family direction.")
    secondary_font_direction: str = Field(..., description="Secondary font choice/family direction.")
    typography_rationale: str = Field(..., description="Rationale connecting typography choices to brand personality.")

class ColorDirection(BaseModel):
    primary_colors: list[str] = Field(..., description="1 to 3 primary brand colors (hex or descriptive names).")
    supporting_colors: list[str] = Field(..., description="Supporting/neutral colors.")
    accent_color: str = Field(..., description="High-visibility accent color.")
    color_mood: str = Field(..., description="Overall emotional mood created by the palette.")
    color_rationale: str = Field(..., description="Strategic rationale for color selection.")

class CompositionDirection(BaseModel):
    layout_principles: list[str] = Field(..., description="Key structural layout rules and grid principles.")
    spacing_character: str = Field(..., description="Character of spacing and density.")
    visual_hierarchy: str = Field(..., description="Guidance on visual weight, contrast, and element ordering.")
    composition_rationale: str = Field(..., description="Strategic rationale connecting composition to brand value.")

class SymbolsAndGraphics(BaseModel):
    symbol_direction: str = Field(..., description="Abstract or figurative direction for symbolism.")
    shape_language: str = Field(..., description="Geometric character (e.g., Rounded corners, Sharp angles, Interlocking shapes).")
    iconography_direction: str = Field(..., description="Style and stroke characteristics for icons.")
    graphic_motifs: list[str] = Field(..., description="Repeating visual motifs, patterns, or framing structures.")
    rationale: str = Field(..., description="Strategic rationale connecting symbols/graphics to differentiator.")

class ImageryDirection(BaseModel):
    photography_or_illustration_style: str = Field(..., description="Style direction for visual assets.")
    subject_direction: str = Field(..., description="Subject matter focus.")
    lighting_or_mood: str = Field(..., description="Lighting quality, atmosphere, and visual temperature.")
    image_characteristics: list[str] = Field(..., description="Key characteristics that images must embody.")
    imagery_rationale: str = Field(..., description="Rationale explaining why this imagery style fits the target audience.")

class VisualConceptToAvoid(BaseModel):
    concept: str = Field(..., description="Visual cliché, style, or motif to explicitly avoid.")
    reason: str = Field(..., description="Why this visual concept contradicts or weakens the brand identity.")

class VisualizeRequest(BaseModel):
    discover_context: DiscoverResponse = Field(..., description="Structured insights output from Phase 1 Discover stage.")
    position_context: PositionResponse = Field(..., description="Structured output from Phase 2 Position stage.")
    shape_context: ShapeResponse = Field(..., description="Structured output from Phase 3 Shape stage.")

class VisualizeResponse(BaseModel):
    typography: TypographyDirection = Field(..., description="Typography strategy and font direction.")
    color_direction: ColorDirection = Field(..., description="Color palette, mood, and rationale.")
    composition: CompositionDirection = Field(..., description="Layout principles, spacing, and hierarchy.")
    symbols_and_graphics: SymbolsAndGraphics = Field(..., description="Symbol direction, shape language, and graphic motifs.")
    imagery: ImageryDirection = Field(..., description="Photography or illustration style, subject focus, and mood.")
    concepts_to_avoid: list[VisualConceptToAvoid] = Field(..., description="Visual concepts, clichés, or styles to avoid with reasons.")
    visual_summary: str = Field(..., description="Concise explanation showing how the visual system reflects Position and Shape decisions.")

# Phase 5: Challenge Models
class ClicheDetected(BaseModel):
    area: str = Field(..., description="Brand strategy dimension where cliché was detected (e.g., Positioning, Voice, Visuals).")
    current_choice: str = Field(..., description="The cliché, overused term, or generic choice currently in place.")
    why_generic: str = Field(..., description="Detailed explanation of why this decision is cliché or overused in the industry.")
    stronger_alternative: str = Field(..., description="A concrete, highly distinctive replacement or alternative direction.")

class ContradictionItem(BaseModel):
    area: str = Field(..., description="The cross-stage area experiencing friction or misalignment.")
    element_a: str = Field(..., description="First decision or element involved in the contradiction.")
    element_b: str = Field(..., description="Second decision or element conflicting with element_a.")
    conflict: str = Field(..., description="Explanation of why these two choices contradict each other.")
    recommended_fix: str = Field(..., description="Strategic resolution to harmonize the two elements.")

class AudienceMismatch(BaseModel):
    decision: str = Field(..., description="The brand decision evaluated against audience needs.")
    audience_issue: str = Field(..., description="Specific gap or disconnect with the target user persona.")
    why_it_matters: str = Field(..., description="Impact of this mismatch on user adoption, trust, or engagement.")
    recommended_change: str = Field(..., description="Actionable modification to align decision with audience preferences.")

class WeakAssumption(BaseModel):
    assumption: str = Field(..., description="Implicit or unproven assumption embedded in the strategy.")
    risk: str = Field(..., description="Strategic or operational risk if this assumption proves false.")
    validation_needed: str = Field(..., description="Specific test, survey, or market research needed to validate.")

class DistinctivenessGap(BaseModel):
    area: str = Field(..., description="Dimension lacking strong brand differentiation.")
    problem: str = Field(..., description="Why the current execution feels commodity-like or generic.")
    why_generic: str = Field(..., description="Root cause of the lack of distinctiveness.")
    improvement_direction: str = Field(..., description="Actionable recommendation to inject unique brand character.")

class ConsistencyFinding(BaseModel):
    connected_elements: str = Field(..., description="System elements evaluated for holistic coherence.")
    status_or_issue: str = Field(..., description="Status (e.g., Coherent, Partial Disconnect, Major Disconnect).")
    explanation: str = Field(..., description="Systematic evaluation of how well these elements fit together.")
    recommended_adjustment: str = Field(..., description="Adjustment required to strengthen holistic system unity.")

class ChallengeRequest(BaseModel):
    discover_context: DiscoverResponse = Field(..., description="Structured insights output from Phase 1 Discover stage.")
    position_context: PositionResponse = Field(..., description="Structured output from Phase 2 Position stage.")
    shape_context: ShapeResponse = Field(..., description="Structured output from Phase 3 Shape stage.")
    visualize_context: VisualizeResponse = Field(..., description="Structured output from Phase 4 Visualize stage.")

class ChallengeResponse(BaseModel):
    cliches_detected: list[ClicheDetected] = Field(..., description="List of detected clichés and generic patterns with stronger alternatives.")
    contradictions: list[ContradictionItem] = Field(..., description="Detected contradictions across stages with recommended fixes.")
    audience_mismatches: list[AudienceMismatch] = Field(..., description="Identified audience mismatches and corrective guidance.")
    weak_assumptions: list[WeakAssumption] = Field(..., description="Unverified assumptions, risks, and required validation steps.")
    distinctiveness_gaps: list[DistinctivenessGap] = Field(..., description="Areas lacking distinctiveness with elevation directions.")
    consistency_findings: list[ConsistencyFinding] = Field(..., description="Holistic system coherence findings and adjustments.")
    challenge_summary: str = Field(..., description="Concise overall summary of the critical evaluation.")
    recommended_changes: list[str] = Field(..., description="Prioritized list of highest-impact changes recommended before delivery.")




