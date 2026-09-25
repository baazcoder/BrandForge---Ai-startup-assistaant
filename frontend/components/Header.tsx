"use client";

import React from "react";
import { Sparkles, Compass } from "lucide-react";

interface HeaderProps {
  activeStage?: number;
}

export const Header: React.FC<HeaderProps> = ({ activeStage = 1 }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-white font-mono">
              Brand<span className="text-indigo-400">Forge</span>
            </span>
          </div>
        </div>

        {/* Workflow Stage Badges */}
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
            activeStage === 1
              ? "bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 shadow-sm"
              : "bg-slate-800/60 border border-slate-700/50 text-slate-400"
          }`}>
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span>Phase 1: Discover</span>
          </div>

          <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
            activeStage === 2
              ? "bg-purple-500/20 border border-purple-500/40 text-purple-300 shadow-sm"
              : "bg-slate-800/60 border border-slate-700/50 text-slate-400"
          }`}>
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            <span>Phase 2: Position</span>
          </div>

          <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
            activeStage === 3
              ? "bg-amber-500/20 border border-amber-500/40 text-amber-300 shadow-sm"
              : "bg-slate-800/60 border border-slate-700/50 text-slate-400"
          }`}>
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Phase 3: Shape</span>
          </div>

          <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
            activeStage === 4
              ? "bg-pink-500/20 border border-pink-500/40 text-pink-300 shadow-sm"
              : "bg-slate-800/60 border border-slate-700/50 text-slate-400"
          }`}>
            <Compass className="w-3.5 h-3.5 text-pink-400" />
            <span>Phase 4: Visualize</span>
          </div>

          <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${
            activeStage === 5
              ? "bg-rose-500/20 border border-rose-500/40 text-rose-300 shadow-sm"
              : "bg-slate-800/60 border border-slate-700/50 text-slate-400"
          }`}>
            <Compass className="w-3.5 h-3.5 text-rose-400" />
            <span>Phase 5: Challenge</span>
          </div>
        </div>
      </div>
    </header>
  );
};


