/**
 * PROFITBRAND — ChatGPT Ads lead receiver
 * Appends each landing-page application as a row in the "gpt ads" Google Sheet.
 *
 * DEPLOY (one time, ~2 minutes):
 *  1. Open the sheet: https://docs.google.com/spreadsheets/d/1v0mQ2F8meOj5cKoYSdmQg-quaaZVuVS9Fm4XD0LGIl0/edit
 *  2. Extensions -> Apps Script. Delete the sample code, paste this whole file, save (Ctrl/Cmd+S).
 *  3. Deploy -> New deployment -> type "Web app".
 *     Execute as: Me. Who has access: Anyone. Click Deploy.
 *  4. Authorize when asked (Google shows "unverified app" -> Advanced -> Go to project).
 *  5. Copy the Web app URL (ends with /exec) and paste it into SHEET_ENDPOINT in src/lib/leads.js.
 *  After editing this script later: Deploy -> Manage deployments -> edit -> New version -> Deploy.
 */

var SHEET_NAME = "Лист1";
var HEADERS = ["Дата", "Име", "Имейл", "Телефон", "Сайт", "Какво продава", "Бюджет / месец", "Стойност на клиент", "Вердикт", "Източник"];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    }
    sheet.appendRow([
      data.date || new Date().toISOString(),
      data.name || "",
      data.email || "",
      data.phone || "",
      data.website || "",
      data.sells || "",
      data.budget || "",
      data.clientValue || "",
      data.verdict || "",
      data.source || "",
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Optional: open the /exec URL in a browser to check the deployment is alive.
function doGet() {
  return ContentService.createTextOutput("PROFITBRAND lead receiver OK");
}
