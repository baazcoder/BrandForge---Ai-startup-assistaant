export interface DiscoverResponse {
  problem: string;
  target_user: string;
  context: string;
  value: string;
  pain_points: string[];
  constraints: string[];
  assumptions: string[];
  open_questions: string[];
}

export interface DiscoverRequest {
  idea: string;
}

export interface PositionResponse {
  category: string;
  category_reason: string;
  differentiator: string;
  differentiator_reason: string;
  value_proposition: string;
  value_proposition_reason: string;
  competitive_angle: string;
  competitive_angle_reason: string;
  positioning_statement: string;
}

export interface PositionRequest {
  discover_context: DiscoverResponse;
}

export interface PersonalityTrait {
  trait: string;
  justification: string;
}

export interface TraitToAvoid {
  trait: string;
  reason: string;
}

export interface NamingTerritory {
  name: string;
  concept: string;
  rationale: string;
  example_names: string[];
}

export interface BrandVoice {
  description: string;
  tone_characteristics: string[];
  language_style: string;
}

export interface MessageHierarchy {
  primary_message: string;
  supporting_messages: string[];
  proof_or_reason_to_believe: string;
}

export interface ShapeResponse {
  personality_traits: PersonalityTrait[];
  traits_to_avoid: TraitToAvoid[];
  naming_territories: NamingTerritory[];
  brand_voice: BrandVoice;
  tagline: string;
  message_hierarchy: MessageHierarchy;
  shape_summary: string;
}

export interface ShapeRequest {
  discover_context: DiscoverResponse;
  position_context: PositionResponse;
}

export interface TypographyDirection {
  primary_font_direction: string;
  secondary_font_direction: string;
  typography_rationale: string;
}

export interface ColorDirection {
  primary_colors: string[];
  supporting_colors: string[];
  accent_color: string;
  color_mood: string;
  color_rationale: string;
}

export interface CompositionDirection {
  layout_principles: string[];
  spacing_character: string;
  visual_hierarchy: string;
  composition_rationale: string;
}

export interface SymbolsAndGraphics {
  symbol_direction: string;
  shape_language: string;
  iconography_direction: string;
  graphic_motifs: string[];
  rationale: string;
}

export interface ImageryDirection {
  photography_or_illustration_style: string;
  subject_direction: string;
  lighting_or_mood: string;
  image_characteristics: string[];
  imagery_rationale: string;
}

export interface VisualConceptToAvoid {
  concept: string;
  reason: string;
}

export interface VisualizeResponse {
  typography: TypographyDirection;
  color_direction: ColorDirection;
  composition: CompositionDirection;
  symbols_and_graphics: SymbolsAndGraphics;
  imagery: ImageryDirection;
  concepts_to_avoid: VisualConceptToAvoid[];
  visual_summary: string;
}

export interface VisualizeRequest {
  discover_context: DiscoverResponse;
  position_context: PositionResponse;
  shape_context: ShapeResponse;
}

export interface ClicheDetected {
  area: string;
  current_choice: string;
  why_generic: string;
  stronger_alternative: string;
}

export interface ContradictionItem {
  area: string;
  element_a: string;
  element_b: string;
  conflict: string;
  recommended_fix: string;
}

export interface AudienceMismatch {
  decision: string;
  audience_issue: string;
  why_it_matters: string;
  recommended_change: string;
}

export interface WeakAssumption {
  assumption: string;
  risk: string;
  validation_needed: string;
}

export interface DistinctivenessGap {
  area: string;
  problem: string;
  why_generic: string;
  improvement_direction: string;
}

export interface ConsistencyFinding {
  connected_elements: string;
  status_or_issue: string;
  explanation: string;
  recommended_adjustment: string;
}

export interface ChallengeResponse {
  cliches_detected: ClicheDetected[];
  contradictions: ContradictionItem[];
  audience_mismatches: AudienceMismatch[];
  weak_assumptions: WeakAssumption[];
  distinctiveness_gaps: DistinctivenessGap[];
  consistency_findings: ConsistencyFinding[];
  challenge_summary: string;
  recommended_changes: string[];
}

export interface ChallengeRequest {
  discover_context: DiscoverResponse;
  position_context: PositionResponse;
  shape_context: ShapeResponse;
  visualize_context: VisualizeResponse;
}


function getApiEndpoint(): string {
  let base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").trim().replace(/\/+$/, "");
  if (base.endsWith("/api")) {
    return `${base}/discover`;
  }
  return `${base}/api/discover`;
}

function getPositionEndpoint(): string {
  let base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").trim().replace(/\/+$/, "");
  if (base.endsWith("/api")) {
    return `${base}/position`;
  }
  return `${base}/api/position`;
}

function getShapeEndpoint(): string {
  let base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").trim().replace(/\/+$/, "");
  if (base.endsWith("/api")) {
    return `${base}/shape`;
  }
  return `${base}/api/shape`;
}

function getVisualizeEndpoint(): string {
  let base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").trim().replace(/\/+$/, "");
  if (base.endsWith("/api")) {
    return `${base}/visualize`;
  }
  return `${base}/api/visualize`;
}

function getChallengeEndpoint(): string {
  let base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").trim().replace(/\/+$/, "");
  if (base.endsWith("/api")) {
    return `${base}/challenge`;
  }
  return `${base}/api/challenge`;
}

export async function discoverIdea(idea: string): Promise<DiscoverResponse> {
  const trimmed = idea.trim();
  if (!trimmed) {
    throw new Error("Idea cannot be empty. Please enter your product or startup idea.");
  }

  if (trimmed.length < 5) {
    throw new Error("Idea is too short. Please provide a bit more detail (at least 5 characters).");
  }

  const endpoint = getApiEndpoint();
  console.log(`[Frontend API] Sending POST request to: ${endpoint}`);

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idea: trimmed }),
    });
  } catch (err: unknown) {
    console.error("[Frontend API] Network or connection error:", err);
    throw new Error(`Unable to connect to backend server at ${endpoint}. Please make sure the FastAPI backend is running.`);
  }

  // Log HTTP status immediately after fetch returns
  console.log(`[Frontend API] HTTP Status: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    let errorMessage = `Server error (${response.status})`;
    try {
      const errorData = await response.json();
      console.error("[Frontend API] Error Response Payload:", errorData);
      if (errorData && errorData.detail) {
        errorMessage = typeof errorData.detail === "string" ? errorData.detail : JSON.stringify(errorData.detail);
      }
    } catch {
      // Ignore JSON parse error for error body
    }
    throw new Error(errorMessage);
  }

  const rawJson = await response.json();
  console.log("[Frontend API] Parsed Response Body:", rawJson);

  // Unwrap response if nested
  let targetObj: any = rawJson;
  if (rawJson && typeof rawJson === "object") {
    if ("discover" in rawJson && rawJson.discover) targetObj = rawJson.discover;
    else if ("result" in rawJson && rawJson.result) targetObj = rawJson.result;
    else if ("data" in rawJson && rawJson.data) targetObj = rawJson.data;
    else if ("output" in rawJson && rawJson.output) targetObj = rawJson.output;
  }

  const normalized: DiscoverResponse = {
    problem: targetObj.problem || targetObj.core_problem || targetObj.coreProblem || "",
    target_user: targetObj.target_user || targetObj.targetUser || targetObj.primary_user || "",
    context: targetObj.context || "",
    value: targetObj.value || targetObj.value_proposition || "",
    pain_points: Array.isArray(targetObj.pain_points) ? targetObj.pain_points : (Array.isArray(targetObj.painPoints) ? targetObj.painPoints : []),
    constraints: Array.isArray(targetObj.constraints) ? targetObj.constraints : [],
    assumptions: Array.isArray(targetObj.assumptions) ? targetObj.assumptions : [],
    open_questions: Array.isArray(targetObj.open_questions) ? targetObj.open_questions : (Array.isArray(targetObj.openQuestions) ? targetObj.openQuestions : []),
  };

  if (!normalized.problem) {
    throw new Error("Invalid response structure: missing 'problem' field in AI output.");
  }

  console.log("[Frontend API] Normalized DiscoverResponse:", normalized);
  return normalized;
}

export async function generatePosition(discoverContext: DiscoverResponse): Promise<PositionResponse> {
  if (!discoverContext || !discoverContext.problem) {
    throw new Error("Valid Phase 1 Discover context is required before generating Position strategy.");
  }

  const endpoint = getPositionEndpoint();
  console.log(`[Frontend API] Sending Position POST request to: ${endpoint}`);

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ discover_context: discoverContext }),
    });
  } catch (err: unknown) {
    console.error("[Frontend API] Position network error:", err);
    throw new Error(`Unable to connect to backend server at ${endpoint}. Please ensure backend is running.`);
  }

  console.log(`[Frontend API] Position HTTP Status: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    let errorMessage = `Server error (${response.status})`;
    try {
      const errorData = await response.json();
      console.error("[Frontend API] Position Error Payload:", errorData);
      if (errorData && errorData.detail) {
        errorMessage = typeof errorData.detail === "string" ? errorData.detail : JSON.stringify(errorData.detail);
      }
    } catch {
      // Ignore JSON parse error
    }
    throw new Error(errorMessage);
  }

  const rawJson = await response.json();
  console.log("[Frontend API] Parsed Position Response Body:", rawJson);

  let targetObj: any = rawJson;
  if (rawJson && typeof rawJson === "object") {
    if ("position" in rawJson && rawJson.position) targetObj = rawJson.position;
    else if ("result" in rawJson && rawJson.result) targetObj = rawJson.result;
    else if ("data" in rawJson && rawJson.data) targetObj = rawJson.data;
  }

  const normalized: PositionResponse = {
    category: targetObj.category || "",
    category_reason: targetObj.category_reason || targetObj.categoryReason || "",
    differentiator: targetObj.differentiator || "",
    differentiator_reason: targetObj.differentiator_reason || targetObj.differentiatorReason || "",
    value_proposition: targetObj.value_proposition || targetObj.valueProposition || "",
    value_proposition_reason: targetObj.value_proposition_reason || targetObj.valuePropositionReason || "",
    competitive_angle: targetObj.competitive_angle || targetObj.competitiveAngle || "",
    competitive_angle_reason: targetObj.competitive_angle_reason || targetObj.competitiveAngleReason || "",
    positioning_statement: targetObj.positioning_statement || targetObj.positioningStatement || "",
  };

  if (!normalized.category || !normalized.differentiator || !normalized.value_proposition || !normalized.competitive_angle) {
    throw new Error("Invalid position response structure: missing required positioning fields.");
  }

  console.log("[Frontend API] Normalized PositionResponse:", normalized);
  return normalized;
}

export async function generateShape(
  discoverContext: DiscoverResponse,
  positionContext: PositionResponse
): Promise<ShapeResponse> {
  if (!discoverContext || !discoverContext.problem) {
    throw new Error("Valid Phase 1 Discover context is required before generating Shape strategy.");
  }
  if (!positionContext || !positionContext.category) {
    throw new Error("Valid Phase 2 Position context is required before generating Shape strategy.");
  }

  const endpoint = getShapeEndpoint();
  console.log(`[Frontend API] Sending Shape POST request to: ${endpoint}`);

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        discover_context: discoverContext,
        position_context: positionContext,
      }),
    });
  } catch (err: unknown) {
    console.error("[Frontend API] Shape network error:", err);
    throw new Error(`Unable to connect to backend server at ${endpoint}. Please ensure backend is running.`);
  }

  console.log(`[Frontend API] Shape HTTP Status: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    let errorMessage = `Server error (${response.status})`;
    try {
      const errorData = await response.json();
      console.error("[Frontend API] Shape Error Payload:", errorData);
      if (errorData && errorData.detail) {
        errorMessage = typeof errorData.detail === "string" ? errorData.detail : JSON.stringify(errorData.detail);
      }
    } catch {
      // Ignore JSON parse error
    }
    throw new Error(errorMessage);
  }

  const rawJson = await response.json();
  console.log("[Frontend API] Parsed Shape Response Body:", rawJson);

  let targetObj: any = rawJson;
  if (rawJson && typeof rawJson === "object") {
    if ("shape" in rawJson && rawJson.shape) targetObj = rawJson.shape;
    else if ("result" in rawJson && rawJson.result) targetObj = rawJson.result;
    else if ("data" in rawJson && rawJson.data) targetObj = rawJson.data;
  }

  const normalized: ShapeResponse = {
    personality_traits: Array.isArray(targetObj.personality_traits) ? targetObj.personality_traits : [],
    traits_to_avoid: Array.isArray(targetObj.traits_to_avoid) ? targetObj.traits_to_avoid : [],
    naming_territories: Array.isArray(targetObj.naming_territories) ? targetObj.naming_territories : [],
    brand_voice: targetObj.brand_voice || { description: "", tone_characteristics: [], language_style: "" },
    tagline: targetObj.tagline || "",
    message_hierarchy: targetObj.message_hierarchy || { primary_message: "", supporting_messages: [], proof_or_reason_to_believe: "" },
    shape_summary: targetObj.shape_summary || "",
  };

  if (!normalized.tagline || normalized.personality_traits.length === 0 || normalized.naming_territories.length === 0) {
    throw new Error("Invalid shape response structure: missing required brand identity fields.");
  }

  console.log("[Frontend API] Normalized ShapeResponse:", normalized);
  return normalized;
}

export async function generateVisualize(
  discoverContext: DiscoverResponse,
  positionContext: PositionResponse,
  shapeContext: ShapeResponse
): Promise<VisualizeResponse> {
  if (!discoverContext || !discoverContext.problem) {
    throw new Error("Valid Phase 1 Discover context is required before generating Visual strategy.");
  }
  if (!positionContext || !positionContext.category) {
    throw new Error("Valid Phase 2 Position context is required before generating Visual strategy.");
  }
  if (!shapeContext || !shapeContext.tagline) {
    throw new Error("Valid Phase 3 Shape context is required before generating Visual strategy.");
  }

  const endpoint = getVisualizeEndpoint();
  console.log(`[Frontend API] Sending Visualize POST request to: ${endpoint}`);

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        discover_context: discoverContext,
        position_context: positionContext,
        shape_context: shapeContext,
      }),
    });
  } catch (err: unknown) {
    console.error("[Frontend API] Visualize network error:", err);
    throw new Error(`Unable to connect to backend server at ${endpoint}. Please ensure backend is running.`);
  }

  console.log(`[Frontend API] Visualize HTTP Status: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    let errorMessage = `Server error (${response.status})`;
    try {
      const errorData = await response.json();
      console.error("[Frontend API] Visualize Error Payload:", errorData);
      if (errorData && errorData.detail) {
        errorMessage = typeof errorData.detail === "string" ? errorData.detail : JSON.stringify(errorData.detail);
      }
    } catch {
      // Ignore JSON parse error
    }
    throw new Error(errorMessage);
  }

  const rawJson = await response.json();
  console.log("[Frontend API] Parsed Visualize Response Body:", rawJson);

  let targetObj: any = rawJson;
  if (rawJson && typeof rawJson === "object") {
    if ("visualize" in rawJson && rawJson.visualize) targetObj = rawJson.visualize;
    else if ("result" in rawJson && rawJson.result) targetObj = rawJson.result;
    else if ("data" in rawJson && rawJson.data) targetObj = rawJson.data;
  }

  const normalized: VisualizeResponse = {
    typography: targetObj.typography || { primary_font_direction: "", secondary_font_direction: "", typography_rationale: "" },
    color_direction: targetObj.color_direction || { primary_colors: [], supporting_colors: [], accent_color: "", color_mood: "", color_rationale: "" },
    composition: targetObj.composition || { layout_principles: [], spacing_character: "", visual_hierarchy: "", composition_rationale: "" },
    symbols_and_graphics: targetObj.symbols_and_graphics || { symbol_direction: "", shape_language: "", iconography_direction: "", graphic_motifs: [], rationale: "" },
    imagery: targetObj.imagery || { photography_or_illustration_style: "", subject_direction: "", lighting_or_mood: "", image_characteristics: [], imagery_rationale: "" },
    concepts_to_avoid: Array.isArray(targetObj.concepts_to_avoid) ? targetObj.concepts_to_avoid : [],
    visual_summary: targetObj.visual_summary || "",
  };

  if (!normalized.typography.primary_font_direction || !normalized.color_direction.color_mood || normalized.concepts_to_avoid.length === 0) {
    throw new Error("Invalid visualize response structure: missing required visual strategy fields.");
  }

  console.log("[Frontend API] Normalized VisualizeResponse:", normalized);
  return normalized;
}

export async function generateChallenge(
  discoverContext: DiscoverResponse,
  positionContext: PositionResponse,
  shapeContext: ShapeResponse,
  visualizeContext: VisualizeResponse
): Promise<ChallengeResponse> {
  if (!discoverContext || !discoverContext.problem) {
    throw new Error("Valid Phase 1 Discover context is required before generating Challenge evaluation.");
  }
  if (!positionContext || !positionContext.category) {
    throw new Error("Valid Phase 2 Position context is required before generating Challenge evaluation.");
  }
  if (!shapeContext || !shapeContext.tagline) {
    throw new Error("Valid Phase 3 Shape context is required before generating Challenge evaluation.");
  }
  if (!visualizeContext || !visualizeContext.typography) {
    throw new Error("Valid Phase 4 Visualize context is required before generating Challenge evaluation.");
  }

  const endpoint = getChallengeEndpoint();
  console.log(`[Frontend API] Sending Challenge POST request to: ${endpoint}`);

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        discover_context: discoverContext,
        position_context: positionContext,
        shape_context: shapeContext,
        visualize_context: visualizeContext,
      }),
    });
  } catch (err: unknown) {
    console.error("[Frontend API] Challenge network error:", err);
    throw new Error(`Unable to connect to backend server at ${endpoint}. Please ensure backend is running.`);
  }

  console.log(`[Frontend API] Challenge HTTP Status: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    let errorMessage = `Server error (${response.status})`;
    try {
      const errorData = await response.json();
      console.error("[Frontend API] Challenge Error Payload:", errorData);
      if (errorData && errorData.detail) {
        errorMessage = typeof errorData.detail === "string" ? errorData.detail : JSON.stringify(errorData.detail);
      }
    } catch {
      // Ignore JSON parse error
    }
    throw new Error(errorMessage);
  }

  const rawJson = await response.json();
  console.log("[Frontend API] Parsed Challenge Response Body:", rawJson);

  let targetObj: any = rawJson;
  if (rawJson && typeof rawJson === "object") {
    if ("challenge" in rawJson && rawJson.challenge) targetObj = rawJson.challenge;
    else if ("result" in rawJson && rawJson.result) targetObj = rawJson.result;
    else if ("data" in rawJson && rawJson.data) targetObj = rawJson.data;
  }

  const normalized: ChallengeResponse = {
    cliches_detected: Array.isArray(targetObj.cliches_detected) ? targetObj.cliches_detected : [],
    contradictions: Array.isArray(targetObj.contradictions) ? targetObj.contradictions : [],
    audience_mismatches: Array.isArray(targetObj.audience_mismatches) ? targetObj.audience_mismatches : [],
    weak_assumptions: Array.isArray(targetObj.weak_assumptions) ? targetObj.weak_assumptions : [],
    distinctiveness_gaps: Array.isArray(targetObj.distinctiveness_gaps) ? targetObj.distinctiveness_gaps : [],
    consistency_findings: Array.isArray(targetObj.consistency_findings) ? targetObj.consistency_findings : [],
    challenge_summary: targetObj.challenge_summary || "",
    recommended_changes: Array.isArray(targetObj.recommended_changes) ? targetObj.recommended_changes : [],
  };

  if (!normalized.challenge_summary || normalized.recommended_changes.length === 0) {
    throw new Error("Invalid challenge response structure: missing required challenge evaluation fields.");
  }

  console.log("[Frontend API] Normalized ChallengeResponse:", normalized);
  return normalized;
}

