// lib/contracts/triage.ts
// Shared canonical TypeScript contract for Kalcare triage system.
// Person B owns this file. Pure contract, independent of React/UI/frameworks.

export type PatientStage =
  | "PREGNANT"
  | "POSTPARTUM"
  | "NEWBORN";

export type Urgency =
  | "MONITOR"
  | "CONTACT_HEALTH_WORKER"
  | "SEEK_CARE_NOW";

export interface SymptomInput {
  symptom: string;
  severity?: "MILD" | "MODERATE" | "SEVERE" | "UNKNOWN";
  stage: PatientStage;
  weeksOrDays?: number;
  language?: "en" | "am";
}

export interface EvidenceReference {
  source: string;
  version: string;
  reference: string;
}

export interface TriageResult {
  urgency: Urgency;
  reason: string;
  nextAction: string;
  evidence: EvidenceReference[];
}
