/**
 * Wedding RSVP backend — Google Apps Script.
 * Writes ONE ROW PER GUEST to the bound Google Sheet AND emails the guest a
 * confirmation. Also emails the couple a notification (your backup copy).
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
 * 5. Paste that URL into enhance.js as RSVP_ENDPOINT (or send it to Claude).
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

var RSVP_HEADERS = [
  "Timestamp", "Email", "Attending", "Guest name", "Dietary", "Party size",
  "Hotel", "Welcome dinner (Fri)",
  "Flight arrival", "Flight arrival time",
  "Flight return", "Flight return time"
];

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(RSVP_HEADERS);
  } else {
    var lastCol = sheet.getLastColumn();
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

    // Keep older sheets readable: if Attending is missing, put it after Email.
    if (headers.indexOf("Attending") === -1) {
      sheet.insertColumnAfter(2);
      sheet.getRange(1, 3).setValue("Attending");
      lastCol = sheet.getLastColumn();
      headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    }

    RSVP_HEADERS.forEach(function (name) {
      if (headers.indexOf(name) === -1) {
        sheet.insertColumnAfter(sheet.getLastColumn());
        sheet.getRange(1, sheet.getLastColumn()).setValue(name);
        headers.push(name);
      }
    });
  }

  var hdr = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var cols = {};
  hdr.forEach(function (name, i) {
    if (name) cols[name] = i + 1;
  });
  return cols;
}

function appendRsvpRow(sheet, cols, values) {
  var row = new Array(sheet.getLastColumn());
  Object.keys(values).forEach(function (name) {
    if (cols[name]) row[cols[name] - 1] = values[name];
  });
  sheet.getRange(sheet.getLastRow() + 1, 1, 1, row.length).setValues([row]);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // avoid two submissions writing at once
  try {
    var p  = (e && e.parameter)  || {}; // single values
    var pp = (e && e.parameters) || {}; // repeated values (e.g. multiple Hotel checkboxes)
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Guests: "Guest 1", "Guest 2", ... each with an optional "Guest N dietary".
    var guests = [];
    for (var i = 1; i <= 20; i++) {
      var name = p["Guest " + i];
      if (!name) continue;
      guests.push({ name: name, diet: p["Guest " + i + " dietary"] || "" });
    }

    var ts        = new Date();
    var email     = p["Email"] || "";
    var attending = p["Attending"] || "";
    var partySize = p["Party size"] || String(guests.length);
    var hotel     = (pp["Hotel"] || (p["Hotel"] ? [p["Hotel"]] : [])).join(" + ");
    var elsewhere = (p["Staying elsewhere"] || "").trim();
    if (elsewhere) hotel = hotel + " (" + elsewhere + ")";
    // "No, somewhere else" is a valid answer but means NOT booking a group-rate room.
    var stayingAtGroupHotel = hotel && hotel.indexOf("No,") !== 0 && hotel.indexOf("No /") !== 0;
    var welcome   = p["Welcome drinks"] ? "Yes" : "";
    var arrival   = p["Flight arrival code"] || "";
    var ret       = p["Flight return code"] || "";
    var arrivalT  = p["Flight arrival time"] || "";
    var retT      = p["Flight return time"] || "";

    // Header row — tolerate older sheets whose columns are missing or moved.
    var cols = ensureHeaders(sheet);

    // ONE ROW PER GUEST — shared fields repeat down the rows.
    function rowValues(guestName, diet) {
      return {
        "Timestamp": ts,
        "Email": email,
        "Attending": attending,
        "Guest name": guestName,
        "Dietary": diet,
        "Party size": partySize,
        "Hotel": hotel,
        "Welcome dinner (Fri)": welcome,
        "Flight arrival": arrival,
        "Flight arrival time": arrivalT,
        "Flight return": ret,
        "Flight return time": retT
      };
    }
    if (guests.length === 0) {
      appendRsvpRow(sheet, cols, rowValues("", ""));
    } else {
      guests.forEach(function (g) {
        appendRsvpRow(sheet, cols, rowValues(g.name, g.diet));
      });
    }

    var guestSummary = guests.map(function (g) {
      return g.diet ? (g.name + " (" + g.diet + ")") : g.name;
    });

    // Confirmation email to the guest.
    if (email) {
      var who = (guests[0] && guests[0].name) || "there";
      var body =
        "Hi " + who + ",\n\n" +
        "We've received your RSVP — thank you! We can't wait to celebrate " +
        "with you in Langkawi.\n\n" +
        "Here's what we have on file:\n" +
        "  • Guests: " + guestSummary.join(", ") + "\n" +
        (hotel   ? "  • Hotel: " + hotel + "\n" : "") +
        (welcome ? "  • Joining the welcome dinner (Friday): Yes\n" : "") +
        (arrival || arrivalT ? "  • Flight arrival: " + [arrival, arrivalT].filter(String).join(", ") + "\n" : "") +
        (ret || retT ? "  • Flight return: " + [ret, retT].filter(String).join(", ") + "\n" : "") +
        (stayingAtGroupHotel
          ? "\nWe've negotiated a group rate at your chosen hotel and will email " +
            "you a reservation link as soon as the hotel sends it through.\n"
          : "") +
        "\nIf anything looks wrong, just reply to this email and we'll fix it.\n\n" +
        "With love,\nYen & Yang Wei";
      var opts = { name: CONFIG.fromName };
      if (CONFIG.fromAlias) opts.from = CONFIG.fromAlias;
      MailApp.sendEmail(email, "Your RSVP is in — Yen & Yang Wei", body, opts);
    }

    // Notification to the couple (your backup copy).
    if (CONFIG.notifyEmail) {
      MailApp.sendEmail(
        CONFIG.notifyEmail,
        "New RSVP: " + ((guests[0] && guests[0].name) || email || "(no name)"),
        "New RSVP received:\n\n" +
        "Attending: " + (attending || "(not specified)") + "\n" +
        "Email: " + email + "\n" +
        "Party size: " + partySize + "\n" +
        "Guests: " + guestSummary.join("; ") + "\n" +
        "Hotel: " + (hotel || "(none selected)") + "\n" +
        "Welcome dinner: " + (welcome || "no") + "\n" +
        "Flight arrival: " + [arrival, arrivalT].filter(String).join(", ") + "\n" +
        "Flight return: " + [ret, retT].filter(String).join(", ") + "\n");
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
