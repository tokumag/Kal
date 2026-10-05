// lib/triage/fallback.ts
// Clinically safe escalation fallback when inputs are uncertain, ambiguous, or unmatched.
// Safety principle: Never guess. Never default to MONITOR. Escalate toward human care.

import { TriageResult } from "../contracts/triage";

export const FALLBACK_RESULT_EN: TriageResult = {
  urgency: "CONTACT_HEALTH_WORKER",
  reason: "Kalcare could not safely determine the urgency from the information provided.",
  nextAction: "Contact a Health Extension Worker or seek professional medical care for assessment.",
  evidence: [],
};

export const FALLBACK_RESULT_AM: TriageResult = {
  urgency: "CONTACT_HEALTH_WORKER",
  reason: "ካልኬር ከቀረቡት መረጃዎች ላይ አስቸኳይነቱን ደህንነቱ በተጠበቀ ሁኔታ ሊወስን አልቻለም።",
  nextAction: "የጤና ኤክስቴንሽን ሰራተኛ ያነጋግሩ ወይም ለምርመራ ወደ ጤና ጣቢያ ሂዱ።",
  evidence: [],
};

export function getFallbackResult(language?: "en" | "am"): TriageResult {
  return language === "am" ? { ...FALLBACK_RESULT_AM } : { ...FALLBACK_RESULT_EN };
}
