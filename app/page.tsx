"use client";

import React, { useState } from "react";
import { SymptomInput, TriageResult } from "@/lib/contracts/triage";
import { Header } from "@/components/Header";
import { SymptomInputForm } from "@/components/SymptomInputForm";
import { TriageResultCard } from "@/components/TriageResultCard";
import { EmergencyHotlineCard } from "@/components/EmergencyHotlineCard";

export default function Home() {
  const [language, setLanguage] = useState<"en" | "am">("en");
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSymptomSubmit = async (input: SymptomInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/triage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error("Failed to evaluate triage.");
      }

      const result: TriageResult = await response.json();
      setTriageResult(result);
    } catch (err) {
      setError(
        language === "am"
          ? "ምርመራውን ማካሄድ አልተቻለም። እባክዎን እንደገና ይሞክሩ።"
          : "Could not evaluate triage right now. Please check your network and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Header language={language} onLanguageChange={setLanguage} />

        <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Architectural Safety Banner */}
          <div className="bg-slate-900 text-slate-300 rounded-xl p-4 text-xs flex items-center justify-between border border-slate-800 shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="text-teal-400 font-bold">CORE ARCHITECTURE:</span>
              <span>
                {language === "am"
                  ? "Voxide ድምፅን ይረዳል → የወሰነ ሞተር ይወስናል → መረጃ ያብራራል።"
                  : "Voxide understands speech. Deterministic rules decide urgency. Evidence explains why."}
              </span>
            </div>
            <span className="hidden md:inline-block px-2 py-0.5 rounded bg-teal-950 text-teal-300 font-mono text-[10px] border border-teal-800">
              STARK COMPLIANT
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Form Column */}
            <div className="lg:col-span-6 space-y-6">
              <SymptomInputForm
                language={language}
                onSubmit={handleSymptomSubmit}
                isLoading={isLoading}
              />
            </div>

            {/* Results Column */}
            <div className="lg:col-span-6 space-y-6">
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-sm">
                  🚨 {error}
                </div>
              )}

              {triageResult ? (
                <TriageResultCard result={triageResult} language={language} />
              ) : (
                <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-xl">
                    🩺
                  </div>
                  <h3 className="text-sm font-semibold text-slate-700">
                    {language === "am"
                      ? "የጤና ግምገማ ውጤት እዚህ ይታያል"
                      : "No Active Triage Result"}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    {language === "am"
                      ? "በድምፅ ወይም በጽሁፍ የህመም ምልክት በማስገባት 'Talk to Kalcare' የሚለውን ይጫኑ።"
                      : "Speak using 'Talk to Kalcare' or type your symptom to view the evidence-backed decision."}
                  </p>
                </div>
              )}

              <EmergencyHotlineCard language={language} />
            </div>
          </div>
        </main>
      </div>

      <footer className="border-t border-slate-200 bg-white py-4 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-xs text-slate-500">
          Kalcare Hackathon Prototype — STARK Sep 09 - Oct 02 • Sourced WHO & FMOH Clinical Navigation
        </div>
      </footer>
    </div>
  );
}
