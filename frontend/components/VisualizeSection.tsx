"use client";

import React from "react";
import { DiscoverResponse, PositionResponse, ShapeResponse, VisualizeResponse } from "../lib/api";
import {
  Eye,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Info,
  Type,
  Palette,
  LayoutGrid,
  Shapes,
  Image as ImageIcon,
  Ban,
  Layers,
  Compass,
  Tag
} from "lucide-react";

interface VisualizeSectionProps {
  discoverContext: DiscoverResponse;
  positionContext: PositionResponse;
  shapeContext: ShapeResponse;
  visualizeData: VisualizeResponse | null;
  onBuildVisualize: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onProceedToChallenge?: () => void;
}

// Helper to determine if a string is a hex color or css color format
function isHexOrCssColor(str: string): boolean {
  return /^#([0-9A-F]{3}){1,2}$/i.test(str.trim()) || /^(rgb|hsl)/i.test(str.trim());
}

// Color Swatch component that renders a swatch box + color name/hex
const ColorSwatch: React.FC<{ colorStr: string; label?: string; isAccent?: boolean }> = ({
  colorStr,
  label,
  isAccent = false,
}) => {
  const cleanColor = colorStr.trim();
  const hexMatch = cleanColor.match(/#([0-9A-F]{3}){1,2}/i);
  const bgStyle = hexMatch ? hexMatch[0] : undefined;

  return (
    <div className={`p-3 rounded-xl bg-slate-900/90 border ${isAccent ? 'border-pink-500/40' : 'border-slate-800'} flex items-center gap-3 space-y-0`}>
      <div
        className="w-8 h-8 rounded-lg border border-white/20 shadow-inner shrink-0 flex items-center justify-center font-mono text-[10px] uppercase font-bold text-white/90"
        style={{ backgroundColor: bgStyle || "#3b82f6" }}
      >
        {!bgStyle && cleanColor.slice(0, 2)}
      </div>
      <div className="min-w-0">
        {label && <span className="text-[10px] font-mono font-semibold uppercase text-slate-400 block">{label}</span>}
        <span className="text-xs font-bold text-slate-100 truncate block">{cleanColor}</span>
      </div>
    </div>
  );
};

export const VisualizeSection: React.FC<VisualizeSectionProps> = ({
  discoverContext,
  positionContext,
  shapeContext,
  visualizeData,
  onBuildVisualize,
  isLoading,
  error,
  onProceedToChallenge,
}) => {
  return (
    <div id="visualize-stage-section" className="w-full max-w-5xl mx-auto my-12 px-4 space-y-8 animate-fade-in">
      {/* Stage Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-950/70 via-slate-900 to-cyan-950/70 border border-pink-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold uppercase tracking-wider">
              <Eye className="w-3.5 h-3.5" />
              <span>Phase 4 — Visualize</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Visual Strategy & Identity Direction
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Translate your established Discover, Position, and Shape strategy into a coherent visual direction covering typography, color mood, composition, shape language, imagery style, and anti-patterns.
            </p>

            {/* Context attached indicator */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-mono pt-1">
              <div className="flex items-center gap-1.5 text-cyan-300">
                <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Phase 1-3 Context Loaded</span>
              </div>
              <div className="flex items-center gap-1.5 text-purple-300">
                <Tag className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Category: <strong>{positionContext.category}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-pink-300">
                <Compass className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                <span>Tagline: <strong>"{shapeContext.tagline}"</strong></span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto shrink-0">
            {!visualizeData && (
              <button
                id="visualize-brand-btn"
                onClick={onBuildVisualize}
                disabled={isLoading}
                className="w-full md:w-auto px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 hover:from-pink-500 hover:to-cyan-500 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98] transition duration-200 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Visualizing Strategy...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-pink-200" />
                    <span>Visualize Brand</span>
                    <ArrowRight className="w-4 h-4 text-pink-200" />
                  </>
                )}
              </button>
            )}

            {visualizeData && (
              <button
                onClick={onBuildVisualize}
                disabled={isLoading}
                className="w-full md:w-auto px-5 py-2.5 rounded-xl font-medium text-xs text-pink-300 bg-pink-950/40 hover:bg-pink-900/50 border border-pink-500/30 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 text-pink-400" />
                )}
                <span>{isLoading ? "Re-visualizing..." : "Re-generate Visual Direction"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Loading Banner overlay */}
        {isLoading && (
          <div className="mt-6 pt-6 border-t border-pink-900/60 flex flex-col items-center justify-center space-y-3 animate-fade-in">
            <div className="flex items-center gap-3 text-pink-300 text-sm font-medium">
              <div className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-ping" />
              <span>Developing Visual Language, Color Palette & Composition Principles...</span>
            </div>
            <p className="text-xs text-slate-400 text-center max-w-md">
              Synthesizing brand personality traits, voice, and positioning into actionable typography, color mood, spatial composition, and subject imagery directions.
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-0.5">Visual Strategy Error</p>
              <p className="text-rose-200/90">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Visual Direction Results Display */}
      {visualizeData && (
        <div className="space-y-8 animate-fade-in">
          {/* Section Title */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Phase 4 Visual Strategy Direction Generated</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">Phase 4 / 4 Complete</span>
          </div>

          {/* 1. Typography & Color Direction Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Typography Card */}
            <div className="glass-card rounded-2xl p-6 space-y-4 border-t-2 border-t-indigo-500">
              <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Type className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Typography Direction</h3>
                  <span className="text-xs text-indigo-400 font-mono">Font Pairings & Rationale</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                  <span className="text-xs font-mono font-bold uppercase text-indigo-300">Primary Font Direction</span>
                  <p className="text-sm font-bold text-slate-100">{visualizeData.typography.primary_font_direction}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                  <span className="text-xs font-mono font-bold uppercase text-indigo-300">Secondary / Body Font Direction</span>
                  <p className="text-sm font-bold text-slate-100">{visualizeData.typography.secondary_font_direction}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 space-y-1">
                  <span className="text-xs font-mono font-bold uppercase text-indigo-400">Typography Rationale</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{visualizeData.typography.typography_rationale}</p>
                </div>
              </div>
            </div>

            {/* Color Direction Card */}
            <div className="glass-card rounded-2xl p-6 space-y-4 border-t-2 border-t-pink-500">
              <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
                <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Color Palette & Mood</h3>
                  <span className="text-xs text-pink-400 font-mono">Mood: {visualizeData.color_direction.color_mood}</span>
                </div>
              </div>

              <div className="space-y-3">
                {/* Primary Colors */}
                <div>
                  <span className="text-xs font-mono text-slate-400 block mb-1.5 font-semibold">Primary Colors:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {visualizeData.color_direction.primary_colors.map((c, idx) => (
                      <ColorSwatch key={idx} colorStr={c} label={`Primary ${idx + 1}`} />
                    ))}
                  </div>
                </div>

                {/* Supporting Colors */}
                <div>
                  <span className="text-xs font-mono text-slate-400 block mb-1.5 font-semibold">Supporting Colors:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {visualizeData.color_direction.supporting_colors.map((c, idx) => (
                      <ColorSwatch key={idx} colorStr={c} label={`Supporting ${idx + 1}`} />
                    ))}
                  </div>
                </div>

                {/* Accent Color */}
                <div>
                  <span className="text-xs font-mono text-slate-400 block mb-1.5 font-semibold">Accent Color:</span>
                  <ColorSwatch colorStr={visualizeData.color_direction.accent_color} label="Accent Color" isAccent={true} />
                </div>

                <div className="p-3.5 rounded-xl bg-pink-950/30 border border-pink-500/20 space-y-1">
                  <span className="text-xs font-mono font-bold uppercase text-pink-400">Color Rationale</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{visualizeData.color_direction.color_rationale}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Composition & Layout Card */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 border-t-2 border-t-cyan-500">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">Composition & Spatial Character</h3>
                <p className="text-xs text-slate-400">Layout principles, grid density, and visual weight structure</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Layout Principles */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-cyan-400">Layout Principles</span>
                <ul className="space-y-1.5 pt-1">
                  {visualizeData.composition.layout_principles.map((lp, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                      <span>{lp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Spacing & Hierarchy */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div>
                  <span className="text-xs font-mono font-bold uppercase text-cyan-400 block mb-0.5">Spacing Character</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{visualizeData.composition.spacing_character}</p>
                </div>
                <div>
                  <span className="text-xs font-mono font-bold uppercase text-cyan-400 block mb-0.5">Visual Hierarchy</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{visualizeData.composition.visual_hierarchy}</p>
                </div>
              </div>

              {/* Composition Rationale */}
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20 space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-cyan-300">Composition Rationale</span>
                <p className="text-xs text-slate-300 leading-relaxed">{visualizeData.composition.composition_rationale}</p>
              </div>
            </div>
          </div>

          {/* 3. Symbols & Shape Language Card */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 border-t-2 border-t-purple-500">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Shapes className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">Symbols, Shape Language & Iconography</h3>
                <p className="text-xs text-slate-400">Abstract direction, stroke style, and repeating graphic motifs</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-xs font-mono font-bold uppercase text-purple-400">Symbol Direction</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{visualizeData.symbols_and_graphics.symbol_direction}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-xs font-mono font-bold uppercase text-purple-400">Shape Language</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{visualizeData.symbols_and_graphics.shape_language}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-xs font-mono font-bold uppercase text-purple-400">Iconography Direction</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{visualizeData.symbols_and_graphics.iconography_direction}</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Graphic Motifs */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <span className="text-xs font-mono font-bold uppercase text-purple-400">Graphic Motifs & Patterns</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {visualizeData.symbols_and_graphics.graphic_motifs.map((motif, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md text-xs font-medium bg-purple-950/60 border border-purple-500/30 text-purple-200">
                        {motif}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Symbols Rationale */}
                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20 space-y-1">
                  <span className="text-xs font-mono font-bold uppercase text-purple-300">Symbolic Rationale</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{visualizeData.symbols_and_graphics.rationale}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Imagery Direction Card */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 border-t-2 border-t-amber-500">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">Imagery & Photographic Style</h3>
                <p className="text-xs text-slate-400">Visual atmosphere, lighting, subjects, and key photo characteristics</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-amber-400">Photography / Illustration Style</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {visualizeData.imagery.photography_or_illustration_style}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-amber-400">Subject Direction & Lighting</span>
                <p className="text-xs text-slate-300 leading-relaxed mb-1">
                  <strong>Subject Focus:</strong> {visualizeData.imagery.subject_direction}
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Lighting/Mood:</strong> {visualizeData.imagery.lighting_or_mood}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/20 space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-amber-300">Characteristics & Rationale</span>
                <div className="flex flex-wrap gap-1 pb-1">
                  {visualizeData.imagery.image_characteristics.map((char, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-[11px] bg-amber-950/70 border border-amber-500/30 text-amber-200">
                      {char}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{visualizeData.imagery.imagery_rationale}</p>
              </div>
            </div>
          </div>

          {/* 5. Concepts to Avoid */}
          <div className="glass-card rounded-2xl p-6 space-y-4 border-t-2 border-t-rose-500">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Ban className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">Visual Concepts & Clichés to Avoid</h3>
                <span className="text-xs text-rose-400 font-mono">Conflicting styles & overused tropes</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visualizeData.concepts_to_avoid.map((cta, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2 text-sm font-bold text-rose-300">
                    <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                    <span>{cta.concept}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pl-4">
                    {cta.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Visual Summary Card */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 border-l-4 border-l-pink-400 bg-slate-900/90 space-y-3">
            <div className="flex items-center gap-2 text-pink-400 font-mono text-xs font-semibold uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Complete Visual System Synthesis</span>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
              {visualizeData.visual_summary}
            </p>
          </div>

          {/* CTA to Phase 5 Challenge */}
          {onProceedToChallenge && (
            <div className="pt-4 flex justify-center">
              <button
                onClick={onProceedToChallenge}
                className="px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-rose-600 via-amber-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-xl shadow-rose-500/20 hover:shadow-rose-500/35 hover:scale-105 active:scale-95 transition duration-200 flex items-center gap-3 cursor-pointer"
              >
                <span>Proceed to Phase 5: Challenge</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
