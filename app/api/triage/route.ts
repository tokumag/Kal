import { NextRequest, NextResponse } from "next/server";
import { PatientStage, SymptomInput } from "@/lib/contracts/triage";
import { evaluateTriage } from "@/lib/triage/engine";

const VALID_STAGES: Set<string> = new Set<PatientStage>([
  "PREGNANT",
  "POSTPARTUM",
  "NEWBORN",
]);

const VALID_SEVERITIES: Set<string> = new Set([
  "MILD",
  "MODERATE",
  "SEVERE",
  "UNKNOWN",
]);

const VALID_LANGUAGES: Set<string> = new Set(["en", "am"]);

/**
 * Validates request payload against SymptomInput schema.
 * Returns either validated SymptomInput or null.
 */
function validateRequestBody(body: unknown): { input: SymptomInput } | { error: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Invalid request: payload must be a JSON object" };
  }

  const data = body as Record<string, unknown>;

  // 1. Validate symptom (required non-empty string)
  if (typeof data.symptom !== "string" || data.symptom.trim().length === 0) {
    return { error: "Invalid request: symptom is required and must be a non-empty string" };
  }

  // 2. Validate stage (required enum)
  if (typeof data.stage !== "string" || !VALID_STAGES.has(data.stage)) {
    return { error: "Invalid request: stage must be one of PREGNANT, POSTPARTUM, NEWBORN" };
  }

  // 3. Validate severity (optional enum)
  if (data.severity !== undefined) {
    if (typeof data.severity !== "string" || !VALID_SEVERITIES.has(data.severity)) {
      return { error: "Invalid request: severity must be one of MILD, MODERATE, SEVERE, UNKNOWN" };
    }
  }

  // 4. Validate language (optional enum)
  if (data.language !== undefined) {
    if (typeof data.language !== "string" || !VALID_LANGUAGES.has(data.language)) {
      return { error: "Invalid request: language must be 'en' or 'am'" };
    }
  }

  // 5. Validate weeksOrDays (optional number >= 0)
  if (data.weeksOrDays !== undefined) {
    if (
      typeof data.weeksOrDays !== "number" ||
      !Number.isFinite(data.weeksOrDays) ||
      data.weeksOrDays < 0
    ) {
      return { error: "Invalid request: weeksOrDays must be a non-negative number" };
    }
  }

  const input: SymptomInput = {
    symptom: data.symptom.trim(),
    stage: data.stage as PatientStage,
    severity: (data.severity as SymptomInput["severity"]) ?? "UNKNOWN",
    language: (data.language as SymptomInput["language"]) ?? "en",
    weeksOrDays: data.weeksOrDays as number | undefined,
  };

  return { input };
}

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request: malformed JSON" }, { status: 400 });
    }

    const validation = validateRequestBody(body);
    if ("error" in validation) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const result = evaluateTriage(validation.input);
    return NextResponse.json(result, { status: 200 });
  } catch {
    // Never leak stack traces or internal implementation details
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
