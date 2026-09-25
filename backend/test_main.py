from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["app"] == "BrandForge API"
    assert "Challenge" in data["stages"]

def test_discover_empty_idea():
    response = client.post("/api/discover", json={"idea": "   "})
    assert response.status_code == 400
    data = response.json()
    assert "Idea cannot be empty" in data["detail"]

def test_discover_short_idea():
    response = client.post("/api/discover", json={"idea": "abc"})
    assert response.status_code == 400
    data = response.json()
    assert "Idea description is too short" in data["detail"]

def test_discover_streetwear_brand():
    prompt = "Build a sustainable streetwear brand for college students."
    response = client.post("/api/discover", json={"idea": prompt})
    assert response.status_code == 200
    data = response.json()
    
    # Verify presence of all 8 required Phase 1 fields
    required_fields = [
        "problem",
        "target_user",
        "context",
        "value",
        "pain_points",
        "constraints",
        "assumptions",
        "open_questions"
    ]
    for field in required_fields:
        assert field in data
        assert data[field] is not None

    # Check array fields are non-empty lists
    assert isinstance(data["pain_points"], list) and len(data["pain_points"]) > 0
    assert isinstance(data["constraints"], list) and len(data["constraints"]) > 0
    assert isinstance(data["assumptions"], list) and len(data["assumptions"]) > 0
    assert isinstance(data["open_questions"], list) and len(data["open_questions"]) > 0

def test_position_endpoint():
    discover_mock = {
        "problem": "College students struggle to find compatible teammates for hackathons and academic projects.",
        "target_user": "Undergraduate computer science and design students.",
        "context": "University hackathons and team-based coursework rapidly growing.",
        "value": "Eliminates team formation friction and improves project outcome quality.",
        "pain_points": ["Last minute team assembly", "Skill set mismatches"],
        "constraints": ["Academic semester timelines", "Free-tier student budget"],
        "assumptions": ["Students want skill-based matching rather than social matching"],
        "open_questions": ["How will student skills be verified?"]
    }
    
    response = client.post("/api/position", json={"discover_context": discover_mock})
    assert response.status_code == 200
    data = response.json()
    
    required_position_fields = [
        "category",
        "category_reason",
        "differentiator",
        "differentiator_reason",
        "value_proposition",
        "value_proposition_reason",
        "competitive_angle",
        "competitive_angle_reason",
        "positioning_statement"
    ]
    for field in required_position_fields:
        assert field in data
        assert isinstance(data[field], str)
        assert len(data[field].strip()) > 0

def test_shape_endpoint():
    discover_mock = {
        "problem": "College students struggle to find compatible teammates for hackathons.",
        "target_user": "Undergraduate students.",
        "context": "Hackathons rapidly growing.",
        "value": "Streamlines team formation.",
        "pain_points": ["Skill mismatches"],
        "constraints": ["Free budget"],
        "assumptions": ["Students want skill-based matching"],
        "open_questions": ["How will skills be verified?"]
    }
    position_mock = {
        "category": "Teammate Discovery Platform",
        "category_reason": "Directly targets academic and hackathon team search.",
        "differentiator": "Skill-complementarity matching.",
        "differentiator_reason": "Eliminates random partner pairing.",
        "value_proposition": "Fast, high-quality team assembly.",
        "value_proposition_reason": "Addresses key pain points.",
        "competitive_angle": "Dedicated matching utility.",
        "competitive_angle_reason": "Outperforms unstructured chat apps.",
        "positioning_statement": "For college students who need hackathon partners, this platform matches compatible teammates."
    }

    response = client.post("/api/shape", json={
        "discover_context": discover_mock,
        "position_context": position_mock
    })
    assert response.status_code == 200
    data = response.json()

    assert "personality_traits" in data and len(data["personality_traits"]) > 0
    assert "traits_to_avoid" in data and len(data["traits_to_avoid"]) > 0
    assert "naming_territories" in data and len(data["naming_territories"]) > 0
    assert "brand_voice" in data
    assert "tagline" in data and len(data["tagline"].strip()) > 0
    assert "message_hierarchy" in data
    assert "shape_summary" in data and len(data["shape_summary"].strip()) > 0

def test_visualize_endpoint():
    discover_mock = {
        "problem": "College students struggle to find compatible teammates for hackathons.",
        "target_user": "Undergraduate students.",
        "context": "Hackathons rapidly growing.",
        "value": "Streamlines team formation.",
        "pain_points": ["Skill mismatches"],
        "constraints": ["Free budget"],
        "assumptions": ["Students want skill-based matching"],
        "open_questions": ["How will skills be verified?"]
    }
    position_mock = {
        "category": "Teammate Discovery Platform",
        "category_reason": "Directly targets academic and hackathon team search.",
        "differentiator": "Skill-complementarity matching.",
        "differentiator_reason": "Eliminates random partner pairing.",
        "value_proposition": "Fast, high-quality team assembly.",
        "value_proposition_reason": "Addresses key pain points.",
        "competitive_angle": "Dedicated matching utility.",
        "competitive_angle_reason": "Outperforms unstructured chat apps.",
        "positioning_statement": "For college students who need hackathon partners, this platform matches compatible teammates."
    }
    shape_mock = {
        "personality_traits": [{"trait": "Driven", "justification": "Matches hackathon energy."}],
        "traits_to_avoid": [{"trait": "Corporate", "reason": "Alienates students."}],
        "naming_territories": [{"name": "Forge", "concept": "Building teams", "rationale": "Strong metaphor", "example_names": ["TeamForge", "HackCraft"]}],
        "brand_voice": {"description": "Direct and energetic", "tone_characteristics": ["Energetic", "Clear"], "language_style": "Action-oriented"},
        "tagline": "Build Teams. Win Hackathons.",
        "message_hierarchy": {"primary_message": "Find your ideal hackathon team in seconds.", "supporting_messages": ["Skill matching"], "proof_or_reason_to_believe": "Instant verification"},
        "shape_summary": "Energetic, student-first brand identity."
    }

    response = client.post("/api/visualize", json={
        "discover_context": discover_mock,
        "position_context": position_mock,
        "shape_context": shape_mock
    })
    assert response.status_code == 200
    data = response.json()

    assert "typography" in data
    assert "primary_font_direction" in data["typography"]
    assert "color_direction" in data
    assert "primary_colors" in data["color_direction"]
    assert "composition" in data
    assert "symbols_and_graphics" in data
    assert "imagery" in data
    assert "concepts_to_avoid" in data and len(data["concepts_to_avoid"]) > 0
    assert "visual_summary" in data and len(data["visual_summary"].strip()) > 0

def test_challenge_endpoint():
    discover_mock = {
        "problem": "College students struggle to find compatible teammates for hackathons.",
        "target_user": "Undergraduate students.",
        "context": "Hackathons rapidly growing.",
        "value": "Streamlines team formation.",
        "pain_points": ["Skill mismatches"],
        "constraints": ["Free budget"],
        "assumptions": ["Students want skill-based matching"],
        "open_questions": ["How will skills be verified?"]
    }
    position_mock = {
        "category": "Teammate Discovery Platform",
        "category_reason": "Directly targets academic and hackathon team search.",
        "differentiator": "Skill-complementarity matching.",
        "differentiator_reason": "Eliminates random partner pairing.",
        "value_proposition": "Fast, high-quality team assembly.",
        "value_proposition_reason": "Addresses key pain points.",
        "competitive_angle": "Dedicated matching utility.",
        "competitive_angle_reason": "Outperforms unstructured chat apps.",
        "positioning_statement": "For college students who need hackathon partners, this platform matches compatible teammates."
    }
    shape_mock = {
        "personality_traits": [{"trait": "Driven", "justification": "Matches hackathon energy."}],
        "traits_to_avoid": [{"trait": "Corporate", "reason": "Alienates students."}],
        "naming_territories": [{"name": "Forge", "concept": "Building teams", "rationale": "Strong metaphor", "example_names": ["TeamForge", "HackCraft"]}],
        "brand_voice": {"description": "Direct and energetic", "tone_characteristics": ["Energetic", "Clear"], "language_style": "Action-oriented"},
        "tagline": "Build Teams. Win Hackathons.",
        "message_hierarchy": {"primary_message": "Find your ideal hackathon team in seconds.", "supporting_messages": ["Skill matching"], "proof_or_reason_to_believe": "Instant verification"},
        "shape_summary": "Energetic, student-first brand identity."
    }
    visualize_mock = {
        "typography": {"primary_font_direction": "Inter", "secondary_font_direction": "JetBrains Mono", "typography_rationale": "Clean and technical."},
        "color_direction": {"primary_colors": ["#1E293B - Deep Slate", "#2563EB - Precision Blue"], "supporting_colors": ["#F8FAFC - Pure Canvas"], "accent_color": "#10B981 - Verified Emerald", "color_mood": "Analytical and Focused", "color_rationale": "High contrast academic palette."},
        "composition": {"layout_principles": ["Grid alignment"], "spacing_character": "Modular density", "visual_hierarchy": "Skill priority", "composition_rationale": "Reduces cognitive load."},
        "symbols_and_graphics": {"symbol_direction": "Interlocking nodes", "shape_language": "Rounded 6px", "iconography_direction": "Monoline vectors", "graphic_motifs": ["Node networks"], "rationale": "Skill network metaphor."},
        "imagery": {"photography_or_illustration_style": "Authentic student photojournalism", "subject_direction": "Students in hackathon builds", "lighting_or_mood": "Ambient crisp light", "image_characteristics": ["Genuine expressions"], "imagery_rationale": "Peer trust."},
        "concepts_to_avoid": [{"concept": "Generic 3D avatars", "reason": "Weakens technical authenticity."}],
        "visual_summary": "Clean, structural aesthetic rooted in academic infrastructure."
    }

    response = client.post("/api/challenge", json={
        "discover_context": discover_mock,
        "position_context": position_mock,
        "shape_context": shape_mock,
        "visualize_context": visualize_mock
    })
    assert response.status_code == 200
    data = response.json()

    assert "cliches_detected" in data and len(data["cliches_detected"]) > 0
    assert "contradictions" in data
    assert "audience_mismatches" in data
    assert "weak_assumptions" in data and len(data["weak_assumptions"]) > 0
    assert "distinctiveness_gaps" in data
    assert "consistency_findings" in data
    assert "challenge_summary" in data and len(data["challenge_summary"].strip()) > 0
    assert "recommended_changes" in data and len(data["recommended_changes"]) > 0




