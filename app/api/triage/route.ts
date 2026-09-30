import { NextRequest, NextResponse } from "next/server";
import { SymptomInput } from "@/lib/contracts/triage";
import { evaluateTriage } from "@/lib/triage/engine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const input: SymptomInput = {
      symptom: typeof body.symptom === "string" ? body.symptom : "",
      stage: body.stage || "PREGNANT",
      severity: body.severity || "UNKNOWN",
      weeksOrDays: typeof body.weeksOrDays === "number" ? body.weeksOrDays : undefined,
      language: body.language === "am" ? "am" : "en",
    };

    const result = evaluateTriage(input);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        urgency: "CONTACT_HEALTH_WORKER",
        reason: "Invalid input payload or system error.",
        nextAction: "Please re-submit your symptom details or contact your health extension worker.",
        evidence: [],
      },
      { status: 400 }
    );
  }
}
