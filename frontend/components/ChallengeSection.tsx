"use client";

import React from "react";
import {
  DiscoverResponse,
  PositionResponse,
  ShapeResponse,
  VisualizeResponse,
  ChallengeResponse
} from "../lib/api";
import {
  ShieldAlert,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Info,
  Flame,
  GitCompare,
  Users,
  AlertTriangle,
  Sparkle,
  Layers,
  CheckSquare,
  Compass,
  Tag,
  Zap,
  HelpCircle
} from "lucide-react";

interface ChallengeSectionProps {
  discoverContext: DiscoverResponse;
  positionContext: PositionResponse;
  shapeContext: ShapeResponse;
  visualizeContext: VisualizeResponse;
  challengeData: ChallengeResponse | null;
  onBuildChallenge: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onProceedToDeliver?: () => void;
}

export const ChallengeSection: React.FC<ChallengeSectionProps> = ({
  discoverContext,
  positionContext,
  shapeContext,
  visualizeContext,
  challengeData,
  onBuildChallenge,
  isLoading,
  error,
  onProceedToDeliver,
}) => {
  return (
    <div id="challenge-stage-section" className="w-full max-w-5xl mx-auto my-12 px-4 space-y-8 animate-fade-in">
      {/* Stage Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-amber-950/80 border border-rose-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-red-500"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Phase 5 — Challenge</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Strategic Stress-Test & Critique
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Critically evaluate the combined decisions from Discover, Position, Shape, and Visualize. Detect overused clichés, cross-stage contradictions, audience disconnects, and weak assumptions before final launch delivery.
            </p>

            {/* Context attached indicator */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-mono pt-1">
              <div className="flex items-center gap-1.5 text-rose-300">
                <Info className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Phases 1–4 Context Stress-Tested</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-300">
                <Tag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Category: <strong>{positionContext.category}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-cyan-300">
                <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Tagline: <strong>"{shapeContext.tagline}"</strong></span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto shrink-0">
            {!challengeData && (
              <button
                id="challenge-brand-btn"
                onClick={onBuildChallenge}
                disabled={isLoading}
                className="w-full md:w-auto px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-rose-600 via-amber-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.02] active:scale-[0.98] transition duration-200 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Stress-Testing Strategy...</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-5 h-5 text-rose-200" />
                    <span>Challenge Brand</span>
                    <ArrowRight className="w-4 h-4 text-rose-200" />
                  </>
                )}
              </button>
            )}

            {challengeData && (
              <button
                onClick={onBuildChallenge}
                disabled={isLoading}
                className="w-full md:w-auto px-5 py-2.5 rounded-xl font-medium text-xs text-rose-300 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Flame className="w-4 h-4 text-rose-400" />
                )}
                <span>{isLoading ? "Re-evaluating..." : "Re-challenge Strategy"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Loading Banner overlay */}
        {isLoading && (
          <div className="mt-6 pt-6 border-t border-rose-900/60 flex flex-col items-center justify-center space-y-3 animate-fade-in">
            <div className="flex items-center gap-3 text-rose-300 text-sm font-medium">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" />
              <span>Analyzing Clichés, Contradictions & Audience Disconnects across Phases 1–4...</span>
            </div>
            <p className="text-xs text-slate-400 text-center max-w-md">
              Cross-examining positioning claims, verbal identity, typography, and color choices for hidden vulnerabilities and generic patterns.
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-0.5">Strategy Challenge Error</p>
              <p className="text-rose-200/90">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Challenge Results Display */}
      {challengeData && (
        <div className="space-y-8 animate-fade-in">
          {/* Section Title */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Phase 5 Challenge & Stress-Test Complete</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">Phase 5 / 5 Complete</span>
          </div>

          {/* 1. Clichés Detected */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 border-t-2 border-t-rose-500">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">Detected Clichés & Overused Trope Analysis</h3>
                <p className="text-xs text-slate-400">Current choices vs. why they feel generic vs. stronger distinctive alternatives</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {challengeData.cliches_detected.map((cliche, idx) => (
                <div key={idx} className="glass-card rounded-xl p-5 border border-rose-500/20 bg-slate-900/80 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-rose-950/80 border border-rose-500/30 text-rose-300">
                        {cliche.area}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-0.5">Current Choice</span>
                      <p className="text-sm font-bold text-rose-200">"{cliche.current_choice}"</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold uppercase text-rose-400 block">Why It's Generic / Vulnerable</span>
                      <p className="text-xs text-slate-300 leading-relaxed">{cliche.why_generic}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1 mt-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Stronger Distinctive Alternative</span>
                    </div>
                    <p className="text-xs text-slate-200 font-medium leading-relaxed">
                      {cliche.stronger_alternative}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Contradictions Across Stages */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 border-t-2 border-t-amber-500">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <GitCompare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">Cross-Stage Contradictions & Misalignments</h3>
                <p className="text-xs text-slate-400">Friction detected between decisions across Discover, Position, Shape, and Visualize</p>
              </div>
            </div>

            <div className="space-y-4">
              {challengeData.contradictions.map((item, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-slate-900/80 border border-amber-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase text-amber-400">
                      Conflict Area: {item.area}
                    </span>
                  </div>

                  {/* Element A vs Element B side-by-side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-0.5">Element A</span>
                      <p className="text-xs font-semibold text-slate-200">{item.element_a}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-0.5">Element B (Conflicting)</span>
                      <p className="text-xs font-semibold text-amber-200">{item.element_b}</p>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-amber-400 block">The Conflict</span>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.conflict}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-amber-300 block">Recommended Resolution</span>
                    <p className="text-xs text-slate-200 leading-relaxed">{item.recommended_fix}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Audience Mismatches & Weak Assumptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Audience Mismatches */}
            <div className="glass-card rounded-2xl p-6 space-y-4 border-t-2 border-t-cyan-500">
              <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Audience Mismatches</h3>
                  <span className="text-xs text-cyan-400 font-mono">Persona & User Behavior Gaps</span>
                </div>
              </div>

              <div className="space-y-4">
                {challengeData.audience_mismatches.map((am, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-slate-100 block border-b border-slate-800 pb-1.5">
                      Decision: {am.decision}
                    </span>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-cyan-400 block font-bold">Audience Issue</span>
                      <p className="text-xs text-slate-300 leading-relaxed">{am.audience_issue}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-rose-400 block font-bold">Why It Matters</span>
                      <p className="text-xs text-slate-300 leading-relaxed">{am.why_it_matters}</p>
                    </div>
                    <div className="pt-1">
                      <span className="text-[10px] font-mono uppercase text-emerald-400 block font-bold">Recommended Change</span>
                      <p className="text-xs text-emerald-200/90 leading-relaxed">{am.recommended_change}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weak Assumptions */}
            <div className="glass-card rounded-2xl p-6 space-y-4 border-t-2 border-t-purple-500">
              <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Weak / Unproven Assumptions</h3>
                  <span className="text-xs text-purple-400 font-mono">Risks & Required Validation</span>
                </div>
              </div>

              <div className="space-y-4">
                {challengeData.weak_assumptions.map((wa, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-purple-300 block border-b border-slate-800 pb-1.5">
                      Assumption: {wa.assumption}
                    </span>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-rose-400 block font-bold">Strategic Risk</span>
                      <p className="text-xs text-slate-300 leading-relaxed">{wa.risk}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-purple-400 block font-bold">Validation Test Needed</span>
                      <p className="text-xs text-slate-200 leading-relaxed">{wa.validation_needed}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Distinctiveness Gaps & Consistency Findings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Distinctiveness Gaps */}
            <div className="glass-card rounded-2xl p-6 space-y-4 border-t-2 border-t-indigo-500">
              <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Sparkle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Distinctiveness Gaps</h3>
                  <span className="text-xs text-indigo-400 font-mono">Elevating Commodity Choices</span>
                </div>
              </div>

              <div className="space-y-3">
                {challengeData.distinctiveness_gaps.map((dg, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
                    <span className="text-xs font-bold text-indigo-300 uppercase font-mono block">{dg.area}</span>
                    <p className="text-xs text-slate-300"><strong>Problem:</strong> {dg.problem}</p>
                    <p className="text-xs text-slate-400"><strong>Why Generic:</strong> {dg.why_generic}</p>
                    <div className="p-2.5 rounded bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 font-medium mt-1">
                      👉 <strong>Improvement:</strong> {dg.improvement_direction}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Consistency Findings */}
            <div className="glass-card rounded-2xl p-6 space-y-4 border-t-2 border-t-emerald-500">
              <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Holistic Consistency Findings</h3>
                  <span className="text-xs text-emerald-400 font-mono">Systemic Coherence Evaluation</span>
                </div>
              </div>

              <div className="space-y-3">
                {challengeData.consistency_findings.map((cf, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{cf.connected_elements}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        cf.status_or_issue.toLowerCase().includes('strong') || cf.status_or_issue.toLowerCase().includes('coherent')
                          ? 'bg-emerald-950 border border-emerald-500/30 text-emerald-300'
                          : 'bg-amber-950 border border-amber-500/30 text-amber-300'
                      }`}>
                        {cf.status_or_issue}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{cf.explanation}</p>
                    <p className="text-xs text-emerald-300/90 pt-1">
                      <strong>Adjustment:</strong> {cf.recommended_adjustment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Recommended Changes Priority List */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 border-t-2 border-t-red-500">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <CheckSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">Prioritized Actionable Changes</h3>
                <p className="text-xs text-slate-400">Highest-priority strategic changes recommended before final launch</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {challengeData.recommended_changes.map((change, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-rose-500/20 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-300 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    {idx + 1}
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">{change}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Challenge Strategy Summary */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 border-l-4 border-l-rose-500 bg-slate-900/90 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-semibold uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              <span>Overall Challenge Evaluation Summary</span>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
              {challengeData.challenge_summary}
            </p>
          </div>

          {/* CTA to Phase 6 Deliver */}
          {onProceedToDeliver && (
            <div className="pt-4 flex justify-center">
              <button
                onClick={onProceedToDeliver}
                className="px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:scale-105 active:scale-95 transition duration-200 flex items-center gap-3 cursor-pointer"
              >
                <span>Proceed to Phase 6: Deliver (Final Brand Kit)</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
