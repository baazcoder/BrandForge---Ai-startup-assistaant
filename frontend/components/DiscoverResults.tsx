"use client";

import React from "react";
import { DiscoverResponse } from "../lib/api";
import {
  Target,
  Users,
  Layers,
  Zap,
  AlertTriangle,
  ShieldAlert,
  HelpCircle,
  CheckCircle2,
  RotateCcw,
  ListChecks,
  Check
} from "lucide-react";

interface DiscoverResultsProps {
  data: DiscoverResponse;
  onReset: () => void;
}

export const DiscoverResults: React.FC<DiscoverResultsProps> = ({ data, onReset }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-10 px-4 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-purple-950/60 border border-indigo-500/20 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Discover Analysis Complete</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Structured Strategic Insights
          </h2>
          <p className="text-sm text-slate-400">
            Phase 1 workflow has framed the core problem space and product boundary.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => {
              const el = document.getElementById("position-stage-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Phase 2: Position</span>
          </button>
          <button
            onClick={handleCopyJson}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <ListChecks className="w-4 h-4 text-indigo-400" />}
            <span>{copied ? "JSON Copied!" : "Copy JSON"}</span>
          </button>
          <button
            onClick={onReset}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Analyze Another Idea</span>
          </button>
        </div>
      </div>

      {/* Grid Section 1: Main Narrative Cards (Problem, Target User, Context, Value) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Problem */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between border-l-4 border-l-rose-500">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Core Problem</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {data.problem}
            </p>
          </div>
        </div>

        {/* Target User */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between border-l-4 border-l-blue-500">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Target User</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {data.target_user}
            </p>
          </div>
        </div>

        {/* Context */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between border-l-4 border-l-purple-500">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Context</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {data.context}
            </p>
          </div>
        </div>

        {/* Value */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between border-l-4 border-l-emerald-500">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Value</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {data.value}
            </p>
          </div>
        </div>
      </div>

      {/* Grid Section 2: List Cards (Pain Points, Constraints, Assumptions, Open Questions) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pain Points */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Pain Points</h3>
              <span className="text-xs text-slate-400">{data.pain_points.length} identified</span>
            </div>
          </div>
          <ul className="space-y-2.5">
            {data.pain_points.map((point, index) => (
              <li key={index} className="flex items-start gap-2.5 text-sm text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-2" />
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Constraints */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Constraints</h3>
              <span className="text-xs text-slate-400">{data.constraints.length} identified</span>
            </div>
          </div>
          <ul className="space-y-2.5">
            {data.constraints.map((constraint, index) => (
              <li key={index} className="flex items-start gap-2.5 text-sm text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0 mt-2" />
                <span className="leading-relaxed">{constraint}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Assumptions */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <ListChecks className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Assumptions</h3>
              <span className="text-xs text-slate-400">{data.assumptions.length} to validate</span>
            </div>
          </div>
          <ul className="space-y-2.5">
            {data.assumptions.map((assumption, index) => (
              <li key={index} className="flex items-start gap-2.5 text-sm text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-2" />
                <span className="leading-relaxed">{assumption}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Open Questions */}
        <div className="glass-card rounded-2xl p-6 space-y-4 bg-indigo-950/20 border-indigo-500/30">
          <div className="flex items-center gap-3 border-b border-slate-800/80 pb-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Open Questions</h3>
              <span className="text-xs text-indigo-300">{data.open_questions.length} critical questions</span>
            </div>
          </div>
          <ul className="space-y-2.5">
            {data.open_questions.map((question, index) => (
              <li key={index} className="flex items-start gap-2.5 text-sm text-indigo-100">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-2" />
                <span className="leading-relaxed">{question}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
