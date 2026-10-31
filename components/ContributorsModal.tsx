"use client";

import React from "react";
import { X, Users, Code, Server, HeartPulse, ExternalLink } from "lucide-react";

interface ContributorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: "en" | "am";
}

export const ContributorsModal: React.FC<ContributorsModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;

  const contributors = [
    {
      name: "Tokuma Gebissa",
      github: "tokumag",
      role: language === "am" ? "የፕሮጀክት መሪ እና አርክቴክቸር" : "Project Lead & Architecture",
      icon: Users,
      color: "from-blue-500 to-indigo-600",
      description:
        language === "am"
          ? "የመሰረተ-ልማት አርክቴክቸር፣ የSTARK ማመልከቻ እና የፕሮጀክት አመራር"
          : "Repository owner, foundational architecture, product ideation, and STARK submission",
      badge: "Architecture & Lead",
    },
    {
      name: "Kalkidan Wondimagegnehu",
      github: "KalkidanAI",
      role: language === "am" ? "የኋላ-መረጃ አልሚ (Back-End Developer)" : "Back-End Developer",
      icon: Server,
      color: "from-teal-500 to-emerald-600",
      description:
        language === "am"
          ? "የህክምና ውሳኔ ሰጪ ሞተር (Deterministic Triage Engine)፣ Next.js /api/triage ኤፒአይ፣ እና የራስ-ሰር ሙከራዎች"
          : "Deterministic clinical triage engine (lib/triage/), Next.js API route (/api/triage), automated test suites, and clinical validation",
      badge: "Backend & Engine",
    },
    {
      name: "Nardos Fekadu",
      github: "Nardos-12-Fekadu",
      role: language === "am" ? "ሙሉ-ክፍል አልሚ (Full-Stack & Voice UI)" : "Full-Stack & Clinical Engine",
      icon: Code,
      color: "from-violet-500 to-purple-600",
      description:
        language === "am"
          ? "የድምፅ በይነገጽ (Voice UI)፣ የጋራ TypeScript ውል፣ እና የፊት-ለፊት በይነገጽ"
          : "Voice UI integration, shared TypeScript contracts (lib/contracts/triage.ts), and front-end interface",
      badge: "Full-Stack & Voice UI",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {language === "am" ? "የፕሮጀክቱ አበርካቾች" : "Project Contributors & Architecture"}
              </h2>
              <p className="text-xs text-slate-400">
                Kalcare — STARK Hackathon 2026 Core Team
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Architecture Pipeline Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              {language === "am" ? "የስራ ፍሰት በጋራ" : "How All Contributions Work Together on Localhost"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-sm">
                <span className="font-bold text-violet-600 block">1. Voice / Web UI</span>
                <span className="text-[11px] text-slate-500">Listens & captures maternal symptoms</span>
              </div>
              <div className="p-2.5 rounded-lg bg-teal-50 border border-teal-200 shadow-sm">
                <span className="font-bold text-teal-700 block">2. Back-End API</span>
                <span className="text-[11px] text-teal-600">Pure deterministic clinical triage (lib/triage)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-sm">
                <span className="font-bold text-blue-600 block">3. Result & Voice Out</span>
                <span className="text-[11px] text-slate-500">WHO/FMOH urgency & spoken advice</span>
              </div>
            </div>
          </div>

          {/* Contributors List */}
          <div className="space-y-3">
            {contributors.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.github}
                  className="p-4 rounded-xl border border-slate-200 hover:border-teal-300 hover:shadow-md transition bg-white"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} text-white flex items-center justify-center font-bold shadow-sm`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-slate-900 text-sm">{c.name}</h4>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            {c.badge}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-teal-600">{c.role}</p>
                      </div>
                    </div>
                    <a
                      href={`https://github.com/${c.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-teal-600 font-mono transition"
                    >
                      <span>@{c.github}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-xs text-slate-600 mt-2.5 pl-13">
                    {c.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1.5">
            <HeartPulse className="w-4 h-4 text-rose-500" />
            <span>WHO & FMOH Evidence Guidelines Sourced</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
