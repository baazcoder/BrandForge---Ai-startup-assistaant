"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  AlertCircle,
  Lightbulb,
  Loader2,
  Compass,
  Target,
  MessageSquare,
  Palette,
  ShieldAlert,
  PackageCheck,
  ClipboardCheck,
  Zap
} from "lucide-react";

interface IdeaFormProps {
  onSubmit: (idea: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const EXAMPLE_IDEAS = [
  "Build a sustainable streetwear brand for college students.",
  "AI-powered teammate discovery platform for hackathons and academic builds.",
  "Zero-waste recipe generator that creates meal plans based on leftover groceries in your fridge."
];

const WORKFLOW_STEPS = [
  { step: "01", name: "Discover", desc: "Problem & Persona", icon: Compass, color: "text-indigo-400" },
  { step: "02", name: "Position", desc: "Category & Angle", icon: Target, color: "text-purple-400" },
  { step: "03", name: "Shape", desc: "Name, Voice & Tagline", icon: MessageSquare, color: "text-amber-400" },
  { step: "04", name: "Visualize", desc: "Colors, Fonts & Mood", icon: Palette, color: "text-pink-400" },
  { step: "05", name: "Challenge", desc: "Risk & Cliché Audit", icon: ShieldAlert, color: "text-rose-400" },
  { step: "06", name: "Deliver", desc: "Launch Brand Kit", icon: PackageCheck, color: "text-emerald-400" },
  { step: "07", name: "Evaluate", desc: "Coherence Audit", icon: ClipboardCheck, color: "text-blue-400" },
];

export const IdeaForm: React.FC<IdeaFormProps> = ({ onSubmit, isLoading, error }) => {
  const [idea, setIdea] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const trimmed = idea.trim();
    if (!trimmed) {
      setValidationError("Please enter your startup or product idea before proceeding.");
      return;
    }

    if (trimmed.length < 5) {
      setValidationError("Please describe your idea in a few more words (at least 5 characters).");
      return;
    }

    await onSubmit(trimmed);
  };

  const handleSelectExample = async (ex: string) => {
    setIdea(ex);
    setValidationError(null);
    await onSubmit(ex);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4 space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
          <span>7-Stage AI Strategy & Brand Engine</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight gradient-text max-w-2xl mx-auto leading-tight">
          Turn a rough idea into a launch-ready brand.
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
          BrandForge transforms your product concept into structured discovery, positioning, verbal identity, visual strategy, risk audit, and launch assets.
        </p>

        {/* 7-Stage Strategic Pipeline Preview Grid */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {WORKFLOW_STEPS.map((wf) => {
            const Icon = wf.icon;
            return (
              <div
                key={wf.step}
                className="glass-card rounded-xl p-2.5 text-left border-slate-800/80 hover:border-indigo-500/40 transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-slate-500">{wf.step}</span>
                  <Icon className={`w-3.5 h-3.5 ${wf.color} group-hover:scale-110 transition duration-200`} />
                </div>
                <div className="text-xs font-bold text-slate-200 tracking-tight">{wf.name}</div>
                <div className="text-[10px] text-slate-400 leading-tight truncate">{wf.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Idea Form Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 left-0 right-0 h-1 gradient-accent"></div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="idea-input"
                className="block text-sm sm:text-base font-bold text-slate-100"
              >
                Describe your startup or product idea
              </label>
              <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                <span className="hidden sm:inline">Press Ctrl + Enter to submit</span>
                <span>{idea.length} chars</span>
              </div>
            </div>

            <textarea
              id="idea-input"
              rows={4}
              value={idea}
              onChange={(e) => {
                setIdea(e.target.value);
                if (validationError) setValidationError(null);
              }}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                  e.preventDefault();
                  if (!isLoading) {
                    handleSubmit(e);
                  }
                }
              }}
              disabled={isLoading}
              placeholder="e.g. Build an app that connects college students with compatible hackathon teammates based on complementary coding and design skills..."
              className="w-full px-4 py-3.5 rounded-xl bg-slate-900/95 border border-slate-700/70 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 text-sm sm:text-base leading-relaxed transition resize-y min-h-[120px] disabled:opacity-50"
            />
          </div>

          {/* Quick Examples */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Click a sample idea for immediate analysis:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_IDEAS.map((ex, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectExample(ex)}
                  disabled={isLoading}
                  className="text-xs bg-slate-800/80 hover:bg-indigo-950/70 border border-slate-700/60 hover:border-indigo-500/40 text-slate-300 hover:text-indigo-200 px-3 py-1.5 rounded-lg transition text-left truncate max-w-full cursor-pointer disabled:opacity-50"
                >
                  "{ex.length > 55 ? ex.substring(0, 55) + "..." : ex}"
                </button>
              ))}
            </div>
          </div>

          {/* Validation or API Error Alerts */}
          {(validationError || error) && (
            <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-sm flex items-start gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-semibold text-rose-300">Input Validation</p>
                <p className="text-xs text-rose-200/90 leading-relaxed">{validationError || error}</p>
              </div>
            </div>
          )}

          {/* Submit Action Button */}
          <div className="pt-2 flex justify-end">
            <button
              id="send-message-btn"
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white gradient-accent hover:gradient-accent-hover shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition duration-200 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>Analyzing Idea...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-indigo-200" />
                  <span>Forge Brand Strategy</span>
                  <ArrowRight className="w-5 h-5 text-indigo-200 ml-1" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Stage 1 Loading Feedback */}
        {isLoading && (
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col items-center justify-center space-y-3">
            <div className="flex items-center gap-3 text-indigo-300 text-sm font-semibold">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
              <span>Phase 1 — Discover: Analyzing idea problem & target user...</span>
            </div>
            <p className="text-xs text-slate-400 text-center max-w-md leading-relaxed">
              Extracting core problem statement, audience persona, value proposition, pain points, and unverified assumptions...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
