"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, AlertCircle, Lightbulb, Loader2 } from "lucide-react";

interface IdeaFormProps {
  onSubmit: (idea: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const EXAMPLE_IDEAS = [
  "Build a sustainable streetwear brand for college students.",
  "I want to build an app that helps college students find teammates for hackathons.",
  "An AI-powered recipe generator that creates meal plans based on leftover groceries in your fridge."
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
    <div className="w-full max-w-3xl mx-auto my-8 px-4">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight gradient-text mb-4">
          Turn a rough idea into a launch-ready brand.
        </h1>
        <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
          The <span className="text-indigo-400 font-semibold">Discover</span> stage analyzes your core problem, target audience, and key constraints before defining your brand identity.
        </p>
      </div>

      {/* Form Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 gradient-accent"></div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="idea-input"
                className="block text-base font-semibold text-slate-200"
              >
                Tell us about your idea
              </label>
              <span className="text-xs text-slate-500 font-mono">
                {idea.length} chars
              </span>
            </div>

            <textarea
              id="idea-input"
              rows={5}
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
              placeholder="Example: Build a sustainable streetwear brand for college students."
              className="w-full px-4 py-3.5 rounded-xl bg-slate-900/90 border border-slate-700/70 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-base leading-relaxed transition resize-y min-h-[130px] disabled:opacity-50"
            />
          </div>

          {/* Prompt Examples */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Need inspiration? Click an example to analyze immediately:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_IDEAS.map((ex, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectExample(ex)}
                  disabled={isLoading}
                  className="text-xs bg-slate-800/60 hover:bg-indigo-950/60 border border-slate-700/50 hover:border-indigo-500/40 text-slate-300 hover:text-indigo-200 px-3 py-1.5 rounded-lg transition text-left truncate max-w-full cursor-pointer disabled:opacity-50"
                >
                  "{ex.length > 55 ? ex.substring(0, 55) + "..." : ex}"
                </button>
              ))}
            </div>
          </div>

          {/* Validation or API Error Alerts */}
          {(validationError || error) && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-0.5">Error</p>
                <p className="text-rose-200/90">{validationError || error}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              id="send-message-btn"
              type="submit"
              disabled={isLoading}
              aria-label="Send Message"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-white gradient-accent shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition duration-200 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending Message...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-indigo-200" />
                  <span>Send Message</span>
                  <ArrowRight className="w-5 h-5 text-indigo-200 ml-1" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col items-center justify-center space-y-3">
            <div className="flex items-center gap-3 text-indigo-400 text-sm font-medium">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <span>Running Discover AI Analysis Workflow...</span>
            </div>
            <p className="text-xs text-slate-500 text-center max-w-sm">
              Extracting core problem, target audience, value drivers, assumptions, and key unanswered questions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
