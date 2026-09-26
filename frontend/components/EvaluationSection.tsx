"use client";

import React from "react";
import {
  DiscoverResponse,
  PositionResponse,
  ShapeResponse,
  VisualizeResponse,
  ChallengeResponse,
  DeliverResponse,
  EvaluateResponse
} from "../lib/api";
import {
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Loader2,
  AlertCircle,
  Sparkles,
  ClipboardCheck,
  Check,
  XCircle,
  HelpCircle,
  ArrowRight,
  Flame,
  Info,
  ListChecks,
  UserCheck,
  Zap,
  Tag,
  Compass
} from "lucide-react";

interface EvaluationSectionProps {
  discoverContext: DiscoverResponse;
  positionContext: PositionResponse;
  shapeContext: ShapeResponse;
  visualizeContext: VisualizeResponse;
  challengeContext: ChallengeResponse;
  deliverContext: DeliverResponse;
  evaluationData: EvaluateResponse | null;
  onBuildEvaluate: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const EvaluationSection: React.FC<EvaluationSectionProps> = ({
  positionContext,
  deliverContext,
  evaluationData,
  onBuildEvaluate,
  isLoading,
  error,
}) => {
  const getStatusBadge = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "strong" || s === "consistent") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Consistent</span>
        </span>
      );
    }
    if (s === "needs_attention" || s === "needs_review") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Needs Attention</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
        <XCircle className="w-3.5 h-3.5 text-rose-400" />
        <span>Inconsistent</span>
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const p = (priority || "").toLowerCase();
    if (p === "high") {
      return (
        <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase bg-rose-950/80 border border-rose-500/40 text-rose-300">
          High Priority
        </span>
      );
    }
    if (p === "medium") {
      return (
        <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase bg-amber-950/80 border border-amber-500/40 text-amber-300">
          Medium Priority
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase bg-indigo-950/80 border border-indigo-500/40 text-indigo-300">
        Low Priority
      </span>
    );
  };

  const getOverallStatusBadge = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "strong") {
      return (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-sm shadow-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Overall Status: Strong & Coherent</span>
        </div>
      );
    }
    if (s === "high_risk") {
      return (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-sm shadow-md">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Overall Status: High Strategic Risk</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-sm shadow-md">
        <AlertTriangle className="w-4 h-4 text-amber-400" />
        <span>Overall Status: Requires Refinement</span>
      </div>
    );
  };

  return (
    <div id="evaluate-stage-section" className="w-full max-w-5xl mx-auto my-12 px-4 space-y-8 animate-fade-in">
      {/* Stage Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/90 via-slate-900 to-indigo-950/90 border border-blue-500/40 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold uppercase tracking-wider">
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>Phase 7 — Evaluate</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Brand Consistency & Quality Evaluation
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              One final stress-test of your brand strategy. Evaluating holistic coherence across all six stages to ensure your brand positioning, messaging, visual identity, and risk mitigations fit together seamlessly.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-mono pt-1">
              <div className="flex items-center gap-1.5 text-blue-300">
                <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Stages 1–6 Context Evaluated</span>
              </div>
              <div className="flex items-center gap-1.5 text-indigo-300">
                <Tag className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Brand: <strong>{deliverContext.brand_name}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-cyan-300">
                <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Category: <strong>{positionContext.category}</strong></span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto shrink-0">
            {!evaluationData && (
              <button
                id="evaluate-brand-btn"
                onClick={onBuildEvaluate}
                disabled={isLoading}
                className="w-full md:w-auto px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition duration-200 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Evaluating Brand Consistency...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-blue-300" />
                    <span>Run Quality Evaluation</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-red-300">Evaluation Error</h4>
            <p className="text-xs text-red-200/90 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="glass-card rounded-2xl p-10 text-center space-y-4 border border-blue-500/30">
          <div className="inline-flex p-4 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 animate-pulse">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Performing holistic brand audit...</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Analyzing consistency across problem definition, target persona, value proposition, verbal tone, visual system, and risk mitigations...
            </p>
          </div>
        </div>
      )}

      {/* EVALUATION RESULTS GRID */}
      {evaluationData && !isLoading && (
        <div className="space-y-8 animate-fade-in">
          {/* Overall Assessment Card */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-4 border-t-2 border-t-blue-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <ClipboardCheck className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-bold text-slate-100">Overall Strategic Assessment</h3>
              </div>

              {getOverallStatusBadge(evaluationData.overall_status)}
            </div>

            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-blue-400">Executive Summary</span>
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                {evaluationData.overall_summary}
              </p>
            </div>
          </div>

          {/* Consistency Checks Matrix & Key Findings */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 border-t-2 border-t-indigo-500">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">Consistency Matrix & Detailed Findings</h3>
                <p className="text-xs text-slate-400">Cross-stage alignment checks with evidence and recommendations</p>
              </div>
            </div>

            <div className="space-y-4">
              {evaluationData.consistency_checks.map((item, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      <h4 className="text-sm font-bold text-white font-mono">{item.area}</h4>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    <strong>Finding:</strong> {item.finding}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
                      <span className="text-[11px] font-mono font-bold uppercase text-slate-400">Supporting Evidence</span>
                      <p className="text-xs text-slate-300 leading-relaxed">{item.evidence}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/20 space-y-1">
                      <span className="text-[11px] font-mono font-bold uppercase text-indigo-300">Recommendation</span>
                      <p className="text-xs text-slate-300 leading-relaxed">{item.recommendation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Actions */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 border-t-2 border-t-amber-500">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <ListChecks className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">Prioritized Action Items</h3>
                <p className="text-xs text-slate-400">Actionable recommendations to eliminate friction before launch</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {evaluationData.priority_actions.map((act, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-300">{act.area}</span>
                    {getPriorityBadge(act.priority)}
                  </div>

                  <p className="text-xs text-rose-300/90 font-medium">
                    <strong>Problem:</strong> {act.problem}
                  </p>

                  <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/20 text-xs text-slate-200 leading-relaxed">
                    <strong>Action:</strong> {act.recommended_action}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Human Validation Required */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-4 border-t-2 border-t-teal-500 bg-slate-900/90">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">Human Validation Required</h3>
                <p className="text-xs text-teal-400 font-mono">Real-world items requiring founder validation</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {evaluationData.human_review_items.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-teal-500/20 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    ✓
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
