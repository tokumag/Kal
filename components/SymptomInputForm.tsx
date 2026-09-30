import React, { useState } from "react";
import { PatientStage, SymptomInput } from "@/lib/contracts/triage";
import { voiceClient } from "@/lib/voice/voxide";

interface SymptomInputFormProps {
  language: "en" | "am";
  onSubmit: (input: SymptomInput) => void;
  isLoading: boolean;
}

export const SymptomInputForm: React.FC<SymptomInputFormProps> = ({
  language,
  onSubmit,
  isLoading,
}) => {
  const [symptomText, setSymptomText] = useState("");
  const [stage, setStage] = useState<PatientStage>("PREGNANT");
  const [severity, setSeverity] = useState<"MILD" | "MODERATE" | "SEVERE" | "UNKNOWN">("UNKNOWN");
  const [weeksOrDays, setWeeksOrDays] = useState<number | "">(34);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const handleVoiceToggle = () => {
    setVoiceError(null);
    if (isListening) {
      voiceClient.stopListening();
      setIsListening(false);
      return;
    }

    if (!voiceClient.isSupported()) {
      setVoiceError(
        language === "am"
          ? "በዚህ ብሮውዘር ላይ የድምፅ መቅረጫ አልተደገፈም። እባክዎን በጽሁፍ ያስገቡ።"
          : "Voice recognition is not supported in this browser environment. Please use the typed fallback below."
      );
      return;
    }

    setIsListening(true);
    voiceClient.startListening({
      language,
      onResult: (text) => {
        setSymptomText(text);
        setVoiceError(null);
      },
      onError: (err) => {
        setVoiceError(err);
        setIsListening(false);
      },
      onEnd: () => {
        setIsListening(false);
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomText.trim()) return;

    onSubmit({
      symptom: symptomText,
      stage,
      severity,
      weeksOrDays: typeof weeksOrDays === "number" ? weeksOrDays : undefined,
      language,
    });
  };

  const loadAsterDemoPreset = () => {
    setStage("PREGNANT");
    setWeeksOrDays(34);
    setSeverity("SEVERE");
    setSymptomText(
      language === "am"
        ? "የ 34 ሳምንት እርጉዝ ነኝ፣ ከፍተኛ ራስ ምታት እና የፊት እብጠት አለብኝ"
        : "34 weeks pregnant with a severe headache and facial swelling"
    );
    setVoiceError(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5 md:p-6 space-y-6">
      {/* Voice Primary Action Section */}
      <div className="text-center space-y-3 pb-4 border-b border-slate-100">
        <label className="block text-sm font-semibold text-slate-700">
          {language === "am" ? "በድምፅ ይናገሩ (Voice First)" : "Primary Input: Speak to Kalcare"}
        </label>

        <button
          type="button"
          onClick={handleVoiceToggle}
          disabled={isLoading}
          className={`relative inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-bold shadow-lg transition-all transform active:scale-95 ${
            isListening
              ? "bg-rose-600 text-white animate-pulse ring-4 ring-rose-200"
              : "bg-teal-700 text-white hover:bg-teal-800 hover:shadow-teal-200"
          }`}
        >
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
          {isListening
            ? language === "am"
              ? "እየሰማሁ ነው... (ይናገሩ)"
              : "Listening... (Speak Now)"
            : language === "am"
            ? "ለካልኬር ይናገሩ (Talk to Kalcare)"
            : "Talk to Kalcare"}
        </button>

        {voiceError && (
          <div className="mt-2 text-xs text-rose-600 bg-rose-50 p-2 rounded border border-rose-200 text-left">
            ⚠️ {voiceError}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Stage Selection */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            {language === "am" ? "የእናትነት / የህፃን ደረጃ" : "Patient Stage"}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "PREGNANT", en: "Pregnant", am: "እርጉዝ" },
              { id: "POSTPARTUM", en: "Postpartum", am: "ከወሊድ በኋላ" },
              { id: "NEWBORN", en: "Newborn", am: "አዲስ የተወለደ" },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setStage(st.id as PatientStage)}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                  stage === st.id
                    ? "bg-teal-50 border-teal-600 text-teal-900 shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {language === "am" ? st.am : st.en}
              </button>
            ))}
          </div>
        </div>

        {/* Severity & Age Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              {language === "am" ? "የህመሙ መጠን (Severity)" : "Severity Level"}
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as any)}
              className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="UNKNOWN">{language === "am" ? "አልተወሰነም / Unknown" : "Unknown / Unspecified"}</option>
              <option value="MILD">{language === "am" ? "ቀለል ያለ / Mild" : "Mild"}</option>
              <option value="MODERATE">{language === "am" ? "መጠነኛ / Moderate" : "Moderate"}</option>
              <option value="SEVERE">{language === "am" ? "ከፍተኛ / Severe" : "Severe"}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              {stage === "NEWBORN"
                ? language === "am"
                  ? "የህፃኑ እድሜ (ቀናት)"
                  : "Newborn Age (Days)"
                : language === "am"
                ? "የእርግዝና ሳምንት"
                : "Gestational Age (Weeks)"}
            </label>
            <input
              type="number"
              min="1"
              max="45"
              value={weeksOrDays}
              onChange={(e) => setWeeksOrDays(e.target.value ? parseInt(e.target.value) : "")}
              className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="e.g. 34"
            />
          </div>
        </div>

        {/* Typed Fallback Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            {language === "am"
              ? "የህመም ምልክት በጽሁፍ (Typed Fallback Input)"
              : "Symptom Description (Typed Input)"}
          </label>
          <textarea
            rows={3}
            value={symptomText}
            onChange={(e) => setSymptomText(e.target.value)}
            placeholder={
              language === "am"
                ? "የሚሰማዎትን የህመም ምልክት እዚህ ይጻፉ... (ምሳሌ: ከፍተኛ ራስ ምታት፣ የደም መፍሰስ)"
                : "Describe symptoms here (e.g. severe headache, fever, vaginal bleeding)..."
            }
            className="w-full text-sm p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-2">
          <button
            type="button"
            onClick={loadAsterDemoPreset}
            className="w-full sm:w-auto text-xs text-teal-700 bg-teal-50 border border-teal-200 px-3 py-2 rounded-lg hover:bg-teal-100 font-medium transition-colors"
          >
            📋 {language === "am" ? "የአስቴር ዲሞ ቅድመ-ዝግጅት" : "Load Demo Persona: Aster"}
          </button>

          <button
            type="submit"
            disabled={isLoading || !symptomText.trim()}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-bold text-white transition-all shadow-md ${
              isLoading || !symptomText.trim()
                ? "bg-slate-300 cursor-not-allowed"
                : "bg-teal-700 hover:bg-teal-800"
            }`}
          >
            {isLoading
              ? language === "am"
                ? "እየተመረመረ ነው..."
                : "Evaluating Triage..."
              : language === "am"
              ? "ምርመራ ይመልከቱ"
              : "Submit Symptom"}
          </button>
        </div>
      </form>
    </div>
  );
};
