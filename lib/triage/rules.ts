// lib/triage/rules.ts
// Deterministic Clinical Triage Rules for Kalcare.
// Source: research/clinical_evidence.md (Person C Clinical Evidence Registry)
// Safety principle: Pure deterministic logic. No LLM, no external I/O.

import {
  EvidenceReference,
  PatientStage,
  SymptomInput,
  Urgency,
} from "../contracts/triage";

export interface TriageRule {
  id: string;
  name: string;
  stage: PatientStage | PatientStage[];
  matches: (input: SymptomInput) => boolean;
  urgency: Urgency;
  reason: string;
  nextAction: string;
  evidence: EvidenceReference[];
  amharicReason?: string;
  amharicNextAction?: string;
}

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

function containsAny(text: string, keywords: string[]): boolean {
  const norm = normalize(text);
  return keywords.some((kw) => norm.includes(normalize(kw)));
}

function stageMatches(ruleStage: PatientStage | PatientStage[], patientStage: PatientStage): boolean {
  if (Array.isArray(ruleStage)) {
    return ruleStage.includes(patientStage);
  }
  return ruleStage === patientStage;
}

// ---------------------------------------------------------------------------
// RULE 1: RULE_PREECLAMPSIA
// Severe headache, visual disturbance, facial swelling during pregnancy
// Urgency: SEEK_CARE_NOW
// Source: WHO IMPAC MCPC Sec 2; FMOH Guideline #1
// ---------------------------------------------------------------------------
export const RULE_PREECLAMPSIA: TriageRule = {
  id: "RULE_PREECLAMPSIA",
  name: "Preeclampsia / Eclampsia Danger Signs",
  stage: "PREGNANT",
  matches: (input: SymptomInput) => {
    if (!stageMatches("PREGNANT", input.stage)) return false;
    const keywords = [
      "severe headache",
      "headache",
      "blurred vision",
      "blurry vision",
      "visual disturbance",
      "visual disturbances",
      "facial swelling",
      "face swelling",
      "preeclampsia",
      "eclampsia",
      "epigastric pain",
      "convulsion",
      "seizure",
      "ከፍተኛ ራስ ምታት",
      "ራስ ምታት",
      "የእይታ ብዥታ",
      "የፊት እብጠት",
      "መንቀጥቀጥ",
    ];
    return containsAny(input.symptom, keywords);
  },
  urgency: "SEEK_CARE_NOW",
  reason:
    "Severe headache, visual disturbances, or facial swelling during pregnancy can indicate preeclampsia or eclampsia, a life-threatening hypertensive emergency.",
  nextAction:
    "Seek immediate emergency obstetric care at the nearest hospital or health center without delay.",
  evidence: [
    {
      source: "World Health Organization (WHO) — IMPAC MCPC",
      version: "2023",
      reference: "Section 2: Managing Complications in Pregnancy and Childbirth - Preeclampsia/Eclampsia",
    },
    {
      source: "Ethiopian Federal Ministry of Health (FMOH)",
      version: "2021/2022",
      reference: "Community Maternal & Newborn Danger Signs Guidelines, Guideline #1",
    },
  ],
  amharicReason:
    "ምልክቶቹ ፕሪኤክላምፕሺያ ወይም ኤክላምፕሺያ ሊያሳዩ ይችላሉ — ከፍተኛ ራስ ምታት፣ የእይታ ብዥታ ወይም የፊት እብጠት ለሕይወት አስጊ የደም ግፊት ችግር ሊሆን ይችላል።",
  amharicNextAction:
    "ወዲያውኑ ወደ ቅርብ ጤና ጣቢያ ወይም ሆስፒታል ለድንገተኛ የወሊድ ህክምና ሂዱ። አትዘግዩ።",
};

// ---------------------------------------------------------------------------
// RULE 2: RULE_BLEEDING
// Vaginal bleeding in pregnancy or postpartum
// Urgency: SEEK_CARE_NOW
// Source: WHO PCPNC Guide Sec B2; FMOH Obstetric Hemorrhage Protocol
// ---------------------------------------------------------------------------
export const RULE_BLEEDING: TriageRule = {
  id: "RULE_BLEEDING",
  name: "Obstetric Hemorrhage / Vaginal Bleeding",
  stage: ["PREGNANT", "POSTPARTUM"],
  matches: (input: SymptomInput) => {
    if (!stageMatches(["PREGNANT", "POSTPARTUM"], input.stage)) return false;
    const keywords = [
      "bleeding",
      "blood",
      "hemorrhage",
      "haemorrhage",
      "bleed",
      "vaginal bleeding",
      "heavy bleeding",
      "spotting",
      "ደም መፍሰስ",
      "ከባድ ደም",
      "ደም",
    ];
    return containsAny(input.symptom, keywords);
  },
  urgency: "SEEK_CARE_NOW",
  reason:
    "Vaginal bleeding during pregnancy or postpartum indicates potential obstetric hemorrhage, which can rapidly become life-threatening.",
  nextAction:
    "Go immediately to the nearest emergency health facility or hospital without delay.",
  evidence: [
    {
      source: "World Health Organization (WHO) — PCPNC Guide",
      version: "2022",
      reference: "Section B2: Vaginal Bleeding in Pregnancy and Postpartum Hemorrhage",
    },
    {
      source: "Ethiopian Federal Ministry of Health (FMOH)",
      version: "2021/2022",
      reference: "Obstetric Hemorrhage Protocol",
    },
  ],
  amharicReason:
    "በእርግዝና ወቅት ወይም ከወሊድ በኋላ የሚከሰት የደም መፍሰስ ለሕይወት አስጊ የሆነ የደም መፍሰስ ችግር ሊሆን ይችላል።",
  amharicNextAction:
    "ያለምንም መዘግየት ወዲያውኑ ወደ ቅርብ የድንገተኛ ጤና ተቋም ወይም ሆስፒታል ሂዱ።",
};

// ---------------------------------------------------------------------------
// RULE 3: RULE_FEVER
// High fever (>38°C) or severe chills (PREGNANT, POSTPARTUM, or NEWBORN)
// Urgency: SEEK_CARE_NOW
// Source: WHO Sepsis Protocol; FMOH Infection Control Guide
// ---------------------------------------------------------------------------
export const RULE_FEVER: TriageRule = {
  id: "RULE_FEVER",
  name: "High Fever / Suspected Sepsis",
  stage: ["PREGNANT", "POSTPARTUM", "NEWBORN"],
  matches: (input: SymptomInput) => {
    if (!stageMatches(["PREGNANT", "POSTPARTUM", "NEWBORN"], input.stage)) return false;
    const keywords = [
      "fever",
      "high temperature",
      "temperature",
      "chills",
      "shivering",
      "hot body",
      "burning up",
      "sepsis",
      "ትኩሳት",
      "ከፍተኛ ትኩሳት",
      "ቅዝቃዜ",
      "ብርድ ብርድ",
    ];
    return containsAny(input.symptom, keywords);
  },
  urgency: "SEEK_CARE_NOW",
  reason:
    "High fever (>38°C) or severe chills indicates possible puerperal, maternal, or neonatal sepsis, which requires prompt antimicrobial and inpatient care.",
  nextAction:
    "Seek immediate medical care at the nearest health center or hospital.",
  evidence: [
    {
      source: "World Health Organization (WHO) — Sepsis Protocol",
      version: "2022",
      reference: "Maternal and Neonatal Sepsis Recognition and Early Management",
    },
    {
      source: "Ethiopian Federal Ministry of Health (FMOH)",
      version: "2021/2022",
      reference: "Infection Control Guide - Maternal and Neonatal Danger Signs",
    },
  ],
  amharicReason:
    "ከፍተኛ ትኩሳት ወይም ብርድ ብርድ ማለት በእናት ወይም በአዲስ ተወላጅ ላይ ለሕይወት አስጊ የሆነ ኢንፌክሽን (ሴፕሲስ) ሊያመለክት ይችላል።",
  amharicNextAction:
    "ወዲያውኑ ወደ ቅርብ ጤና ጣቢያ ወይም ሆስፒታል ለህክምና ምርመራ ሂዱ።",
};

// ---------------------------------------------------------------------------
// RULE 4: RULE_ABDOMINAL_PAIN
// Severe abdominal pain or uterine tenderness in pregnancy
// Urgency: SEEK_CARE_NOW
// Source: WHO IMPAC Sec 3 Abdominal Assessment
// ---------------------------------------------------------------------------
export const RULE_ABDOMINAL_PAIN: TriageRule = {
  id: "RULE_ABDOMINAL_PAIN",
  name: "Severe Abdominal Pain / Uterine Tenderness",
  stage: "PREGNANT",
  matches: (input: SymptomInput) => {
    if (!stageMatches("PREGNANT", input.stage)) return false;
    const keywords = [
      "abdominal pain",
      "belly pain",
      "stomach pain",
      "tummy pain",
      "uterine pain",
      "uterine tenderness",
      "abdomen",
      "pelvic pain",
      "severe pain",
      "የሆድ ህመም",
      "ከባድ የሆድ ህመም",
      "የማህፀን ህመም",
    ];
    return containsAny(input.symptom, keywords);
  },
  urgency: "SEEK_CARE_NOW",
  reason:
    "Severe abdominal pain or uterine tenderness during pregnancy may signal placental abruption, uterine rupture, or ectopic pregnancy.",
  nextAction:
    "Go immediately to an emergency maternity unit or hospital.",
  evidence: [
    {
      source: "World Health Organization (WHO) — IMPAC",
      version: "2023",
      reference: "Section 3: Abdominal Assessment and Acute Abdomen in Pregnancy",
    },
  ],
  amharicReason:
    "በእርግዝና ወቅት ከባድ የሆድ ህመም ወይም የማህፀን ህመም የእንግዴ ልጅ መላቀቅን ወይም ሌላ አስቸኳይ የወሊድ ችግርን ሊያመለክት ይችላል።",
  amharicNextAction:
    "ወዲያውኑ ለድንገተኛ ምርመራ ወደ ወሊድ ክፍል ወይም ሆስፒታል ሂዱ።",
};

// ---------------------------------------------------------------------------
// RULE 5: RULE_FETAL_MOVEMENT
// Decreased or absent fetal movement in late pregnancy (>28 weeks)
// Urgency: SEEK_CARE_NOW
// Source: FMOH Antenatal Care Fetal Wellbeing Protocol
// ---------------------------------------------------------------------------
export const RULE_FETAL_MOVEMENT: TriageRule = {
  id: "RULE_FETAL_MOVEMENT",
  name: "Decreased / Absent Fetal Movement",
  stage: "PREGNANT",
  matches: (input: SymptomInput) => {
    if (!stageMatches("PREGNANT", input.stage)) return false;
    const keywords = [
      "fetal movement",
      "baby movement",
      "baby not moving",
      "stopped moving",
      "no movement",
      "less movement",
      "decreased movement",
      "baby kicks",
      "no kicks",
      "reduced kicks",
      "የፅንስ እንቅስቃሴ",
      "የፅንስ እንቅስቃሴ መቀነስ",
      "አይንቀሳቀስም",
      "እንቅስቃሴ አቆመ",
    ];
    if (!containsAny(input.symptom, keywords)) return false;
    // Relevant for pregnancy; if gestation age is provided, apply particularly to late pregnancy (>=28 weeks)
    if (input.weeksOrDays !== undefined && input.weeksOrDays < 28) {
      return false;
    }
    return true;
  },
  urgency: "SEEK_CARE_NOW",
  reason:
    "Decreased or absent fetal movements after 28 weeks of gestation indicates possible acute fetal distress or compromise.",
  nextAction:
    "Go to a health center or maternity ward immediately for urgent fetal heart rate and wellbeing evaluation.",
  evidence: [
    {
      source: "Ethiopian Federal Ministry of Health (FMOH)",
      version: "2021/2022",
      reference: "Antenatal Care Fetal Wellbeing Protocol - Fetal Movement Monitoring (>28 Weeks)",
    },
  ],
  amharicReason:
    "ከ28 ሳምንት በኋላ የፅንስ እንቅስቃሴ መቀነስ ወይም መቆም የፅንስ ጭንቀት ወይም አደጋ ሊያሳይ ስለሚችል አፋጣኝ ክትትል ያስፈልገዋል።",
  amharicNextAction:
    "የፅንሱን የልብ ምት እና ደህንነት ለማረጋገጥ ወዲያውኑ ወደ ጤና ጣቢያ ወይም የወሊድ ክፍል ሂዱ። አትጠብቁ።",
};

// ---------------------------------------------------------------------------
// RULE 6: RULE_NEWBORN_DANGER
// Jaundice, lethargy, refusal to feed in newborn
// Urgency: SEEK_CARE_NOW
// Source: WHO IMCI Young Infant Guidelines
// ---------------------------------------------------------------------------
export const RULE_NEWBORN_DANGER: TriageRule = {
  id: "RULE_NEWBORN_DANGER",
  name: "Newborn Danger Signs (Jaundice / Lethargy / Feeding Refusal)",
  stage: "NEWBORN",
  matches: (input: SymptomInput) => {
    if (!stageMatches("NEWBORN", input.stage)) return false;
    const keywords = [
      "jaundice",
      "yellow skin",
      "yellow eyes",
      "yellowing",
      "yellow",
      "lethargy",
      "lethargic",
      "limp",
      "unresponsive",
      "not feeding",
      "refusal to feed",
      "refusing to feed",
      "won't feed",
      "poor feeding",
      "cannot suck",
      "not drinking",
      "ቢጫ ቆዳ",
      "ቢጫ አይን",
      "ቢጫ",
      "ደካማ",
      "አይጠባም",
      "ጡት አለመጥባት",
      "ጡት አይጠባም",
    ];
    return containsAny(input.symptom, keywords);
  },
  urgency: "SEEK_CARE_NOW",
  reason:
    "Jaundice, lethargy, or refusal to feed in a newborn are critical danger signs indicating severe neonatal illness, hyperbilirubinemia, or sepsis.",
  nextAction:
    "Take the newborn to the nearest health center or pediatric emergency facility immediately.",
  evidence: [
    {
      source: "World Health Organization (WHO) — IMCI",
      version: "2022",
      reference: "Integrated Management of Childhood Illness: Young Infant Danger Signs (0-2 Months)",
    },
  ],
  amharicReason:
    "በአዲስ ተወላጅ ህፃን ላይ ቢጫ ቆዳ፣ ከባድ ድካም ወይም ጡት አለመጥባት ለሕይወት አስጊ የሆኑ የህፃናት አደገኛ ምልክቶች ናቸው።",
  amharicNextAction:
    "ህፃኑን ወዲያውኑ ወደ ቅርብ ጤና ጣቢያ ወይም የህፃናት ድንገተኛ ህክምና ክፍል ይውሰዱ።",
};

// ---------------------------------------------------------------------------
// RULE 7: RULE_MILD_SYMPTOMS
// Mild nausea, mild ankle swelling without headache in pregnancy
// Urgency: MONITOR
// Source: FMOH Community Health Extension Worker Manual
// ---------------------------------------------------------------------------
export const RULE_MILD_SYMPTOMS: TriageRule = {
  id: "RULE_MILD_SYMPTOMS",
  name: "Mild Common Pregnancy Discomfort",
  stage: "PREGNANT",
  matches: (input: SymptomInput) => {
    if (!stageMatches("PREGNANT", input.stage)) return false;
    // Explicitly reject if severity is SEVERE
    if (input.severity === "SEVERE") return false;

    // Reject if danger signs co-occur in the symptom string
    const exclusionKeywords = [
      "severe headache",
      "headache",
      "vision",
      "bleeding",
      "blood",
      "fever",
      "chills",
      "fetal",
      "movement",
      "ከፍተኛ ራስ ምታት",
      "ራስ ምታት",
      "ደም",
      "ትኩሳት",
    ];
    if (containsAny(input.symptom, exclusionKeywords)) return false;

    const mildKeywords = [
      "nausea",
      "morning sickness",
      "mild nausea",
      "mild ankle swelling",
      "ankle swelling",
      "swollen feet",
      "mild swelling",
      "fatigue",
      "tiredness",
      "dizziness",
      "ማቅለሽለሽ",
      "የእግር እብጠት",
      "የቁርጭምጭሚት እብጠት",
      "ቀላል ድካም",
    ];
    return containsAny(input.symptom, mildKeywords);
  },
  urgency: "MONITOR",
  reason:
    "Mild nausea (morning sickness) or isolated mild ankle swelling without headache or hypertension are common physiological discomforts of pregnancy.",
  nextAction:
    "Monitor symptoms at home. Rest with feet elevated, stay hydrated, and report any worsening or new danger signs to your Health Extension Worker.",
  evidence: [
    {
      source: "Ethiopian Federal Ministry of Health (FMOH)",
      version: "2021/2022",
      reference: "Community Health Extension Worker Manual - Common Physiological Discomforts of Pregnancy",
    },
  ],
  amharicReason:
    "ቀላል ማቅለሽለሽ ወይም ያለ ራስ ምታት የሚከሰት የእግር እብጠት በእርግዝና ወቅት የሚታዩ የተለመዱ የሰውነት ለውጦች ናቸው።",
  amharicNextAction:
    "ምልክቶቹን በቤት ውስጥ ይከታተሉ። እረፍት ያድርጉ፣ ፈሳሽ በደንብ ይውሰዱ። ምልክቶቹ ከተባባሱ የጤና ኤክስቴንሽን ሰራተኛዎን ያነጋግሩ።",
};

// ---------------------------------------------------------------------------
// Frozen 7-rule set from Person C's clinical research
// Evaluated deterministically in priority order
// ---------------------------------------------------------------------------
export const TRIAGE_RULES: TriageRule[] = [
  RULE_PREECLAMPSIA,
  RULE_BLEEDING,
  RULE_FEVER,
  RULE_ABDOMINAL_PAIN,
  RULE_FETAL_MOVEMENT,
  RULE_NEWBORN_DANGER,
  RULE_MILD_SYMPTOMS,
];
