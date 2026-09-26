import os
import logging
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from models import (
    DiscoverRequest, DiscoverResponse,
    PositionRequest, PositionResponse,
    ShapeRequest, ShapeResponse,
    VisualizeRequest, VisualizeResponse,
    ChallengeRequest, ChallengeResponse,
    DeliverRequest, DeliverResponse
)
from services.discover import analyze_idea
from services.position import analyze_position
from services.shape import analyze_shape
from services.visualize import analyze_visualize
from services.challenge import analyze_challenge
from services.deliver import analyze_deliver

# Load environment variables from .env file if present
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("brandforge.main")

app = FastAPI(
    title="BrandForge AI Backend",
    description="Phases 1-6 API for transforming rough product ideas into structured discovery, positioning, verbal identity, visual strategy, critical challenge evaluation, and final launch-ready Brand Kit delivery.",
    version="1.6.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "app": "BrandForge API",
        "phase": 6,
        "status": "online",
        "stages": ["Discover", "Position", "Shape", "Visualize", "Challenge", "Deliver"]
    }

@app.post(
    "/api/discover",
    response_model=DiscoverResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze a rough product idea and return structured discovery insights"
)
@app.post(
    "/discover",
    response_model=DiscoverResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
async def discover_idea(payload: DiscoverRequest):
    idea_text = payload.idea.strip() if payload.idea else ""
    
    # 1. Validate empty input
    if not idea_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Idea cannot be empty. Please provide a description of your startup or product idea."
        )

    # 2. Validate very short input
    if len(idea_text) < 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Idea description is too short. Please provide a bit more context about your idea (e.g. at least 5 characters)."
        )

    try:
        result = analyze_idea(idea_text)
        logger.info(f"[BACKEND SUCCESS] Returning DiscoverResponse: {result.model_dump_json()}")
        return result
    except ValueError as val_err:
        logger.warning(f"Validation or configuration error in discover service: {val_err}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as exc:
        logger.error(f"Unexpected error during idea discovery: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI analysis service encountered an error processing your request. Please ensure your GEMINI_API_KEY is configured correctly and try again."
        )

@app.post(
    "/api/position",
    response_model=PositionResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate structured brand positioning strategy based on Phase 1 Discover context"
)
@app.post(
    "/position",
    response_model=PositionResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
async def generate_position(payload: PositionRequest):
    if not payload.discover_context or not payload.discover_context.problem:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Valid Phase 1 Discover context is required to build a Phase 2 Position strategy."
        )

    try:
        result = analyze_position(payload.discover_context)
        logger.info(f"[BACKEND SUCCESS] Returning PositionResponse: {result.model_dump_json()}")
        return result
    except ValueError as val_err:
        logger.warning(f"Validation or configuration error in position service: {val_err}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as exc:
        logger.error(f"Unexpected error during position generation: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI positioning service encountered an error processing your request. Please try again."
        )

@app.post(
    "/api/shape",
    response_model=ShapeResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate structured brand identity, personality, naming territories, and messaging hierarchy based on Discover and Position context"
)
@app.post(
    "/shape",
    response_model=ShapeResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
async def generate_shape(payload: ShapeRequest):
    if not payload.discover_context or not payload.discover_context.problem:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Valid Phase 1 Discover context is required to shape brand identity."
        )
    if not payload.position_context or not payload.position_context.category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Valid Phase 2 Position context is required to shape brand identity."
        )

    try:
        result = analyze_shape(payload.discover_context, payload.position_context)
        logger.info(f"[BACKEND SUCCESS] Returning ShapeResponse: {result.model_dump_json()}")
        return result
    except ValueError as val_err:
        logger.warning(f"Validation or configuration error in shape service: {val_err}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as exc:
        logger.error(f"Unexpected error during shape generation: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI brand shape service encountered an error processing your request. Please try again."
        )

@app.post(
    "/api/visualize",
    response_model=VisualizeResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate structured visual direction, typography, colors, composition, iconography, and imagery strategy based on Discover, Position, and Shape context"
)
@app.post(
    "/visualize",
    response_model=VisualizeResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
async def generate_visualize(payload: VisualizeRequest):
    if not payload.discover_context or not payload.discover_context.problem:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Valid Phase 1 Discover context is required to generate visual strategy."
        )
    if not payload.position_context or not payload.position_context.category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Valid Phase 2 Position context is required to generate visual strategy."
        )
    if not payload.shape_context or not payload.shape_context.tagline:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Valid Phase 3 Shape context is required to generate visual strategy."
        )

    try:
        result = analyze_visualize(
            payload.discover_context,
            payload.position_context,
            payload.shape_context
        )
        logger.info(f"[BACKEND SUCCESS] Returning VisualizeResponse: {result.model_dump_json()}")
        return result
    except ValueError as val_err:
        logger.warning(f"Validation or configuration error in visualize service: {val_err}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as exc:
        logger.error(f"Unexpected error during visualize generation: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI visual strategy service encountered an error processing your request. Please try again."
        )

@app.post(
    "/api/challenge",
    response_model=ChallengeResponse,
    status_code=status.HTTP_200_OK,
    summary="Critically evaluate and stress-test the combined strategy from Phases 1-4 for clichés, contradictions, audience mismatches, weak assumptions, and distinctiveness gaps"
)
@app.post(
    "/challenge",
    response_model=ChallengeResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
async def generate_challenge(payload: ChallengeRequest):
    if not payload.discover_context or not payload.discover_context.problem:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Valid Phase 1 Discover context is required for Challenge evaluation."
        )
    if not payload.position_context or not payload.position_context.category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Valid Phase 2 Position context is required for Challenge evaluation."
        )
    if not payload.shape_context or not payload.shape_context.tagline:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Valid Phase 3 Shape context is required for Challenge evaluation."
        )
    if not payload.visualize_context or not payload.visualize_context.typography:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Valid Phase 4 Visualize context is required for Challenge evaluation."
        )

    try:
        result = analyze_challenge(
            payload.discover_context,
            payload.position_context,
            payload.shape_context,
            payload.visualize_context
        )
        logger.info(f"[BACKEND SUCCESS] Returning ChallengeResponse: {result.model_dump_json()}")
        return result
    except ValueError as val_err:
        logger.warning(f"Validation or configuration error in challenge service: {val_err}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as exc:
        logger.error(f"Unexpected error during challenge evaluation: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI challenge evaluation service encountered an error processing your request. Please try again."
        )

@app.post(
    "/api/deliver",
    response_model=DeliverResponse,
    status_code=status.HTTP_200_OK,
    summary="Synthesize accumulated outputs from Phases 1-5 into a complete, launch-ready Brand Kit"
)
@app.post(
    "/deliver",
    response_model=DeliverResponse,
    status_code=status.HTTP_200_OK,
    include_in_schema=False
)
async def generate_deliver(payload: DeliverRequest):
    if not payload.discover_context or not payload.discover_context.problem:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Valid Phase 1 Discover context is required for Deliver synthesis."
        )
    if not payload.position_context or not payload.position_context.category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Valid Phase 2 Position context is required for Deliver synthesis."
        )
    if not payload.shape_context or not payload.shape_context.tagline:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Valid Phase 3 Shape context is required for Deliver synthesis."
        )
    if not payload.visualize_context or not payload.visualize_context.typography:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Valid Phase 4 Visualize context is required for Deliver synthesis."
        )
    if not payload.challenge_context or not payload.challenge_context.challenge_summary:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Valid Phase 5 Challenge context is required for Deliver synthesis."
        )

    try:
        result = analyze_deliver(
            payload.discover_context,
            payload.position_context,
            payload.shape_context,
            payload.visualize_context,
            payload.challenge_context
        )
        logger.info(f"[BACKEND SUCCESS] Returning DeliverResponse: {result.model_dump_json()}")
        return result
    except ValueError as val_err:
        logger.warning(f"Validation or configuration error in deliver service: {val_err}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as exc:
        logger.error(f"Unexpected error during deliver synthesis: {exc}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI deliver synthesis service encountered an error processing your request. Please try again."
        )


if __name__ == "__main__":
    import uvicorn
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", "8000"))
    uvicorn.run("main:app", host=host, port=port, reload=True)


