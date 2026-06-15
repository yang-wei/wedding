/* enhance.js, classic script (works from file://, no server needed).
   The Framer JS bundle is disabled, so the static HTML is the source of truth.
   This re-adds the one interactive piece that needs JS: the draggable photo
   gallery in the blue "Mark your calendars" band. Photos come from /images. */
(function () {
  var PHOTOS = [
    "images/photo-070.jpg",
    "images/photo-006.jpg",
    "images/photo-024.jpg",
    "images/photo-065.jpg",
    "images/photo-007.jpg",
    "images/photo-078.jpg",
    "images/photo-015.jpg",
    "images/photo-023.jpg",
    "images/photo-025.jpg",
    "images/photo-026.jpg",
    "images/photo-045.jpg",
    "images/photo-047.jpg",
    "images/photo-056.jpg",
    "images/photo-061.jpg",
    "images/photo-067.jpg",
    "images/photo-033.jpg",
    "images/photo-069.jpg",
    "images/photo-005.jpg",
    "images/photo-086.jpg",
    "images/photo-028.jpg",
    "images/photo-089.jpg",
    "images/photo-031.jpg",
    "images/photo-060.jpg",
    "images/photo-093.jpg",
    "images/photo-037.jpg",
    "images/photo-066.jpg",
    "images/photo-068.jpg",
    "images/photo-055.jpg",
    "images/photo-074.jpg",
    "images/photo-079.jpg",
    "images/photo-012.jpg",
    "images/photo-013.jpg",
    "images/photo-080.jpg",
    "images/photo-020.jpg",
    "images/photo-027.jpg",
    "images/photo-030.jpg",
    "images/photo-096.jpg",
    "images/photo-043.jpg",
    "images/photo-048.jpg",
    "images/photo-050.jpg",
    "images/photo-051.jpg",
    "images/photo-054.jpg",
    "images/photo-057.jpg",
    "images/photo-111.jpg",
    "images/photo-115.jpg",
    "images/photo-008.jpg",
    "images/photo-022.jpg",
    "images/photo-085.jpg",
    "images/photo-091.jpg",
    "images/photo-034.jpg",
    "images/photo-036.jpg",
    "images/photo-039.jpg",
    "images/photo-042.jpg",
    "images/photo-044.jpg",
    "images/photo-046.jpg",
    "images/photo-049.jpg",
    "images/photo-021.jpg",
    "images/photo-052.jpg",
    "images/photo-053.jpg",
    "images/photo-064.jpg",
    "images/photo-002.jpg",
    "images/photo-072.jpg",
    "images/photo-003.jpg",
    "images/photo-099.jpg",
  ];

  // ⬇️ RSVP delivery: paste your Google Apps Script Web App URL here.
  //    Setup is in apps-script/rsvp.gs. It saves each RSVP to your Google Sheet
  //    and emails the guest a confirmation. The URL ends in /exec.
  // Hover captions, keyed by file name (order here does not matter).
  // Fill in the place + your note for each photo, e.g.:
  //   "images/photo-005.jpg": "Yen's 29th birthday @Bali",
  // Leave a value as "" (empty) to show no caption for that photo.
  var NOTES = {
    "images/photo-002.jpg": "Toyama, Japan 🏔️ · Sep 2025",
    "images/photo-003.jpg": "",
    "images/photo-005.jpg": "",
    "images/photo-006.jpg": "",
    "images/photo-007.jpg": "Amsterdam canals 🇳🇱 · May 2022",
    "images/photo-008.jpg": "Tokyo Tower 🗼 · Aug 2024",
    "images/photo-012.jpg": "",
    "images/photo-013.jpg": "Twelve Apostles, Great Ocean Road 🇦🇺 · Oct 2023",
    "images/photo-015.jpg": "",
    "images/photo-020.jpg": "Great Ocean Road 🇦🇺 · Oct 2023",
    "images/photo-021.jpg": "Marina Bay Sands, Singapore 🇸🇬 · Mar 2025",
    "images/photo-022.jpg": "Yosemite National Park 🇺🇸 · Sep 2024",
    "images/photo-023.jpg": "The Louvre, Paris 🇫🇷 · May 2022",
    "images/photo-024.jpg": "",
    "images/photo-025.jpg": "Picnic by the Eiffel Tower 🇫🇷 · May 2022",
    "images/photo-026.jpg": "Breakfast with an Eiffel Tower view 🇫🇷 · May 2022",
    "images/photo-027.jpg": "Where the snow meets the sea — Suzu ❄️🌊 · Dec 2023",
    "images/photo-028.jpg": "Kusama's Yellow Pumpkin, Naoshima 🎃 · Apr 2023",
    "images/photo-030.jpg": "",
    "images/photo-031.jpg": "A little town in Spain 🇪🇸 · May 2023",
    "images/photo-033.jpg": "",
    "images/photo-034.jpg": "AlUla desert, Saudi Arabia 🏜️ · Dec 2024",
    "images/photo-036.jpg": "AlUla desert, Saudi Arabia 🏜️ · Dec 2024",
    "images/photo-037.jpg": "La Zambra Resort, Málaga 🇪🇸 · May 2023",
    "images/photo-039.jpg": "AlUla desert, Saudi Arabia 🏜️ · Dec 2024",
    "images/photo-042.jpg": "AlUla desert, Saudi Arabia 🏜️ · Dec 2024",
    "images/photo-043.jpg": "",
    "images/photo-044.jpg": "",
    "images/photo-045.jpg": "Kouan — our favourite campsite ⛺ · Sep 2022",
    "images/photo-046.jpg": "Flying home from the proposal trip ✈️💍 · Dec 2024",
    "images/photo-047.jpg": "Kochia season, Japan 🍂 · Oct 2022",
    "images/photo-048.jpg": "Vorderer Gosausee, Austria 🇦🇹 · Feb 2024",
    "images/photo-049.jpg": "",
    "images/photo-050.jpg": "",
    "images/photo-051.jpg": "",
    "images/photo-052.jpg": "",
    "images/photo-053.jpg": "The Bund, Shanghai 🇨🇳 · Apr 2025",
    "images/photo-054.jpg": "Old Town Square, Prague 🇨🇿 · Feb 2024",
    "images/photo-055.jpg": "A campsite somewhere in Nagano ⛺ · Aug 2023",
    "images/photo-056.jpg": "",
    "images/photo-057.jpg": "",
    "images/photo-060.jpg": "",
    "images/photo-061.jpg": "",
    "images/photo-064.jpg": "",
    "images/photo-065.jpg": "",
    "images/photo-066.jpg": "Plaza de España, Seville 🇪🇸 · May 2023",
    "images/photo-067.jpg": "Bali 🌴 · Dec 2022",
    "images/photo-068.jpg": "",
    "images/photo-069.jpg": "Ubud, Bali 🌴 · Dec 2022",
    "images/photo-070.jpg": "Okinawa 🇯🇵 · Jul 2021",
  };

  var RSVP_ENDPOINT = "https://script.google.com/macros/s/AKfycbxOD2lNkoY6uQZM6xOXSDLF6B2JgYI-WndJOWExRMIuYlaYTKe9VJeFHgMc-vLfxMZvqg/exec";

  function injectStyles() {
    var css = [
      // remove Framer's invisible/collapsed original photo ticker (replaced by #wedGallery)
      ".framer-l0t3vs{display:none!important}",
      // remove the empty spacer block under 'How it all started'
      ".framer-xwh9m6{display:none!important}",
      // hero photo: custom ARCH shape (replaces the standing-couple silhouette mask)
      ".framer-1ns6yyg{flex:none!important;width:clamp(260px,40vw,440px)!important;max-width:none!important;height:auto!important;aspect-ratio:0.692!important;-webkit-mask:none!important;mask:none!important;overflow:visible!important;border-radius:0!important;box-shadow:none!important;background-image:url('images/hero-cutout.png')!important;background-size:contain!important;background-position:bottom center!important;background-repeat:no-repeat!important}",
      ".framer-1ns6yyg img,.framer-1ns6yyg [data-framer-background-image-wrapper]{opacity:0!important}",
      // keep the title above the photo arch so 'Save the date' isn't blocked
      ".framer-1rgcutd{position:relative!important;z-index:10!important}",
      "#wedGallery{padding:18px 0 56px;cursor:grab;user-select:none;width:100%}",
      "#wedGallery.is-dragging{cursor:grabbing}",
      "#wedGalleryTrack{display:flex;gap:22px;padding:0 clamp(20px,5vw,64px);overflow-x:auto;scrollbar-width:none}",
      "#wedGalleryTrack::-webkit-scrollbar{display:none}",
      "#wedGalleryTrack .wg-item{flex:0 0 auto;position:relative;border-radius:12px;overflow:hidden;box-shadow:0 14px 30px -16px rgba(0,0,0,.45)}",
      "#wedGalleryTrack .wg-item:nth-child(odd){transform:rotate(-2deg)}",
      "#wedGalleryTrack .wg-item:nth-child(even){transform:rotate(2deg)}",
      "#wedGalleryTrack .wg-item img{display:block;width:clamp(190px,22vw,250px);height:clamp(240px,28vw,320px);object-fit:cover;pointer-events:none}",
      // hover caption (places + your note) over each photo
      "#wedGalleryTrack .wg-cap{position:absolute;left:0;right:0;bottom:0;margin:0;padding:34px 14px 13px;font-family:'Asta Sans','Asta Sans Placeholder',sans-serif;font-size:.82rem;line-height:1.32;color:#fefae9;background:linear-gradient(to top,rgba(0,0,0,.82),rgba(0,0,0,.38) 55%,transparent);opacity:0;transition:opacity .25s ease;pointer-events:none}",
      "#wedGalleryTrack .wg-item:hover .wg-cap{opacity:1}",
      "#wedGallery.is-dragging .wg-cap{opacity:0!important}",
      "#wedGalleryHint{text-align:center;margin:22px 0 0;font-size:.78rem;letter-spacing:.14em;opacity:.75}",
      // travel-info paper-note cards
      "#wedTravel{display:flex;flex-wrap:nowrap;justify-content:center;align-items:stretch;gap:26px;width:100%;max-width:1180px;margin:24px auto 0;padding:44px 24px 22px;overflow-x:auto;overflow-y:visible;scrollbar-width:none;font-family:'Asta Sans','Asta Sans Placeholder',sans-serif}",
      "#wedTravel::-webkit-scrollbar{display:none}",
      "#wedTravel,#wedTravel *{box-sizing:border-box}",
      "#wedTravel .wt-card{flex:0 0 auto;width:262px;background:#f4edd2;border:2.5px solid #2a2018;border-radius:22px 16px 24px 18px/16px 22px 18px 24px;padding:44px 24px 26px;position:relative;box-shadow:0 12px 26px -16px rgba(0,0,0,.5);color:#2a2018}",
      "#wedTravel .wt-card:nth-child(odd){transform:rotate(-2deg)}",
      "#wedTravel .wt-card:nth-child(even){transform:rotate(1.8deg)}",
      "#wedTravel .wt-icon{position:absolute;top:-30px;left:28px;width:60px;height:60px;display:grid;place-items:center;border-radius:50%;font-size:28px;box-shadow:0 6px 14px -8px rgba(0,0,0,.5)}",
      "#wedTravel h3{font-family:'Hershey-Noailles-Times',cursive;font-style:italic;font-weight:400;font-size:1.7rem;margin:0 0 14px}",
      "#wedTravel p{margin:0 0 10px;font-size:.92rem;line-height:1.4}",
      "#wedTravel .wt-rate{padding:10px 0;border-bottom:1px dashed rgba(42,32,24,.25)}",
      "#wedTravel .wt-rate .wt-link{display:inline-block}",
      "#wedTravel .wt-hotelrow{display:flex;align-items:center;gap:8px;flex-wrap:wrap}",
      "#wedTravel .wt-off{display:inline-block;background:#e4b2d2;color:#4d2008;font-family:'Hershey-Noailles-Times',cursive;font-style:italic;font-size:.95rem;line-height:1;padding:4px 11px 3px;border:1.5px solid #4d2008;border-radius:14px 9px 13px 10px/9px 13px 10px 14px;transform:rotate(-3.5deg);box-shadow:1px 2px 0 rgba(77,32,8,.25)}",
      "#wedTravel .wt-prices{margin-top:4px}",
      "#wedTravel .wt-was{text-decoration:line-through;opacity:.55;font-size:.85rem;margin-right:7px}",
      "#wedTravel .wt-now{font-weight:800;font-size:1.08rem}",
      "#wedTravel .wt-per{font-size:.8rem;opacity:.8}",
      "#wedTravel .wt-room{font-size:.76rem;opacity:.7;margin-top:1px}",
      "#wedTravel .wt-note{font-size:.82rem;opacity:.8;margin-top:10px}",
      "#wedTravel .wt-link{color:#2f6fae;font-weight:700;text-decoration:underline;text-underline-offset:2px;text-decoration-thickness:2px;white-space:nowrap}",
      "#wedTravel .wt-link:hover{color:#1c4f86}",
      "#wedTravel .wt-dress{display:flex;flex-direction:column;gap:8px;margin-top:6px}",
      "#wedTravel .wt-dress-row{font-size:.92rem;line-height:1.5}",
      "#wedTravel .wt-swatch{display:inline-block;vertical-align:middle;width:18px;height:18px;border-radius:50%;border:2px solid #2a2018;box-shadow:0 2px 4px -2px rgba(0,0,0,.5);margin:0 1px}",
      // FAQ / Q&A (its own section, just before the RSVP)
      "#wedFaqSection{padding:clamp(50px,8vw,92px) 0}",
      "#wedFaq{max-width:660px;margin:0 auto;padding:0 24px;text-align:left;font-family:'Asta Sans','Asta Sans Placeholder',sans-serif}",
      "#wedFaq h3{font-family:'Hershey-Noailles-Times',cursive;font-style:italic;font-weight:400;font-size:1.9rem;text-align:center;margin:0 0 20px;color:#4d2008}",
      "#wedFaq .faq-item{padding:16px 2px;border-bottom:1px dashed rgba(77,32,8,.25)}",
      "#wedFaq .faq-q{margin:0 0 6px;font-weight:700;font-size:1rem;color:#4d2008}",
      "#wedFaq .faq-a{margin:0;font-size:.93rem;line-height:1.5;color:#4d2008;opacity:.9}",
      // RSVP dynamic guest list
      "#wedParty,#wedParty *{box-sizing:border-box}",
      "#wedParty .wp-label{display:block;font-size:1.05rem;color:#fefae9;margin:0 0 12px}",
      "#wedPartyRows{display:flex;flex-direction:column;gap:12px}",
      "#wedParty .wp-row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}",
      "#wedParty .wp-row input{flex:1 1 150px;font-family:inherit;font-size:.95rem;color:#fefae9;background:transparent;border:1.5px solid rgba(254,250,233,.55);border-radius:999px;padding:14px 20px}",
      "#wedParty .wp-row input::placeholder{color:rgba(254,250,233,.6)}",
      "#wedParty .wp-row input:focus{outline:none;border-color:#fefae9}",
      "#wedParty .wp-remove{flex:0 0 auto;width:36px;height:36px;border-radius:50%;border:1.5px solid rgba(254,250,233,.55);background:transparent;color:#fefae9;cursor:pointer;font-size:1.1rem;line-height:1}",
      "#wedParty .wp-remove-spacer{flex:0 0 auto;width:36px}",
      "#wedParty .wp-remove:hover{background:rgba(254,250,233,.18)}",
      "#wedParty .wp-add{margin:12px 0 0;background:rgba(254,250,233,.22);color:#fefae9;border:none;border-radius:999px;padding:11px 20px;cursor:pointer;font-family:inherit;font-size:.92rem}",
      "#wedParty .wp-add:hover{background:rgba(254,250,233,.34)}",
    ].join("");
    var s = document.createElement("style");
    s.id = "wedGalleryCss";
    s.textContent = css;
    document.head.appendChild(s);
  }

  function build() {
    if (document.getElementById("wedGallery")) return; // guard against double-run
    injectStyles();

    var wrap = document.createElement("div");
    wrap.id = "wedGallery";

    var track = document.createElement("div");
    track.id = "wedGalleryTrack";
    PHOTOS.forEach(function (src) {
      var note = (NOTES[src] || "").trim();

      var fig = document.createElement("figure");
      fig.className = "wg-item";
      fig.style.margin = "0";

      var img = new Image();
      img.src = src;
      img.alt = note;
      img.draggable = false;
      img.onerror = function () { fig.remove(); }; // drop any missing file silently
      fig.appendChild(img);

      if (note) {
        var cap = document.createElement("figcaption");
        cap.className = "wg-cap";
        cap.textContent = note;
        fig.title = note; // native tooltip fallback (e.g. touch / no-hover)
        fig.appendChild(cap);
      }

      track.appendChild(fig);
    });

    var hint = document.createElement("p");
    hint.id = "wedGalleryHint";
    hint.textContent = "← drag to explore →";

    wrap.appendChild(track);
    wrap.appendChild(hint);

    // place it inside the "How it all started" (story) section; fall back gracefully
    var host =
      document.querySelector('[data-framer-name="story"]') ||
      document.getElementById("invitation") ||
      document.body;
    host.appendChild(wrap);

    // drag-to-scroll (mouse + touch)
    var down = false, startX = 0, startScroll = 0;
    function start(x) { down = true; startX = x; startScroll = track.scrollLeft; wrap.classList.add("is-dragging"); }
    function move(x) { if (!down) return; track.scrollLeft = startScroll - (x - startX); }
    function end() { down = false; wrap.classList.remove("is-dragging"); }
    wrap.addEventListener("mousedown", function (e) { start(e.pageX); });
    window.addEventListener("mousemove", function (e) { move(e.pageX); });
    window.addEventListener("mouseup", end);
    wrap.addEventListener("touchstart", function (e) { start(e.touches[0].pageX); }, { passive: true });
    wrap.addEventListener("touchmove", function (e) { move(e.touches[0].pageX); }, { passive: true });
    wrap.addEventListener("touchend", end);
  }

  function buildTravel() {
    var section = document.querySelector('[data-framer-name="travel info"]');
    if (!section || document.getElementById("wedTravel")) return;

    // hide Framer's invisible (opacity:0) ticker that holds the original cards
    var ul = section.querySelector('ul[role="group"]');
    if (ul) {
      var ticker = ul.closest('[data-framer-name="ticker wrapper"]') || ul.parentElement || ul;
      ticker.style.display = "none";
    }

    var cards = [
      {
        icon: "✈️", bg: "#d9a7cf", title: "Logistics",
        html:
          "<p>Langkawi International Airport is about <strong>30 minutes</strong> from The St. Regis Langkawi.</p>" +
          "<p>Direct flights from <strong>KL, Penang &amp; Singapore</strong> only.</p>",
      },
      {
        icon: "🛏️", bg: "#f4b89a", title: "Accommodation",
        html:
          "<p>We've secured a group rate, Yen negotiated hard for the rates below.</p>" +
          "<div class='wt-rate'>" +
            "<div class='wt-hotelrow'><a class='wt-link' href='https://www.marriott.com/en-us/hotels/lgkxr-the-st-regis-langkawi/overview/' target='_blank' rel='noopener'>St. Regis 🔗</a><span class='wt-off'>66% off!</span></div>" +
            "<div class='wt-prices'><span class='wt-was'>RM3,500</span><span class='wt-now'>RM1,200</span><span class='wt-per'>/night</span></div>" +
            "<div class='wt-room'>Guest room</div>" +
          "</div>" +
          "<div class='wt-rate'>" +
            "<div class='wt-hotelrow'><a class='wt-link' href='https://www.marriott.com/en-us/hotels/lgkwi-the-westin-langkawi-resort-and-spa/overview/' target='_blank' rel='noopener'>Westin 🔗</a><span class='wt-off'>45% off!</span></div>" +
            "<div class='wt-prices'><span class='wt-was'>RM1,235</span><span class='wt-now'>RM680</span><span class='wt-per'>/night</span></div>" +
            "<div class='wt-room'>Standard room</div>" +
          "</div>" +
          "<p class='wt-note'>Available the nights of 12 &amp; 13 Feb.</p>",
      },
      {
        icon: "👗", bg: "#9fc0d6", title: "Dress code",
        html:
          "<p><strong>Formal</strong> ✨ Dress to impress!</p>" +
          "<div class='wt-dress'>" +
            "<div class='wt-dress-row'><strong>Gents:</strong> Black suits <span class='wt-swatch' style='background:#1c1c1c'></span></div>" +
            "<div class='wt-dress-row'><strong>Ladies:</strong> Beige <span class='wt-swatch' style='background:#e0cba8'></span> or brown <span class='wt-swatch' style='background:#8a6d4b'></span></div>" +
          "</div>",
      },
      {
        icon: "🧸", bg: "#c9d18a", title: "Kids",
        html:
          "<p>We love your little ones (truly!), but we've planned our wedding as a <strong>grown-ups' celebration</strong>, so the whole day (ceremony <em>and</em> reception) will be adults-only. Think of it as a well-earned night off. 💕</p>" +
          "<p>If bringing your little one is unavoidable, just let us know, we're happy to help arrange a babysitter for the day so you can relax and enjoy.</p>",
      },
    ];

    var wrap = document.createElement("div");
    wrap.id = "wedTravel";
    cards.forEach(function (c) {
      var card = document.createElement("article");
      card.className = "wt-card";
      card.innerHTML =
        '<div class="wt-icon" style="background:' + c.bg + '">' + c.icon + "</div>" +
        "<h3>" + c.title + "</h3>" + c.html;
      wrap.appendChild(card);
    });
    section.appendChild(wrap);
  }

  function enhanceRsvp() {
    var form = document.querySelector("form.framer-e1hfmq") ||
               document.querySelector('[data-framer-name="rsvp"] form');
    if (!form || form.getAttribute("data-wed-rsvp")) return;
    form.setAttribute("data-wed-rsvp", "1");
    var rsvpDone = false; // set true once submitted, to silence the leave warning

    var nameInput = form.querySelector('input[name="Name"]');
    var nameLabel = nameInput ? nameInput.closest("label") : null;

    // remove the big "Who are you RSVPing for?" field (replaced by the guest list)
    var rsvpFor = form.querySelector('[name="Who are you RSVPing for?"]');
    if (rsvpFor) { var l0 = rsvpFor.closest("label"); if (l0) l0.remove(); }

    // optional flight-code fields, cloned from the Name field so styling matches (clone before removing it)
    function makeField(labelText, fieldName, ph, type) {
      if (!nameLabel) return null;
      var c = nameLabel.cloneNode(true);
      var p = c.querySelector("p"); if (p) p.textContent = labelText;
      var inp = c.querySelector("input");
      if (inp) {
        inp.name = fieldName; inp.value = ""; inp.required = false; inp.removeAttribute("required");
        if (type) { inp.type = type; inp.removeAttribute("placeholder"); inp.style.colorScheme = "dark"; }
        else { inp.placeholder = ph; }
      }
      return c;
    }
    var fa  = makeField("Arrival flight number (optional)", "Flight arrival code", "e.g. AK6293");
    var faT = makeField("Arrival date & time (optional)", "Flight arrival time", "", "datetime-local");
    var fr  = makeField("Return flight number (optional)", "Flight return code", "e.g. AK6296");
    var frT = makeField("Return date & time (optional)", "Flight return time", "", "datetime-local");

    // dynamic guest list (first row is you, prefilled). Replaces the single Name + shared dietary fields.
    var party = document.createElement("div");
    party.id = "wedParty";
    var plabel = document.createElement("p");
    plabel.className = "wp-label";
    plabel.textContent = "Who's coming? (add yourself, then your guests)";
    party.appendChild(plabel);
    var rows = document.createElement("div");
    rows.id = "wedPartyRows";
    party.appendChild(rows);
    var addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "wp-add";
    addBtn.textContent = "+ Add guest";
    party.appendChild(addBtn);

    function addRow(isFirst) {
      var row = document.createElement("div");
      row.className = "wp-row";
      var nm = document.createElement("input");
      nm.type = "text"; nm.className = "wp-name";
      nm.placeholder = isFirst ? "Your full name" : "Guest's full name";
      if (isFirst) nm.required = true;
      var dt = document.createElement("input");
      dt.type = "text"; dt.className = "wp-diet";
      dt.placeholder = "Dietary / allergies (optional)";
      row.appendChild(nm); row.appendChild(dt);
      if (!isFirst) {
        var rm = document.createElement("button");
        rm.type = "button"; rm.className = "wp-remove";
        rm.setAttribute("aria-label", "Remove guest"); rm.textContent = "×";
        rm.onclick = function () { row.remove(); };
        row.appendChild(rm);
      } else {
        // invisible spacer so the first row's fields match the width of rows that have a × button
        var spacer = document.createElement("span");
        spacer.className = "wp-remove-spacer";
        spacer.setAttribute("aria-hidden", "true");
        row.appendChild(spacer);
      }
      rows.appendChild(row);
      return nm;
    }
    addRow(true); // prefilled first row = you
    addBtn.onclick = function () { addRow(false).focus(); };

    // drop the single Name field + the shared dietary field; put the guest list in their place
    if (nameLabel) { nameLabel.parentNode.insertBefore(party, nameLabel); nameLabel.remove(); }
    else { form.insertBefore(party, form.firstChild); }
    var dietary = form.querySelector('[name="Any dietary restrictions or allergies?"]');
    if (dietary) { var dl = dietary.closest("label"); if (dl) dl.remove(); }

    // place the optional flight fields after the Email field
    var emailInput = form.querySelector('input[name="Email"]');
    var emailLabel = emailInput ? emailInput.closest("label") : null;
    var anchor = emailLabel || party;
    [fa, faT, fr, frT].forEach(function (node) {
      if (node && anchor) { anchor.parentNode.insertBefore(node, anchor.nextSibling); anchor = node; }
    });

    // hotel question: clone the existing checkbox group so styling matches, then
    // repurpose it as "where are you staying?" with St. Regis / Westin options.
    var cbGroup = form.querySelector('[data-framer-name="Checkbox Group"]');
    if (cbGroup) {
      var hotelGroup = cbGroup.cloneNode(true);
      var hprompt = hotelGroup.querySelector("p");
      if (hprompt) hprompt.textContent = "Are you staying at one of our group-rate hotels?";
      var hbox = hotelGroup.querySelector('[data-framer-name="checkboxes"]');
      var tmpl = hbox ? hbox.querySelector("label") : null;
      if (tmpl) {
        var setHotel = function (label, value) {
          var inp = label.querySelector("input");
          if (inp) { inp.name = "Hotel"; inp.setAttribute("value", value); inp.checked = false; }
          var lp = label.querySelector("p");
          if (lp) lp.textContent = value;
        };
        setHotel(tmpl, "The St. Regis Langkawi");
        var westin = tmpl.cloneNode(true);
        setHotel(westin, "The Westin Langkawi");
        hbox.appendChild(westin);
        var note = document.createElement("p");
        note.textContent = "We've negotiated group rates at both. Tick where you'd like to stay and we'll email you a reservation link once the hotel sends it through.";
        note.style.cssText = "margin:10px 2px 0;font-size:.85rem;line-height:1.45;color:#fefae9;opacity:.8";
        hotelGroup.appendChild(note);
      }
      cbGroup.parentNode.insertBefore(hotelGroup, cbGroup.nextSibling);
    }

    // strip Framer's honeypots and wire to Web3Forms
    [].forEach.call(form.querySelectorAll('input[aria-hidden="true"][tabindex="-1"]'), function (i) { i.remove(); });
    function hidden(n, v) { var i = document.createElement("input"); i.type = "hidden"; i.name = n; i.value = v; form.appendChild(i); return i; }
    var partySizeField = hidden("Party size", "1");

    function showThanks(ok) {
      var msg = document.createElement("p");
      msg.style.cssText = "text-align:center;color:#fefae9;font-size:1.15rem;line-height:1.5;max-width:34ch;margin:26px auto 0";
      msg.textContent = ok
        ? "Yay, your RSVP is in! We can't wait to celebrate with you in Langkawi 🥂"
        : "Hmm, that didn't send. Please try again, or message us directly 💌";
      if (ok) { rsvpDone = true; form.style.display = "none"; }
      else { var b = form.querySelector('button[type="submit"]'); if (b) { b.disabled = false; b.style.opacity = "1"; } }
      form.parentNode.insertBefore(msg, form.nextSibling);
      msg.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      // number the guests sequentially so the email reads Guest 1, Guest 2, ...
      var rs = [].slice.call(rows.querySelectorAll(".wp-row"));
      rs.forEach(function (r, i) {
        var n = i + 1;
        var nm = r.querySelector(".wp-name"), dt = r.querySelector(".wp-diet");
        if (nm) nm.name = "Guest " + n;
        if (dt) dt.name = dt.value.trim() ? "Guest " + n + " dietary" : "";
      });
      partySizeField.value = String(rs.length);
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (/PASTE-YOUR/.test(RSVP_ENDPOINT)) {
        alert("RSVP isn't connected yet, add your Apps Script Web App URL near the top of enhance.js.");
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.style.opacity = ".6"; }
      // Build a url-encoded body (Apps Script parses these most reliably; keeps
      // repeated fields like multiple Hotel checkboxes).
      var fd = new FormData(form);
      var params = new URLSearchParams();
      fd.forEach(function (v, k) { params.append(k, v); });
      // Opaque (no-cors) response — the row is still written and emails still send.
      fetch(RSVP_ENDPOINT, { method: "POST", mode: "no-cors", body: params })
        .then(function () { showThanks(true); })
        .catch(function () { showThanks(false); });
    });

    // Guard against accidentally leaving before submitting — matters most for
    // parties adding several guests. Warn only if they've started and not submitted.
    window.addEventListener("beforeunload", function (e) {
      if (rsvpDone) return;
      var started = false;
      [].forEach.call(form.querySelectorAll("input, textarea"), function (el) {
        if (el.type === "checkbox" || el.type === "radio") { if (el.checked) started = true; }
        else if (el.value && el.value.trim()) started = true;
      });
      if (!started) return;
      e.preventDefault();
      e.returnValue = "";
    });
  }

  function buildFaq() {
    var rsvpSection = document.querySelector('[data-framer-name="rsvp"]');
    if (!rsvpSection || document.getElementById("wedFaqSection")) return;
    var section = document.createElement("section");
    section.id = "wedFaqSection";
    rsvpSection.parentNode.insertBefore(section, rsvpSection);

    // Edit / add Q&As here, keep the warm, cheeky, "we've got you" vibe.
    var items = [
      { q: "What if I need to bring my kids?",
        a: "We've planned the day as a grown-ups-only celebration, so we gently ask to keep it kids-free, but we totally get that it's not always possible! 👶 If your little ones come along, we'll help you sort out a babysitter for the day: BYOM (Bring Your Own Mum, or maid!), or the hotel's childcare service for ages 4–12. They're in good hands, and you get to enjoy the night." },
      { q: "Can I stay anywhere else besides St Regis and Westin?",
        a: "Absolutely! 🏨 You're welcome to stay wherever suits you best — guests arrange and cover their own accommodation, so the choice is entirely yours. We've recommended St. Regis and Westin (with group rates) to make booking easy, but feel free to pick your own spot. Just let us know where you'll be staying so we can keep you in the loop. 💌" },
      { q: "Any tips on booking flights?",
        a: "Book early! ✈️ Fares only climb the closer we get, so grab yours sooner rather than later, future-you will thank you." },
    ];

    var wrap = document.createElement("div");
    wrap.id = "wedFaq";
    var h = document.createElement("h3");
    h.textContent = "Questions? We've got you 💛";
    wrap.appendChild(h);
    items.forEach(function (it) {
      var d = document.createElement("div"); d.className = "faq-item";
      var q = document.createElement("p"); q.className = "faq-q"; q.textContent = it.q;
      var a = document.createElement("p"); a.className = "faq-a"; a.textContent = it.a;
      d.appendChild(q); d.appendChild(a); wrap.appendChild(d);
    });
    section.appendChild(wrap);
  }

  function run() { build(); buildTravel(); buildFaq(); enhanceRsvp(); }
  if (document.readyState !== "loading") run();
  else document.addEventListener("DOMContentLoaded", run);
})();
