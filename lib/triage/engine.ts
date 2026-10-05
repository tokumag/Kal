// lib/triage/engine.ts
// Direct module entry for triage engine evaluator.
// Supports existing imports from @/lib/triage/engine

export { evaluateTriage } from "./evaluator";
export { TRIAGE_RULES, type TriageRule } from "./rules";
export { getFallbackResult, FALLBACK_RESULT_EN, FALLBACK_RESULT_AM } from "./fallback";
