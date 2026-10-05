// lib/triage/index.ts
// Entry point for Kalcare deterministic triage package.
// Exports pure evaluator, rules, and fallbacks.

export { evaluateTriage } from "./evaluator";
export { TRIAGE_RULES, type TriageRule } from "./rules";
export {
  getFallbackResult,
  FALLBACK_RESULT_EN,
  FALLBACK_RESULT_AM,
} from "./fallback";
