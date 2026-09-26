"use client";

import React from "react";
import { Sparkles, Check, Compass, ChevronRight } from "lucide-react";

interface HeaderProps {
  activeStage?: number;
}

const STAGES = [
  { id: 1, name: "Discover", color: "indigo" },
  { id: 2, name: "Position", color: "purple" },
  { id: 3, name: "Shape", color: "amber" },
  { id: 4, name: "Visualize", color: "pink" },
  { id: 5, name: "Challenge", color: "rose" },
  { id: 6, name: "Deliver", color: "emerald" },
  { id: 7, name: "Evaluate", color: "blue" },
];

export const Header: React.FC<HeaderProps> = ({ activeStage = 1 }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl gradient-accent flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-white font-mono">
              Brand<span className="text-indigo-400">Forge</span>
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
              v1.7 AI Engine
            </span>
          </div>
        </div>

        {/* Workflow Stage Badges - Horizontal Scrollable for all Screen Sizes */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar text-xs font-medium scroll-smooth max-w-full">
          {STAGES.map((st) => {
            const isCompleted = activeStage > st.id;
            const isActive = activeStage === st.id;

            return (
              <React.Fragment key={st.id}>
                <div
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-500/20 border border-indigo-400/60 text-indigo-200 shadow-md shadow-indigo-500/15 ring-1 ring-indigo-400/30"
                      : isCompleted
                      ? "bg-slate-900/90 border border-emerald-500/30 text-emerald-300"
                      : "bg-slate-900/50 border border-slate-800 text-slate-400 opacity-60"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <span
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                        isActive
                          ? "bg-indigo-500 text-white"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {st.id}
                    </span>
                  )}
                  <span>{st.name}</span>
                </div>

                {st.id < STAGES.length && (
                  <ChevronRight className="w-3 h-3 text-slate-700 shrink-0 hidden md:block" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </header>
  );
};
