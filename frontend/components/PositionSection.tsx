"use client";

import React from "react";
import { DiscoverResponse, PositionResponse } from "../lib/api";
import {
  Compass,
  Sparkles,
  Loader2,
  AlertCircle,
  Tag,
  Sparkle,
  Zap,
  Swords,
  Quote,
  CheckCircle2,
  ArrowRight,
  Info
} from "lucide-react";

interface PositionSectionProps {
  discoverContext: DiscoverResponse;
  positionData: PositionResponse | null;
  onBuildPosition: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const PositionSection: React.FC<PositionSectionProps> = ({
  discoverContext,
  positionData,
  onBuildPosition,
  isLoading,
  error,
}) => {
  return (
    <div id="position-stage-section" className="w-full max-w-5xl mx-auto my-12 px-4 space-y-8 animate-fade-in">
      {/* Stage Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>Phase 2 — Position</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Brand Positioning Strategy
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Transforming your structured Phase 1 Discover insights into a defined market category, specific differentiator, value proposition, and competitive angle.
            </p>

            {/* Context attached indicator */}
            <div className="flex items-center gap-2 text-xs text-indigo-300 font-mono pt-1">
              <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>
                Discover Context Attached: <strong className="text-slate-200">{discoverContext.target_user.substring(0, 45)}...</strong>
              </span>
            </div>
          </div>

          <div className="w-full md:w-auto shrink-0">
            {!positionData && (
              <button
                id="build-position-btn"
                onClick={onBuildPosition}
                disabled={isLoading}
                className="w-full md:w-auto px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition duration-200 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Building Position...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-purple-200" />
                    <span>Build Position</span>
                    <ArrowRight className="w-4 h-4 text-purple-200" />
                  </>
                )}
              </button>
            )}

            {positionData && (
              <button
                onClick={onBuildPosition}
                disabled={isLoading}
                className="w-full md:w-auto px-5 py-2.5 rounded-xl font-medium text-xs text-purple-300 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 text-purple-400" />
                )}
                <span>{isLoading ? "Rebuilding..." : "Rebuild Position"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Loading Banner overlay */}
        {isLoading && (
          <div className="mt-6 pt-6 border-t border-purple-900/60 flex flex-col items-center justify-center space-y-3 animate-fade-in">
            <div className="flex items-center gap-3 text-purple-300 text-sm font-medium">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
              <span>Analyzing Discover Context & Deriving Positioning Strategy...</span>
            </div>
            <p className="text-xs text-slate-400 text-center max-w-md">
              Formulating market category, target-specific differentiator, benefit-driven value proposition, and competitive framing without generic buzzwords.
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-0.5">Positioning Strategy Error</p>
              <p className="text-rose-200/90">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Position Structured Results Display */}
      {positionData && (
        <div className="space-y-8 animate-fade-in">
          {/* Section Title */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Structured Positioning Strategy Ready</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const el = document.getElementById("shape-stage-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Proceed to Phase 3: Shape</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs text-slate-500 font-mono">Phase 2 / 3</span>
            </div>
          </div>

          {/* Unified Positioning Statement Card */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-950/20 via-slate-900/90 to-indigo-950/20 relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-1">
                <Quote className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-300 font-mono">
                  Strategic Positioning Statement
                </h3>
                <p className="text-slate-100 font-medium text-lg sm:text-xl leading-relaxed italic">
                  "{positionData.positioning_statement}"
                </p>
              </div>
            </div>
          </div>

          {/* 4 Inkloom Core Positioning Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Category */}
            <div className="glass-card rounded-2xl p-6 space-y-4 border-t-2 border-t-purple-500 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                      <Tag className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono">
                      1. Category
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-slate-100 mb-2">
                    {positionData.category}
                  </h4>
                  <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    <span className="font-semibold text-purple-300 block mb-1 font-mono">Strategic Rationale:</span>
                    {positionData.category_reason}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Differentiator */}
            <div className="glass-card rounded-2xl p-6 space-y-4 border-t-2 border-t-amber-500 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <Sparkle className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                      2. Differentiator
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-slate-100 mb-2">
                    {positionData.differentiator}
                  </h4>
                  <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    <span className="font-semibold text-amber-300 block mb-1 font-mono">Strategic Rationale:</span>
                    {positionData.differentiator_reason}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Value Proposition */}
            <div className="glass-card rounded-2xl p-6 space-y-4 border-t-2 border-t-emerald-500 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                      3. Value Proposition
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-slate-100 mb-2">
                    {positionData.value_proposition}
                  </h4>
                  <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    <span className="font-semibold text-emerald-300 block mb-1 font-mono">Strategic Rationale:</span>
                    {positionData.value_proposition_reason}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Competitive Angle */}
            <div className="glass-card rounded-2xl p-6 space-y-4 border-t-2 border-t-cyan-500 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <Swords className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                      4. Competitive Angle
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-slate-100 mb-2">
                    {positionData.competitive_angle}
                  </h4>
                  <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    <span className="font-semibold text-cyan-300 block mb-1 font-mono">Strategic Rationale:</span>
                    {positionData.competitive_angle_reason}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
