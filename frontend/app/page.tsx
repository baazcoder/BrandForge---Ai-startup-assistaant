"use client";

import React, { useState } from "react";
import { Header } from "../components/Header";
import { IdeaForm } from "../components/IdeaForm";
import { DiscoverResults } from "../components/DiscoverResults";
import { PositionSection } from "../components/PositionSection";
import { ShapeSection } from "../components/ShapeSection";
import { VisualizeSection } from "../components/VisualizeSection";
import { ChallengeSection } from "../components/ChallengeSection";
import { DeliverSection } from "../components/DeliverSection";
import {
  discoverIdea,
  generatePosition,
  generateShape,
  generateVisualize,
  generateChallenge,
  generateDeliver,
  DiscoverResponse,
  PositionResponse,
  ShapeResponse,
  VisualizeResponse,
  ChallengeResponse,
  DeliverResponse
} from "../lib/api";

export default function Home() {
  const [results, setResults] = useState<DiscoverResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Phase 2 Position States
  const [positionResults, setPositionResults] = useState<PositionResponse | null>(null);
  const [isPositionLoading, setIsPositionLoading] = useState<boolean>(false);
  const [positionError, setPositionError] = useState<string | null>(null);

  // Phase 3 Shape States
  const [shapeResults, setShapeResults] = useState<ShapeResponse | null>(null);
  const [isShapeLoading, setIsShapeLoading] = useState<boolean>(false);
  const [shapeError, setShapeError] = useState<string | null>(null);

  // Phase 4 Visualize States
  const [visualizeResults, setVisualizeResults] = useState<VisualizeResponse | null>(null);
  const [isVisualizeLoading, setIsVisualizeLoading] = useState<boolean>(false);
  const [visualizeError, setVisualizeError] = useState<string | null>(null);

  // Phase 5 Challenge States
  const [challengeResults, setChallengeResults] = useState<ChallengeResponse | null>(null);
  const [isChallengeLoading, setIsChallengeLoading] = useState<boolean>(false);
  const [challengeError, setChallengeError] = useState<string | null>(null);

  // Phase 6 Deliver States
  const [deliverResults, setDeliverResults] = useState<DeliverResponse | null>(null);
  const [isDeliverLoading, setIsDeliverLoading] = useState<boolean>(false);
  const [deliverError, setDeliverError] = useState<string | null>(null);

  const handleSubmit = async (idea: string) => {
    setIsLoading(true);
    setError(null);
    setPositionResults(null);
    setPositionError(null);
    setShapeResults(null);
    setShapeError(null);
    setVisualizeResults(null);
    setVisualizeError(null);
    setChallengeResults(null);
    setChallengeError(null);
    setDeliverResults(null);
    setDeliverError(null);

    try {
      const data = await discoverIdea(idea);
      setResults(data);
      // Smooth scroll to top of results
      setTimeout(() => {
        window.scrollTo({ top: 350, behavior: "smooth" });
      }, 100);
    } catch (err: unknown) {
      console.error("Discovery workflow error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred while processing your idea. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuildPosition = async () => {
    if (!results) return;
    setIsPositionLoading(true);
    setPositionError(null);

    try {
      const posData = await generatePosition(results);
      setPositionResults(posData);
      setTimeout(() => {
        const el = document.getElementById("position-stage-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err: unknown) {
      console.error("Position workflow error:", err);
      if (err instanceof Error) {
        setPositionError(err.message);
      } else {
        setPositionError("An unexpected error occurred while generating positioning strategy.");
      }
    } finally {
      setIsPositionLoading(false);
    }
  };

  const handleBuildShape = async () => {
    if (!results || !positionResults) return;
    setIsShapeLoading(true);
    setShapeError(null);

    try {
      const shpData = await generateShape(results, positionResults);
      setShapeResults(shpData);
      setTimeout(() => {
        const el = document.getElementById("shape-stage-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err: unknown) {
      console.error("Shape workflow error:", err);
      if (err instanceof Error) {
        setShapeError(err.message);
      } else {
        setShapeError("An unexpected error occurred while generating brand shape strategy.");
      }
    } finally {
      setIsShapeLoading(false);
    }
  };

  const handleBuildVisualize = async () => {
    if (!results || !positionResults || !shapeResults) return;
    setIsVisualizeLoading(true);
    setVisualizeError(null);

    try {
      const vizData = await generateVisualize(results, positionResults, shapeResults);
      setVisualizeResults(vizData);
      setTimeout(() => {
        const el = document.getElementById("visualize-stage-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err: unknown) {
      console.error("Visualize workflow error:", err);
      if (err instanceof Error) {
        setVisualizeError(err.message);
      } else {
        setVisualizeError("An unexpected error occurred while generating brand visual strategy.");
      }
    } finally {
      setIsVisualizeLoading(false);
    }
  };

  const handleBuildChallenge = async () => {
    if (!results || !positionResults || !shapeResults || !visualizeResults) return;
    setIsChallengeLoading(true);
    setChallengeError(null);

    try {
      const chgData = await generateChallenge(results, positionResults, shapeResults, visualizeResults);
      setChallengeResults(chgData);
      setTimeout(() => {
        const el = document.getElementById("challenge-stage-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err: unknown) {
      console.error("Challenge workflow error:", err);
      if (err instanceof Error) {
        setChallengeError(err.message);
      } else {
        setChallengeError("An unexpected error occurred while generating brand challenge evaluation.");
      }
    } finally {
      setIsChallengeLoading(false);
    }
  };

  const handleBuildDeliver = async () => {
    if (!results || !positionResults || !shapeResults || !visualizeResults || !challengeResults) return;
    setIsDeliverLoading(true);
    setDeliverError(null);

    try {
      const dlvData = await generateDeliver(results, positionResults, shapeResults, visualizeResults, challengeResults);
      setDeliverResults(dlvData);
      setTimeout(() => {
        const el = document.getElementById("deliver-stage-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err: unknown) {
      console.error("Deliver workflow error:", err);
      if (err instanceof Error) {
        setDeliverError(err.message);
      } else {
        setDeliverError("An unexpected error occurred while compiling your final brand kit.");
      }
    } finally {
      setIsDeliverLoading(false);
    }
  };

  const handleProceedToVisualize = () => {
    setTimeout(() => {
      const el = document.getElementById("visualize-stage-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  };

  const handleProceedToChallenge = () => {
    setTimeout(() => {
      const el = document.getElementById("challenge-stage-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  };

  const handleProceedToDeliver = () => {
    setTimeout(() => {
      const el = document.getElementById("deliver-stage-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  };

  const handleReset = () => {
    setResults(null);
    setPositionResults(null);
    setShapeResults(null);
    setVisualizeResults(null);
    setChallengeResults(null);
    setDeliverResults(null);
    setError(null);
    setPositionError(null);
    setShapeError(null);
    setVisualizeError(null);
    setChallengeError(null);
    setDeliverError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeStage = deliverResults ? 6 : (challengeResults ? 5 : (visualizeResults ? 4 : (shapeResults ? 3 : (positionResults ? 2 : 1))));

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <div>
        <Header activeStage={activeStage} />

        <main className="pb-16">
          <IdeaForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />

          {results && (
            <>
              <DiscoverResults
                data={results}
                onReset={handleReset}
              />

              <PositionSection
                discoverContext={results}
                positionData={positionResults}
                onBuildPosition={handleBuildPosition}
                isLoading={isPositionLoading}
                error={positionError}
              />

              {positionResults && (
                <ShapeSection
                  discoverContext={results}
                  positionContext={positionResults}
                  shapeData={shapeResults}
                  onBuildShape={handleBuildShape}
                  isLoading={isShapeLoading}
                  error={shapeError}
                  onProceedToVisualize={handleProceedToVisualize}
                />
              )}

              {positionResults && shapeResults && (
                <VisualizeSection
                  discoverContext={results}
                  positionContext={positionResults}
                  shapeContext={shapeResults}
                  visualizeData={visualizeResults}
                  onBuildVisualize={handleBuildVisualize}
                  isLoading={isVisualizeLoading}
                  error={visualizeError}
                  onProceedToChallenge={handleProceedToChallenge}
                />
              )}

              {positionResults && shapeResults && visualizeResults && (
                <ChallengeSection
                  discoverContext={results}
                  positionContext={positionResults}
                  shapeContext={shapeResults}
                  visualizeContext={visualizeResults}
                  challengeData={challengeResults}
                  onBuildChallenge={handleBuildChallenge}
                  isLoading={isChallengeLoading}
                  error={challengeError}
                  onProceedToDeliver={handleProceedToDeliver}
                />
              )}

              {positionResults && shapeResults && visualizeResults && challengeResults && (
                <DeliverSection
                  discoverContext={results}
                  positionContext={positionResults}
                  shapeContext={shapeResults}
                  visualizeContext={visualizeResults}
                  challengeContext={challengeResults}
                  deliverData={deliverResults}
                  onBuildDeliver={handleBuildDeliver}
                  isLoading={isDeliverLoading}
                  error={deliverError}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500 font-mono">
        BrandForge — AI-Powered Brand Strategy Engine (Phases 1–6: Discover, Position, Shape, Visualize, Challenge & Deliver)
      </footer>
    </div>
  );
}


