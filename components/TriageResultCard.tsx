import React, { useState } from "react";
import { TriageResult, Urgency } from "@/lib/contracts/triage";
import { voiceClient } from "@/lib/voice/voxide";

interface TriageResultCardProps {
  result: TriageResult;
  language: "en" | "am";
}

export const TriageResultCard: React.FC<TriageResultCardProps> = ({ result, language }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);

  const getUrgencyConfig = (urgency: Urgency) => {
    switch (urgency) {
      case "SEEK_CARE_NOW":
        return {
          title: language === "am" ? "ወዲያውኑ የህክምና እርዳታ ያግኙ" : "SEEK CARE NOW",
          badgeBg: "bg-rose-600 text-white",
          border: "border-rose-300 bg-rose-50/40",
          icon: "🚨",
          badgeText: language === "am" ? "አስቸኳይ የህክምና እርምጃ" : "CRITICAL EMERGENCY",
        };
      case "CONTACT_HEALTH_WORKER":
        return {
          title: language === "am" ? "ከጤና ኤክስቴንሽን ሰራተኛ ጋር ይመካከሩ" : "CONTACT HEALTH WORKER",
          badgeBg: "bg-amber-600 text-white",
          border: "border-amber-300 bg-amber-50/40",
          icon: "⚠️",
          badgeText: language === "am" ? "ምክክር ያስፈልጋል" : "HEALTH WORKER CONSULTATION",
        };
      case "MONITOR":
      default:
        return {
          title: language === "am" ? "በቤት ውስጥ ይከታተሉ" : "MONITOR AT HOME",
          badgeBg: "bg-emerald-600 text-white",
          border: "border-emerald-300 bg-emerald-50/40",
          icon: "ℹ️",
          badgeText: language === "am" ? "መደበኛ ክትትል" : "ROUTINE MONITORING",
        };
    }
  };

  const config = getUrgencyConfig(result.urgency);

  const handleSpeakRecommendation = () => {
    if (isSpeaking) {
      voiceClient.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const speechText = `${config.title}. ${result.reason}. ${result.nextAction}`;
      voiceClient.speak(speechText, language, () => {
        setIsSpeaking(false);
      });
    }
  };

  return (
    <div className={`rounded-xl shadow-lg border-2 p-5 md:p-6 space-y-5 transition-all ${config.border}`}>
      {/* Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{config.icon}</span>
          <div>
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${config.badgeBg}`}>
              {config.badgeText}
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-1">{config.title}</h2>
          </div>
        </div>

        {/* Voice Readout CTA */}
        <button
          onClick={handleSpeakRecommendation}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors border shadow-sm ${
            isSpeaking
              ? "bg-rose-100 text-rose-800 border-rose-300 animate-pulse"
              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
          }`}
        >
          <span>{isSpeaking ? "🔊 Stop Voice" : "🔊 Listen to Recommendation"}</span>
        </button>
      </div>

      {/* Triage Reason */}
      <div className="space-y-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {language === "am" ? "የጤና ግምገማ ምክንያት" : "Clinical Assessment Reason"}
        </h3>
        <p className="text-sm text-slate-800 font-medium leading-relaxed bg-white/70 p-3 rounded-lg border border-slate-200/60">
          {result.reason}
        </p>
      </div>

      {/* Recommended Next Action */}
      <div className="space-y-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {language === "am" ? "የሚቀጥለው እርምጃ (Next Action)" : "Recommended Action"}
        </h3>
        <p className="text-sm font-semibold text-slate-900 bg-white p-3 rounded-lg border border-slate-200 shadow-sm leading-relaxed">
          👉 {result.nextAction}
        </p>
      </div>

      {/* Evidence Accordion */}
      {result.evidence && result.evidence.length > 0 && (
        <div className="pt-2 border-t border-slate-200/60">
          <button
            onClick={() => setShowEvidence(!showEvidence)}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center space-x-1"
          >
            <span>{showEvidence ? "▼ Hide Sourced Clinical Evidence" : "▶ View Sourced Clinical Evidence (WHO & FMOH)"}</span>
          </button>

          {showEvidence && (
            <div className="mt-3 space-y-2 text-xs bg-slate-900 text-slate-200 p-3 rounded-lg font-mono">
              <div className="text-teal-400 font-bold border-b border-slate-800 pb-1">
                EVIDENCE REGISTRY (STARK CLINICAL VERIFICATION)
              </div>
              {result.evidence.map((ev, idx) => (
                <div key={idx} className="space-y-0.5 border-b border-slate-800/80 pb-2 last:border-0 last:pb-0">
                  <div className="text-slate-300 font-semibold">{ev.source} ({ev.version})</div>
                  <div className="text-slate-400 text-[11px]">{ev.reference}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
