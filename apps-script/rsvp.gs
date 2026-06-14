/**
 * Wedding RSVP backend — Google Apps Script.
 * Saves each RSVP to the bound Google Sheet AND emails the guest a confirmation.
 *
 * ── ONE-TIME SETUP ──────────────────────────────────────────────────────────
 * 1. Create a Google Sheet (e.g. "Wedding RSVPs"). Do this from the Google
 *    account you want the emails to be SENT FROM (ideally a yen-yang.com
 *    Workspace account, otherwise your personal Gmail).
 * 2. In the Sheet: Extensions → Apps Script. Delete the default code, paste
 *    THIS entire file, and Save.
 * 3. Edit the CONFIG block below (your notify email + optional from alias).
 * 4. Deploy → New deployment → gear icon → "Web app":
 *        Execute as:      Me
 *        Who has access:  Anyone
 *    Click Deploy, authorise the permissions it asks for, then copy the
 *    "Web app URL" (it ends in /exec).
 * 5. Paste that URL into enhance.js as RSVP_ENDPOINT.
 *
 * When you change this script later: Deploy → Manage deployments → edit (pencil)
 * → Version: "New version" → Deploy. (The URL stays the same.)
 * ────────────────────────────────────────────────────────────────────────────
 */

var CONFIG = {
  // Where YOU get notified of each new RSVP:
  notifyEmail: "yangweilim21@gmail.com",
  // Name guests see as the sender:
  fromName: "Yen & Yang Wei",
  // Optional: a verified "Send mail as" alias in your Gmail (e.g. "hello@yen-yang.com").
  // Leave "" to send from the account's own address. If you set this to an address
  // that isn't a verified alias, sending will fail.
  fromAlias: ""
};

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // avoid two submissions writing the same row
  try {
    var p = (e && e.parameter) || {};
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Collect the guest list: "Guest 1", "Guest 2", ... with matching "Guest N dietary".
    var guests = [];
    for (var i = 1; i <= 20; i++) {
      var name = p["Guest " + i];
      if (!name) continue;
      var diet = p["Guest " + i + " dietary"] || "";
      guests.push(diet ? (name + " (" + diet + ")") : name);
    }

    var ts        = new Date();
    var email     = p["Email"] || "";
    var partySize = p["Party size"] || String(guests.length);
    var welcome   = p["Welcome drinks"] ? "Yes" : "";
    var arrival   = p["Flight arrival code"] || "";
    var ret       = p["Flight return code"] || "";

    // Write a header row the first time.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Email", "Party size", "Guests",
                       "Welcome dinner (Fri)", "Flight arrival", "Flight return"]);
    }
    sheet.appendRow([ts, email, partySize, guests.join("; "), welcome, arrival, ret]);

    // Confirmation email to the guest.
    if (email) {
      var who = p["Guest 1"] || "there";
      var body =
        "Hi " + who + ",\n\n" +
        "We've received your RSVP — thank you! 🥂 We can't wait to celebrate " +
        "with you in Langkawi.\n\n" +
        "Here's what we have on file:\n" +
        "  • Guests: " + guests.join(", ") + "\n" +
        (welcome ? "  • Joining the welcome dinner (Friday): Yes\n" : "") +
        (arrival ? "  • Flight arrival: " + arrival + "\n" : "") +
        (ret     ? "  • Flight return: " + ret + "\n" : "") +
        "\nIf anything looks wrong, just reply to this email and we'll fix it.\n\n" +
        "With love,\nYen & Yang Wei 💕";
      var opts = { name: CONFIG.fromName };
      if (CONFIG.fromAlias) opts.from = CONFIG.fromAlias;
      MailApp.sendEmail(email, "Your RSVP is in 🎉 — Yen & Yang Wei", body, opts);
    }

    // Notification to the couple.
    if (CONFIG.notifyEmail) {
      MailApp.sendEmail(
        CONFIG.notifyEmail,
        "New RSVP: " + (p["Guest 1"] || email || "(no name)"),
        "New RSVP received:\n\n" +
        "Email: " + email + "\n" +
        "Party size: " + partySize + "\n" +
        "Guests: " + guests.join("; ") + "\n" +
        "Welcome dinner: " + (welcome || "no") + "\n" +
        "Flight arrival: " + arrival + "\n" +
        "Flight return: " + ret + "\n");
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput("RSVP endpoint is live.");
}
