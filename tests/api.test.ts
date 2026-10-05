// tests/api.test.ts
// Tests for Next.js POST /api/triage endpoint
// Requirements:
// 14. API validation
// 15. API success response
// 16. API invalid response

import { describe, it, expect } from "vitest";
import { POST } from "../app/api/triage/route";
import { NextRequest } from "next/server";

function createMockRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/triage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/triage API Handler", () => {
  it("returns 200 and TriageResult for valid danger sign input", async () => {
    const req = createMockRequest({
      symptom: "severe headache and blurry vision",
      stage: "PREGNANT",
      severity: "SEVERE",
      language: "en",
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.urgency).toBe("SEEK_CARE_NOW");
    expect(data.reason).toBeDefined();
    expect(data.nextAction).toBeDefined();
    expect(Array.isArray(data.evidence)).toBe(true);
    expect(data.evidence.length).toBeGreaterThan(0);
  });

  it("returns 200 for valid mild symptom input", async () => {
    const req = createMockRequest({
      symptom: "morning sickness nausea",
      stage: "PREGNANT",
      severity: "MILD",
      language: "en",
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.urgency).toBe("MONITOR");
  });

  it("returns 400 when symptom is missing or empty", async () => {
    const req = createMockRequest({
      symptom: "   ",
      stage: "PREGNANT",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toContain("symptom is required");
  });

  it("returns 400 when stage is missing or invalid", async () => {
    const req = createMockRequest({
      symptom: "headache",
      stage: "INFANT",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toContain("stage must be one of PREGNANT, POSTPARTUM, NEWBORN");
  });

  it("returns 400 when severity is invalid", async () => {
    const req = createMockRequest({
      symptom: "headache",
      stage: "PREGNANT",
      severity: "DANGEROUS",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toContain("severity must be one of");
  });

  it("returns 400 when language is invalid", async () => {
    const req = createMockRequest({
      symptom: "headache",
      stage: "PREGNANT",
      language: "fr",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toContain("language must be 'en' or 'am'");
  });

  it("returns 400 when weeksOrDays is negative", async () => {
    const req = createMockRequest({
      symptom: "headache",
      stage: "PREGNANT",
      weeksOrDays: -5,
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toContain("weeksOrDays must be a non-negative number");
  });

  it("returns 400 for malformed JSON string payload", async () => {
    const req = new NextRequest("http://localhost:3000/api/triage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{ invalid json string",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toContain("malformed JSON");
  });
});
