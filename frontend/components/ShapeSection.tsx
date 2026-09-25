"use client";

import React from "react";
import { DiscoverResponse, PositionResponse, ShapeResponse } from "../lib/api";
import {
  Palette,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Info,
  Smile,
  Ban,
  Compass,
  MessageSquare,
  Volume2,
  Megaphone,
  ShieldCheck,
  Tag,
  Quote
} from "lucide-react";

interface ShapeSectionProps {
  discoverContext: DiscoverResponse;
  positionContext: PositionResponse;
  shapeData: ShapeResponse | null;
  onBuildShape: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onProceedToVisualize?: () => void;
}

export const ShapeSection: React.FC<ShapeSectionProps> = ({
  discoverContext,
  positionContext,
  shapeData,
  onBuildShape,
  isLoading,
  error,
  onProceedToVisualize,
}) => {
  return (
    <div id="shape-stage-section" className="w-full max-w-5xl mx-auto my-12 px-4 space-y-8 animate-fade-in">
      {/* Stage Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-indigo-950/70 border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-purple-500 to-indigo-500"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Palette className="w-3.5 h-3.5" />
              <span>Phase 3 — Shape</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Verbal Brand Identity & Messaging
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Define your brand's personality, strategic naming territories, actionable voice guidelines, primary tagline, and core messaging hierarchy based on your Discover and Position strategy.
            </p>

            {/* Context attached indicator */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-indigo-300 font-mono pt-1">
              <div className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Discover Context Attached</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-300">
                <Tag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Category: <strong>{positionContext.category}</strong></span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto shrink-0">
            {!shapeData && (
              <button
                id="build-shape-btn"
                onClick={onBuildShape}
                disabled={isLoading}
                className="w-full md:w-auto px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-600 via-purple-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition duration-200 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Shaping Brand...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-200" />
                    <span>Shape Brand</span>
                    <ArrowRight className="w-4 h-4 text-amber-200" />
                  </>
                )}
              </button>
            )}

            {shapeData && (
              <button
                onClick={onBuildShape}
                disabled={isLoading}
                className="w-full md:w-auto px-5 py-2.5 rounded-xl font-medium text-xs text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/30 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 text-amber-400" />
                )}
                <span>{isLoading ? "Re-shaping..." : "Re-shape Brand Identity"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Loading Banner overlay */}
        {isLoading && (
          <div className="mt-6 pt-6 border-t border-amber-900/60 flex flex-col items-center justify-center space-y-3 animate-fade-in">
            <div className="flex items-center gap-3 text-amber-300 text-sm font-medium">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span>Shaping Brand Personality, Voice & Naming Territories...</span>
            </div>
            <p className="text-xs text-slate-400 text-center max-w-md">
              Formulating distinctive personality traits, strategic naming directions, brand voice rules, tagline, and message hierarchy aligned with your category and differentiator.
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-0.5">Brand Shape Strategy Error</p>
              <p className="text-rose-200/90">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Shape Results Display */}
      {shapeData && (
        <div className="space-y-8 animate-fade-in">
          {/* Section Title */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verbal Brand Identity & Shape Complete</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">Phase 3 / 3</span>
          </div>

          {/* Primary Tagline Banner Card */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-950/20 via-slate-900/90 to-indigo-950/20 relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-1">
                <Quote className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-300 font-mono">
                  Primary Brand Tagline
                </h3>
                <p className="text-slate-100 font-extrabold text-2xl sm:text-3xl tracking-tight leading-tight">
                  "{shapeData.tagline}"
                </p>
              </div>
            </div>
          </div>

          {/* 1. Personality Traits & Traits to Avoid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personality Traits */}
            <div className="glass-card rounded-2xl p-6 space-y-4 border-t-2 border-t-emerald-500">
              <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Smile className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Brand Personality Traits</h3>
                  <span className="text-xs text-emerald-400 font-mono">{shapeData.personality_traits.length} Core Traits</span>
                </div>
              </div>

              <div className="space-y-3">
                {shapeData.personality_traits.map((pt, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>{pt.trait}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pl-4">
                      {pt.justification}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Traits to Avoid */}
            <div className="glass-card rounded-2xl p-6 space-y-4 border-t-2 border-t-rose-500">
              <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <Ban className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Traits & Behaviors to Avoid</h3>
                  <span className="text-xs text-rose-400 font-mono">To Protect Brand Identity</span>
                </div>
              </div>

              <div className="space-y-3">
                {shapeData.traits_to_avoid.map((ta, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-2 text-sm font-bold text-rose-300">
                      <span className="w-2 h-2 rounded-full bg-rose-400" />
                      <span>{ta.trait}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pl-4">
                      {ta.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Naming Territories */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 border-t-2 border-t-purple-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-100">Strategic Naming Territories</h3>
                  <p className="text-xs text-slate-400">Conceptual naming directions (illustrative examples, not forced final names)</p>
                </div>
              </div>
              <span className="text-xs text-purple-400 font-mono font-semibold">
                {shapeData.naming_territories.length} Territories
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shapeData.naming_territories.map((territory, idx) => (
                <div key={idx} className="glass-card rounded-xl p-5 border border-purple-500/20 bg-slate-900/80 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase text-purple-400">
                        Territory {idx + 1}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-100">{territory.name}</h4>
                    <p className="text-xs text-purple-200/90 leading-relaxed italic">
                      "{territory.concept}"
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed pt-1">
                      {territory.rationale}
                    </p>
                  </div>

                  {/* Example Names Pills */}
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-xs font-mono text-slate-400 block mb-2 font-semibold">Example Names:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {territory.example_names.map((ex, exIdx) => (
                        <span key={exIdx} className="px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-950/60 border border-purple-500/30 text-purple-200">
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Brand Voice */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 border-t-2 border-t-cyan-500">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">Brand Voice & Communication Guidelines</h3>
                <p className="text-xs text-slate-400">Actionable tone descriptors and phrasing rules</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-cyan-400">Voice Description</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {shapeData.brand_voice.description}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-cyan-400">Tone Characteristics</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {shapeData.brand_voice.tone_characteristics.map((tone, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md text-xs font-medium bg-cyan-950/60 border border-cyan-500/30 text-cyan-200">
                      {tone}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-cyan-400">Language & Syntax Style</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {shapeData.brand_voice.language_style}
                </p>
              </div>
            </div>
          </div>

          {/* 4. Message Hierarchy */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 border-t-2 border-t-indigo-500">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Megaphone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">Message Hierarchy</h3>
                <p className="text-xs text-slate-400">Primary brand claim, supporting pillars, and proof points</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Primary Message */}
              <div className="p-5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-indigo-300">
                  Primary Brand Message
                </span>
                <p className="text-slate-100 font-bold text-lg leading-snug">
                  {shapeData.message_hierarchy.primary_message}
                </p>
              </div>

              {/* Supporting Messages */}
              <div className="space-y-3">
                <span className="text-xs font-mono font-bold uppercase text-slate-400">
                  Supporting Message Pillars ({shapeData.message_hierarchy.supporting_messages.length})
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {shapeData.message_hierarchy.supporting_messages.map((sm, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">{sm}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reason to Believe / Proof */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold uppercase text-emerald-400">Proof Point / Reason to Believe</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {shapeData.message_hierarchy.proof_or_reason_to_believe}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Shape Summary Card */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 border-l-4 border-l-indigo-400 bg-slate-900/90 space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-semibold uppercase tracking-wider">
              <MessageSquare className="w-4 h-4" />
              <span>Cohesive Brand Strategy Synthesis</span>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
              {shapeData.shape_summary}
            </p>
          </div>

          {/* CTA to Phase 4 Visualize */}
          {onProceedToVisualize && (
            <div className="pt-4 flex justify-center">
              <button
                onClick={onProceedToVisualize}
                className="px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 shadow-xl shadow-pink-500/20 hover:shadow-pink-500/35 hover:scale-105 active:scale-95 transition duration-200 flex items-center gap-3 cursor-pointer"
              >
                <span>Proceed to Phase 4: Visualize</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
