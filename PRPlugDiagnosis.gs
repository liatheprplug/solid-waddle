/**
 * The PR Plug — Brand Diagnosis Pipeline
 * Google Apps Script (bound to your Google Sheet)
 *
 * ─── SETUP (do this once) ────────────────────────────────────────────────────
 *
 * STEP 1 — Add this script to your Sheet:
 *   Open your Google Sheet → Extensions → Apps Script → paste this entire file.
 *
 * STEP 2 — Store your Anthropic API key (never put it directly in code):
 *   In the Apps Script editor → Project Settings (gear icon) → Script Properties
 *   → Add row: Name = ANTHROPIC_API_KEY  |  Value = sk-ant-api03-...
 *
 * STEP 3 — Set up the Sheet columns:
 *   Run setupIntakeSheet() once from the editor (Run → Run function → setupIntakeSheet).
 *   This creates a tab called "Intake" with all the right column headers.
 *
 * STEP 4 — Choose how intake data gets into the sheet:
 *   OPTION A (Google Form): Create a Google Form, link it to this sheet, then set
 *     up a trigger: Triggers → Add Trigger → onFormSubmit → From spreadsheet → On form submit.
 *     Map your form questions to the columns in COLUMN_MAP below.
 *   OPTION B (Manual entry): Paste rows directly into the sheet, then call
 *     runDiagnosisForRow(2) from the editor (replace 2 with the actual row number).
 *   OPTION C (Batch): Call runDiagnosisForNewRows() to process all rows without a status.
 *
 * STEP 5 — Test it:
 *   Fill in row 2 of the Intake sheet, then run: runDiagnosisForRow(2)
 *   Columns 25–38 will fill in with the Brand Diagnosis within ~10 seconds.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── CONFIGURATION ───────────────────────────────────────────────────────────

const SHEET_NAME = "Intake";
const CLAUDE_MODEL = "claude-opus-4-6";

// Column positions (1-indexed). Edit these if your sheet column order differs.
const COL = {
  // INPUT — columns 1–24
  TIMESTAMP:            1,
  NAME:                 2,
  TITLE:                3,
  COMPANY:              4,
  INDUSTRY:             5,
  WEBSITE:              6,
  LINKEDIN:             7,
  BRAND_STAGE:          8,
  BRAND_DESC:           9,
  AUDIENCE_DESC:        10,
  CURRENT_MARKETING:    11,  // comma-separated list
  PRIMARY_GOAL:         12,
  TIMELINE:             13,
  SUCCESS_METRIC:       14,
  REVENUE_GOAL:         15,
  BIGGEST_GAPS:         16,  // comma-separated list
  MESSAGING_CLARITY:    17,  // 1–10
  CONTENT_CONSISTENCY:  18,  // 1–10
  VISIBILITY_SCORE:     19,  // 1–10
  BUDGET:               20,
  DECISION_MAKER:       21,
  URGENCY:              22,
  REFERRAL:             23,
  ADDITIONAL_CONTEXT:   24,

  // OUTPUT — columns 25–38 (written by this script)
  STATUS:               25,  // "processing…" | "done" | "error: ..."
  SIGNAL:               26,
  PATTERN:              27,
  GAP1_LABEL:           28,
  GAP1_DESC:            29,
  GAP2_LABEL:           30,
  GAP2_DESC:            31,
  GAP3_LABEL:           32,
  GAP3_DESC:            33,
  READINESS:            34,  // "hot" | "warm" | "cold"
  READINESS_NOTE:       35,
  RECOMMENDATION:       36,
  CLOSER:               37,
  DIAGNOSIS_TIMESTAMP:  38,
};

// ─── TRIGGERS ────────────────────────────────────────────────────────────────

/**
 * Attach this to "On form submit" in Triggers to auto-run diagnosis
 * whenever a new Google Form response lands in the sheet.
 */
function onFormSubmit(e) {
  const row = e.range.getRow();
  runDiagnosisForRow(row);
}

/**
 * Run diagnosis for a single row. Call this manually from the editor.
 * Example: runDiagnosisForRow(2)
 */
function runDiagnosisForRow(rowNumber) {
  const sheet = _getSheet();
  _processRow(sheet, rowNumber);
}

/**
 * Process every row that doesn't have a STATUS value yet.
 * Useful for backfilling existing intake rows in bulk.
 */
function runDiagnosisForNewRows() {
  const sheet = _getSheet();
  const lastRow = sheet.getLastRow();

  for (let row = 2; row <= lastRow; row++) {
    const status = sheet.getRange(row, COL.STATUS).getValue();
    if (!status) {
      _processRow(sheet, row);
    }
  }
}

// ─── CORE LOGIC ──────────────────────────────────────────────────────────────

function _processRow(sheet, row) {
  sheet.getRange(row, COL.STATUS).setValue("processing…");
  SpreadsheetApp.flush();

  try {
    const intake = _readRow(sheet, row);
    const diagnosis = _callClaude(intake);
    _writeResults(sheet, row, diagnosis);
    sheet.getRange(row, COL.STATUS).setValue("done");
    sheet.getRange(row, COL.DIAGNOSIS_TIMESTAMP).setValue(new Date());
  } catch (err) {
    sheet.getRange(row, COL.STATUS).setValue("error: " + err.message);
    console.error("Row " + row + " diagnosis failed:", err);
  }

  SpreadsheetApp.flush();
}

function _readRow(sheet, row) {
  const get = (col) => {
    const v = sheet.getRange(row, col).getValue();
    return (v === null || v === undefined) ? "" : String(v).trim();
  };

  return {
    name:               get(COL.NAME),
    title:              get(COL.TITLE),
    company:            get(COL.COMPANY),
    industry:           get(COL.INDUSTRY),
    website:            get(COL.WEBSITE),
    linkedin:           get(COL.LINKEDIN),
    brandStage:         get(COL.BRAND_STAGE),
    brandDesc:          get(COL.BRAND_DESC),
    audienceDesc:       get(COL.AUDIENCE_DESC),
    currentMarketing:   get(COL.CURRENT_MARKETING),
    primaryGoal:        get(COL.PRIMARY_GOAL),
    timeline:           get(COL.TIMELINE),
    successMetric:      get(COL.SUCCESS_METRIC),
    revenueGoal:        get(COL.REVENUE_GOAL),
    biggestGaps:        get(COL.BIGGEST_GAPS),
    messagingClarity:   get(COL.MESSAGING_CLARITY),
    contentConsistency: get(COL.CONTENT_CONSISTENCY),
    visibilityScore:    get(COL.VISIBILITY_SCORE),
    budget:             get(COL.BUDGET),
    decisionMaker:      get(COL.DECISION_MAKER),
    urgency:            get(COL.URGENCY),
    referral:           get(COL.REFERRAL),
    additionalContext:  get(COL.ADDITIONAL_CONTEXT),
  };
}

function _callClaude(d) {
  const apiKey = PropertiesService.getScriptProperties().getProperty("ANTHROPIC_API_KEY");
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not set. Go to Project Settings → Script Properties and add it.");
  }

  const payload = JSON.stringify({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    messages: [{ role: "user", content: _buildPrompt(d) }],
  });

  const response = UrlFetchApp.fetch("https://api.anthropic.com/v1/messages", {
    method: "post",
    contentType: "application/json",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    payload: payload,
    muteHttpExceptions: true,
  });

  const statusCode = response.getResponseCode();
  const body = response.getContentText();

  if (statusCode !== 200) {
    throw new Error("Claude API returned " + statusCode + ": " + body);
  }

  const result = JSON.parse(body);
  const rawText = ((result.content || []).find(b => b.type === "text") || {}).text || "";
  const cleaned = rawText.replace(/```json|```/g, "").trim();

  let diagnosis;
  try {
    diagnosis = JSON.parse(cleaned);
  } catch (_) {
    throw new Error("Could not parse Claude response as JSON. Got: " + cleaned.slice(0, 300));
  }

  // Validate all expected fields are present
  const required = ["signal", "pattern", "gaps", "readiness", "readinessNote", "recommendation", "closer"];
  const missing = required.filter(k => !(k in diagnosis));
  if (missing.length > 0) {
    throw new Error("Diagnosis missing required fields: " + missing.join(", "));
  }

  return diagnosis;
}

function _writeResults(sheet, row, d) {
  const gaps = Array.isArray(d.gaps) ? d.gaps : [];
  const set = (col, val) => sheet.getRange(row, col).setValue(val != null ? val : "");

  set(COL.SIGNAL,          d.signal);
  set(COL.PATTERN,         d.pattern);
  set(COL.GAP1_LABEL,      (gaps[0] || {}).label       || "");
  set(COL.GAP1_DESC,       (gaps[0] || {}).description || "");
  set(COL.GAP2_LABEL,      (gaps[1] || {}).label       || "");
  set(COL.GAP2_DESC,       (gaps[1] || {}).description || "");
  set(COL.GAP3_LABEL,      (gaps[2] || {}).label       || "");
  set(COL.GAP3_DESC,       (gaps[2] || {}).description || "");
  set(COL.READINESS,       d.readiness);
  set(COL.READINESS_NOTE,  d.readinessNote);
  set(COL.RECOMMENDATION,  d.recommendation);
  set(COL.CLOSER,          d.closer);
}

// ─── PROMPT ──────────────────────────────────────────────────────────────────

function _buildPrompt(d) {
  return (
    "You are Lia, founder of The PR Plug Consulting Collective — a brand architect with 16 years in integrated communications. " +
    "You install operating systems that make brands work. Zero fluff. Every observation must be backed by specific client data.\n\n" +
    "Use your I²OS diagnostic lens: information gaps, leadership messaging gaps, tool/systems issues, messaging infrastructure misalignment.\n\n" +
    "CLIENT DATA:\n" +
    "Name: " + d.name + " | Title: " + d.title + " | Company: " + d.company + " | Industry: " + d.industry + "\n" +
    "Website: " + (d.website || "Not provided") + " | Brand Stage: " + d.brandStage + "\n" +
    "Brand Description: " + (d.brandDesc || "Not provided") + "\n" +
    "Audience: " + d.audienceDesc + "\n" +
    "Current Marketing: " + (d.currentMarketing || "None") + "\n" +
    "Primary Goal: " + d.primaryGoal + " | Timeline: " + d.timeline + "\n" +
    "Success Metric: " + (d.successMetric || "Not defined") + " | Revenue Goal: " + (d.revenueGoal || "Not provided") + "\n" +
    "Gaps Identified: " + (d.biggestGaps || "Not specified") + "\n" +
    "Messaging Clarity: " + d.messagingClarity + "/10 | Content Consistency: " + d.contentConsistency + "/10 | Visibility: " + d.visibilityScore + "/10\n" +
    "Budget: " + d.budget + " | Decision Maker: " + d.decisionMaker + " | Urgency: " + d.urgency + "\n" +
    "Referral: " + (d.referral || "Not specified") + " | Additional: " + (d.additionalContext || "None") + "\n\n" +
    'Return ONLY valid JSON, no markdown fences:\n' +
    '{"signal":"One sentence — what the market actually hears from their brand right now.",' +
    '"pattern":"The systemic issue underneath all their surface symptoms.",' +
    '"gaps":[' +
      '{"label":"Gap name 3-5 words","description":"One sharp sentence naming the fracture and the cost."},' +
      '{"label":"Gap name","description":"One sharp sentence."},' +
      '{"label":"Gap name","description":"One sharp sentence."}' +
    '],' +
    '"readiness":"hot | warm | cold",' +
    '"readinessNote":"One sentence on readiness based on budget + urgency + decision authority.",' +
    '"recommendation":"2-3 sentences on the precise next move, specific to their industry.",' +
    '"closer":"One memorable signature line crafted personally for this client."}'
  );
}

// ─── SHEET SETUP HELPER ──────────────────────────────────────────────────────

/**
 * One-time setup: scaffolds the Intake sheet with all column headers and styling.
 * Run this once from the Apps Script editor: Run → Run function → setupIntakeSheet
 */
function setupIntakeSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  const headers = [
    // Input columns (1–24)
    "Timestamp", "Name", "Title / Role", "Company / Brand", "Industry",
    "Website", "LinkedIn", "Brand Stage", "Brand Description",
    "Audience Description", "Current Marketing (comma-sep)", "Primary Goal",
    "Timeline", "Success Metric", "Revenue Goal", "Biggest Gaps (comma-sep)",
    "Messaging Clarity (1-10)", "Content Consistency (1-10)", "Visibility Score (1-10)",
    "Budget", "Decision Maker", "Urgency", "Referral", "Additional Context",
    // Output columns (25–38)
    "Diagnosis Status",
    "Brand Signal", "Core Pattern",
    "Gap 1 Label", "Gap 1 Description",
    "Gap 2 Label", "Gap 2 Description",
    "Gap 3 Label", "Gap 3 Description",
    "Readiness", "Readiness Note",
    "Recommendation", "Closer",
    "Diagnosis Timestamp",
  ];

  // Write headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Style input header columns (1–24)
  sheet.getRange(1, 1, 1, 24)
    .setBackground("#0A0A0A")
    .setFontColor("#C9A84C")
    .setFontWeight("bold")
    .setFontFamily("Arial")
    .setFontSize(9);

  // Style output header columns (25–38)
  sheet.getRange(1, 25, 1, headers.length - 24)
    .setBackground("#1A1814")
    .setFontColor("#E8D5A3")
    .setFontWeight("bold")
    .setFontFamily("Arial")
    .setFontSize(9);

  // Freeze the header row
  sheet.setFrozenRows(1);

  // Auto-resize all columns
  sheet.autoResizeColumns(1, headers.length);

  SpreadsheetApp.flush();

  Browser.msgBox(
    "Done! The Intake sheet is ready.\n\n" +
    "Next: Go to Project Settings → Script Properties and add:\n" +
    "  Name:  ANTHROPIC_API_KEY\n" +
    "  Value: sk-ant-api03-...\n\n" +
    "Then fill in row 2 and run runDiagnosisForRow(2) to test."
  );
}

// ─── HELPER ──────────────────────────────────────────────────────────────────

function _getSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    throw new Error(
      'Sheet "' + SHEET_NAME + '" not found. Run setupIntakeSheet() first.'
    );
  }
  return sheet;
}
