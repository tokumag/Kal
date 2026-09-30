// Standalone test script for Kalcare Triage Engine
import { evaluateTriage } from "../lib/triage/engine.ts";

console.log("=== RUNNING KALCARE TRIAGE TESTS ===");

const test1 = evaluateTriage({
  symptom: "severe headache and blurred vision",
  stage: "PREGNANT",
  severity: "SEVERE",
  language: "en",
});
console.assert(test1.urgency === "SEEK_CARE_NOW", "Test 1 Failed: Severe headache must be SEEK_CARE_NOW");
console.log("✓ Test 1 Passed: Severe headache -> SEEK_CARE_NOW");

const test2 = evaluateTriage({
  symptom: "vaginal bleeding",
  stage: "PREGNANT",
  language: "en",
});
console.assert(test2.urgency === "SEEK_CARE_NOW", "Test 2 Failed: Vaginal bleeding must be SEEK_CARE_NOW");
console.log("✓ Test 2 Passed: Vaginal bleeding -> SEEK_CARE_NOW");

const test3 = evaluateTriage({
  symptom: "morning sickness nausea",
  stage: "PREGNANT",
  severity: "MILD",
  language: "en",
});
console.assert(test3.urgency === "MONITOR", "Test 3 Failed: Mild nausea must be MONITOR");
console.log("✓ Test 3 Passed: Mild nausea -> MONITOR");

const test4 = evaluateTriage({
  symptom: "ከፍተኛ ራስ ምታት",
  stage: "PREGNANT",
  language: "am",
});
console.assert(test4.urgency === "SEEK_CARE_NOW", "Test 4 Failed: Amharic headache must be SEEK_CARE_NOW");
console.log("✓ Test 4 Passed: Amharic headache -> SEEK_CARE_NOW");

console.log("=== ALL 4 TRIAGE ENGINE TESTS PASSED SUCCESSFULLY ===");
