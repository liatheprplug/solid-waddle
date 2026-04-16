/**
 * The PR Plug — LinkedIn Audit Pipeline × Claude API
 *
 * SETUP (one time only):
 * 1. Paste this entire script into Extensions → Apps Script → replace everything.
 * 2. Click the gear icon (Project Settings) → Script Properties → Add property:
 *      Name:  ANTHROPIC_API_KEY
 *      Value: sk-ant-api03-...
 * 3. Check that SHEET_NAME below matches the tab name at the bottom of your sheet.
 *    (Right-click the tab to see/rename it.)
 * 4. Click Save (disk icon), then run: runDiagnosisForRow(4)
 *    → Columns L–R on row 4 will fill in automatically.
 * 5. To fill all empty rows at once: run runDiagnosisForNewRows()
 */

// ─── CONFIGURATION ─────────────────────────────────────────────────────────

// The tab name at the bottom of your Google Sheet
const SHEET_NAME = "LinkedIn Audit Pipeline";

const CLAUDE_MODEL = "claude-opus-4-6";
const HEADER_ROW   = 3;  // Row 3 has column labels
const DATA_START   = 4;  // Lead data starts at row 4

// Column positions (1 = A, 2 = B, etc.)
const COL = {
  // INPUT — what you fill in
  DATE:             1,   // A
  NAME:             2,   // B
  TITLE:            3,   // C
  COMPANY:          4,   // D
  INDUSTRY:         5,   // E
  OVERALL_SCORE:    6,   // F
  EXEC_SCORE:       7,   // G
  MESSAGING_SCORE:  8,   // H
  AUDIENCE_SCORE:   9,   // I
  CONTENT_SCORE:    10,  // J
  VISIBILITY_SCORE: 11,  // K

  // OUTPUT — Claude writes these
  BRAND_SIGNAL:     12,  // L
  CORE_PATTERN:     13,  // M
  TOP_GAP:          14,  // N
  PACKAGE:          15,  // O
  EST_VALUE:        16,  // P
  READINESS:        17,  // Q
  NEXT_ACTION:      18,  // R
  STATUS:           19,  // S  (shows processing state — you can hide this column)
};

// ─── FUNCTIONS TO RUN ──────────────────────────────────────────────────────

/**
 * TEST: Select this from the dropdown and click Run.
 * Runs diagnosis on row 4 (your first lead).
 */
function runTestRow() {
  _processRow(_getSheet(), 4);
}

/**
 * Run diagnosis on a single row.
 * Change the number to whichever row you want to process.
 */
function runDiagnosisForRow(rowNumber) {
  _processRow(_getSheet(), rowNumber);
}

/**
 * Automatically process every row that has a name but no Brand Signal yet.
 * Safe to run multiple times — skips rows already diagnosed.
 */
function runDiagnosisForNewRows() {
  const sheet   = _getSheet();
  const lastRow = sheet.getLastRow();

  for (let row = DATA_START; row <= lastRow; row++) {
    const name   = sheet.getRange(row, COL.NAME).getValue();
    const signal = sheet.getRange(row, COL.BRAND_SIGNAL).getValue();
    if (name && !signal) {
      _processRow(sheet, row);
    }
  }
}

// ─── CORE LOGIC ────────────────────────────────────────────────────────────

function _processRow(sheet, row) {
  sheet.getRange(row, COL.STATUS).setValue("processing…");
  SpreadsheetApp.flush();

  try {
    const d      = _readRow(sheet, row);
    if (!d.name) throw new Error("No name found in row " + row);
    const result = _callClaude(d);
    _writeResults(sheet, row, result);
    sheet.getRange(row, COL.STATUS).setValue("done ✓");
  } catch (err) {
    sheet.getRange(row, COL.STATUS).setValue("error: " + err.message);
    console.error("Row " + row + " failed:", err.message);
  }

  SpreadsheetApp.flush();
}

function _readRow(sheet, row) {
  const v = (col) => {
    const val = sheet.getRange(row, col).getValue();
    return (val === null || val === undefined) ? "" : String(val).trim();
  };
  return {
    name:      v(COL.NAME),
    title:     v(COL.TITLE),
    company:   v(COL.COMPANY),
    industry:  v(COL.INDUSTRY),
    overall:   v(COL.OVERALL_SCORE),
    exec:      v(COL.EXEC_SCORE),
    messaging: v(COL.MESSAGING_SCORE),
    audience:  v(COL.AUDIENCE_SCORE),
    content:   v(COL.CONTENT_SCORE),
    visibility:v(COL.VISIBILITY_SCORE),
  };
}

function _callClaude(d) {
  const apiKey = PropertiesService.getScriptProperties().getProperty("ANTHROPIC_API_KEY");
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY missing. Add it in Project Settings → Script Properties.");
  }

  const response = UrlFetchApp.fetch("https://api.anthropic.com/v1/messages", {
    method:      "post",
    contentType: "application/json",
    headers: {
      "x-api-key":         apiKey,
      "anthropic-version": "2023-06-01",
    },
    payload: JSON.stringify({
      model:      CLAUDE_MODEL,
      max_tokens: 1024,
      messages:   [{ role: "user", content: _buildPrompt(d) }],
    }),
    muteHttpExceptions: true,
  });

  const code = response.getResponseCode();
  const body = response.getContentText();
  if (code !== 200) throw new Error("API returned " + code + ": " + body.slice(0, 300));

  const raw     = JSON.parse(body);
  const text    = ((raw.content || []).find(b => b.type === "text") || {}).text || "";
  const cleaned = text.replace(/```json|```/g, "").trim();

  let result;
  try {
    result = JSON.parse(cleaned);
  } catch (_) {
    throw new Error("Could not parse response: " + cleaned.slice(0, 200));
  }

  const required = ["signal", "pattern", "topGap", "package", "value", "readiness", "nextAction"];
  const missing  = required.filter(k => !(k in result));
  if (missing.length) throw new Error("Missing fields: " + missing.join(", "));

  return result;
}

function _writeResults(sheet, row, r) {
  const set = (col, val) => sheet.getRange(row, col).setValue(val || "");
  set(COL.BRAND_SIGNAL, r.signal);
  set(COL.CORE_PATTERN, r.pattern);
  set(COL.TOP_GAP,      r.topGap);
  set(COL.PACKAGE,      r.package);
  set(COL.EST_VALUE,    r.value);
  set(COL.READINESS,    r.readiness);
  set(COL.NEXT_ACTION,  r.nextAction);
}

// ─── PROMPT ────────────────────────────────────────────────────────────────

function _buildPrompt(d) {
  return (
    "You are Lia, founder of The PR Plug Consulting Collective — 16 years in integrated communications. " +
    "You specialize in LinkedIn executive positioning. You just audited this lead's LinkedIn profile " +
    "and scored it. Now write their diagnosis in your voice: sharp, specific, no fluff.\n\n" +

    "LEAD:\n" +
    "Name: " + d.name + "  |  Title: " + d.title + "  |  Company: " + d.company + "  |  Industry: " + d.industry + "\n" +
    "Overall Score: " + d.overall + " / 50\n" +
    "Exec: " + d.exec + "/10  |  Messaging: " + d.messaging + "/10  |  Audience: " + d.audience +
    "/10  |  Content: " + d.content + "/10  |  Visibility: " + d.visibility + "/10\n\n" +

    "SCORE DEFINITIONS:\n" +
    "Exec = authority and personal brand presence on LinkedIn\n" +
    "Messaging = clarity and differentiation of their value proposition\n" +
    "Audience = engagement quality and relevance to target market\n" +
    "Content = strategic output — consistency, depth, positioning\n" +
    "Visibility = platform discoverability via keywords and LinkedIn signals\n\n" +

    "PACKAGES (use these labels and ranges exactly):\n" +
    "Signal Package  →  $3,500–$5,000       →  scores 10–20  (foundational infrastructure)\n" +
    "System Package  →  $4,000–$6,500/mo    →  scores 21–34  (strategic rebuild with systems)\n" +
    "Scale Package   →  $6,500–$10,000/mo   →  scores 35–50  (authority amplification + IP development)\n\n" +

    "READINESS:  hot = 35–50  |  warm = 21–34  |  cold = 10–20\n\n" +

    "Return ONLY valid JSON, no markdown:\n" +
    '{"signal":"One punchy sentence — what their LinkedIn is actually telling the market right now.",' +
    '"pattern":"1-2 sentences naming the systemic pattern under their scores.",' +
    '"topGap":"[Short label 3-5 words] — [One sentence on what is missing and what it costs them].",' +
    '"package":"Signal Package | System Package | Scale Package",' +
    '"value":"exact price string matching the tier e.g. $3,500\u20135,000 or $4,000\u20136,500/mo",' +
    '"readiness":"hot | warm | cold",' +
    '"nextAction":"Specific one-liner e.g. Send LinkedIn DM \u2014 follow up in 5 days"}'
  );
}

// ─── HELPER ────────────────────────────────────────────────────────────────

function _getSheet() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Sheet "' + SHEET_NAME + '" not found. Check SHEET_NAME at the top of this script.');
  return sheet;
}
