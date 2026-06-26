/* enhance.js, classic script (works from file://, no server needed).
   The Framer JS bundle is disabled, so the static HTML is the source of truth.
   This re-adds the one interactive piece that needs JS: the draggable photo
   gallery in the blue "Mark your calendars" band. Photos come from /images. */
(function () {
  var PHOTOS = [
    "images/photo-070.jpg",
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

  // ⬇ RSVP delivery: paste your Google Apps Script Web App URL here.
  //    Setup is in apps-script/rsvp.gs. It saves each RSVP to your Google Sheet
  //    and emails the guest a confirmation. The URL ends in /exec.
  // Hover captions, keyed by file name (order here does not matter).
  // Fill in the place + your note for each photo, e.g.:
  //   "images/photo-005.jpg": "Yen's 29th birthday @Bali",
  // Leave a value as "" (empty) to show no caption for that photo.
  var NOTES = {
    "images/photo-002.jpg": "Toyama, Japan · Sep 2025",
    "images/photo-003.jpg": "",
    "images/photo-005.jpg": "",
    "images/photo-007.jpg": "Amsterdam canals · May 2022",
    "images/photo-008.jpg": "Tokyo Tower · Aug 2024",
    "images/photo-012.jpg": "",
    "images/photo-013.jpg": "Twelve Apostles, Great Ocean Road · Oct 2023",
    "images/photo-015.jpg": "",
    "images/photo-020.jpg": "Great Ocean Road · Oct 2023",
    "images/photo-021.jpg": "Marina Bay Sands, Singapore · Mar 2025",
    "images/photo-022.jpg": "Yosemite National Park · Sep 2024",
    "images/photo-023.jpg": "The Louvre, Paris · May 2022",
    "images/photo-024.jpg": "",
    "images/photo-025.jpg": "Picnic by the Eiffel Tower · May 2022",
    "images/photo-026.jpg": "Breakfast with an Eiffel Tower view · May 2022",
    "images/photo-027.jpg": "Where the snow meets the sea — Suzu · Dec 2023",
    "images/photo-028.jpg": "Kusama's Yellow Pumpkin, Naoshima · Apr 2023",
    "images/photo-030.jpg": "",
    "images/photo-031.jpg": "A little town in Spain · May 2023",
    "images/photo-033.jpg": "",
    "images/photo-034.jpg": "AlUla desert, Saudi Arabia · Dec 2024",
    "images/photo-036.jpg": "AlUla desert, Saudi Arabia · Dec 2024",
    "images/photo-037.jpg": "La Zambra Resort, Málaga · May 2023",
    "images/photo-039.jpg": "AlUla desert, Saudi Arabia · Dec 2024",
    "images/photo-042.jpg": "AlUla desert, Saudi Arabia · Dec 2024",
    "images/photo-043.jpg": "",
    "images/photo-044.jpg": "",
    "images/photo-045.jpg": "Kouan — our favourite campsite · Sep 2022",
    "images/photo-046.jpg": "Flying home from the proposal trip · Dec 2024",
    "images/photo-047.jpg": "Kochia season, Japan · Oct 2022",
    "images/photo-048.jpg": "Vorderer Gosausee, Austria · Feb 2024",
    "images/photo-049.jpg": "",
    "images/photo-050.jpg": "",
    "images/photo-051.jpg": "",
    "images/photo-052.jpg": "",
    "images/photo-053.jpg": "The Bund, Shanghai · Apr 2025",
    "images/photo-054.jpg": "Old Town Square, Prague · Feb 2024",
    "images/photo-055.jpg": "A campsite somewhere in Nagano · Aug 2023",
    "images/photo-056.jpg": "",
    "images/photo-057.jpg": "",
    "images/photo-060.jpg": "",
    "images/photo-061.jpg": "",
    "images/photo-064.jpg": "",
    "images/photo-065.jpg": "",
    "images/photo-066.jpg": "Plaza de España, Seville · May 2023",
    "images/photo-067.jpg": "Bali · Dec 2022",
    "images/photo-068.jpg": "",
    "images/photo-069.jpg": "Ubud, Bali · Dec 2022",
    "images/photo-070.jpg": "Okinawa · Jul 2021",
  };

  var RSVP_ENDPOINT = "https://script.google.com/macros/s/AKfycbxOD2lNkoY6uQZM6xOXSDLF6B2JgYI-WndJOWExRMIuYlaYTKe9VJeFHgMc-vLfxMZvqg/exec";

  function injectStyles() {
    var css = [
      // remove Framer's invisible/collapsed original photo ticker (replaced by #wedGallery)
      ".framer-l0t3vs{display:none!important}",
      // remove the empty spacer block under 'How it all started'
      ".framer-xwh9m6{display:none!important}",
      "@media(max-width:809.98px){.framer-1u52ydy,.framer-1py9a9j,.framer-1ej0jd0,.framer-10h98ge,.framer-slwhx0,.framer-rivr1n{display:none!important}}",
      "@media(max-width:809.98px){.framer-wazbi1{padding-top:0!important}}",
      "#wedGallery{padding:18px 0 56px;cursor:grab;user-select:none;width:100%;touch-action:pan-x;overscroll-behavior-x:contain}",
      "#wedGallery.is-dragging{cursor:grabbing}",
      "#wedGalleryTrack{display:flex;gap:22px;padding:0 clamp(20px,5vw,64px);overflow-x:auto;scrollbar-width:none;touch-action:pan-x;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain}",
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
      "#wedTravel{display:flex;flex-wrap:nowrap;justify-content:safe center;align-items:stretch;gap:26px;width:100%;max-width:1180px;margin:24px auto 0;padding:44px 24px 22px;overflow-x:auto;overflow-y:visible;scrollbar-width:none;scroll-snap-type:x mandatory;scroll-padding:0 24px;font-family:'Asta Sans','Asta Sans Placeholder',sans-serif;cursor:grab;user-select:none;touch-action:pan-x;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain}",
      "#wedTravel .wt-card{scroll-snap-align:center}",
      "#wedTravel::-webkit-scrollbar{display:none}",
      "#wedTravelHint{display:none;text-align:center;margin:16px 0 0;font-size:.78rem;letter-spacing:.14em;opacity:.75;font-family:'Asta Sans','Asta Sans Placeholder',sans-serif}",
      "@media(max-width:809.98px){#wedTravelHint{display:block}}",
      "@media(max-width:809.98px){#wedTravel{flex-direction:column;align-items:center;overflow:visible;scroll-snap-type:none;touch-action:pan-y;overscroll-behavior:auto;cursor:default;user-select:auto;padding-bottom:10px}#wedTravel .wt-card{width:min(100%,320px);scroll-snap-align:none}#wedTravelHint{display:none}}",
      "#wedTravel,#wedTravel *{box-sizing:border-box}",
      "#wedTravel .wt-card{flex:0 0 auto;width:262px;background:#f4edd2;border:2.5px solid #2a2018;border-radius:22px 16px 24px 18px/16px 22px 18px 24px;padding:44px 24px 26px;position:relative;box-shadow:0 12px 26px -16px rgba(0,0,0,.5);color:#2a2018}",
      "#wedTravel .wt-card:nth-child(odd){transform:rotate(-2deg)}",
      "#wedTravel .wt-card:nth-child(even){transform:rotate(1.8deg)}",
      "#wedTravel .wt-icon{position:absolute;top:-30px;left:28px;width:60px;height:60px;display:grid;place-items:center;border-radius:50%;background:var(--wt-bg,#d9a7cf);box-shadow:0 6px 14px -8px rgba(0,0,0,.5)}",
      "#wedTravel .wt-glyph{display:block;width:38px;height:38px;background:#f4edd2;-webkit-mask:var(--wt-icon) center/contain no-repeat;mask:var(--wt-icon) center/contain no-repeat}",
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
      "#wedTravel .wt-link{color:#2f6fae;font-weight:700;font-size:1.18rem;text-decoration:underline;text-underline-offset:2px;text-decoration-thickness:2px;white-space:nowrap}",
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
      // hotel question rendered as single-select radios (override Framer's boolean-input look)
      "#wedHotelGroup input[type=radio]{appearance:none;-webkit-appearance:none;width:20px;height:20px;min-width:20px;border-radius:50%;border:2px solid rgba(254,250,233,.55);background:transparent;box-shadow:none;cursor:pointer;transition:border-color .15s ease,box-shadow .15s ease}",
      "#wedHotelGroup input[type=radio]:checked{border-color:#fefae9;box-shadow:inset 0 0 0 4px #fefae9}",
      "#wedHotelGroup input[type=radio]:before,#wedHotelGroup input[type=radio]:after{display:none!important;content:none!important}",
      // "What awaits us" — vertical timeline for the order of events
      "#wedTimeline,#wedTimeline *{box-sizing:border-box}",
      "#wedTimeline{position:relative;max-width:900px;margin:38px auto 0;padding:8px 0 24px;font-family:'Asta Sans','Asta Sans Placeholder',sans-serif;color:#2a2018}",
      "#wedTimeline .tl-line{position:absolute;top:0;bottom:0;left:50%;width:2px;transform:translateX(-50%);background:rgba(42,32,24,.2);border-radius:2px;z-index:0}",
      "#wedTimeline .tl-fill{position:absolute;left:0;top:0;width:100%;height:0;background:#42421d;border-radius:2px}",
      "#wedTimeline .tl-heart{position:absolute;left:50%;top:0;width:34px;height:34px;transform:translate(-50%,-50%);z-index:3;filter:drop-shadow(0 3px 5px rgba(0,0,0,.3))}",
      "#wedTimeline .tl-heart svg{width:100%;height:100%;fill:#c92f2f;display:block}",
      "#wedTimeline .tl-day{position:relative;width:50%;margin:0 0 56px;z-index:1}",
      "#wedTimeline .tl-day:last-child{margin-bottom:0}",
      "#wedTimeline .tl-left{margin-right:auto;padding-right:46px;text-align:right}",
      "#wedTimeline .tl-right{margin-left:auto;padding-left:46px;text-align:left}",
      "#wedTimeline .tl-node{position:absolute;top:30px;width:18px;height:18px;border-radius:50%;background:#fefae9;border:2.5px solid rgba(42,32,24,.45);z-index:2;transition:background .25s ease,border-color .25s ease,transform .25s ease}",
      "#wedTimeline .tl-left .tl-node{right:-10px}",
      "#wedTimeline .tl-right .tl-node{left:-10px}",
      "#wedTimeline .tl-day.is-in .tl-node{background:#b8534a;border-color:#42421d;transform:scale(1.18)}",
      "#wedTimeline .tl-card{display:block;text-align:left;background:#f4edd2;border:2.5px solid #2a2018;border-radius:22px 16px 24px 18px/16px 22px 18px 24px;padding:18px 22px 20px;box-shadow:0 12px 26px -16px rgba(0,0,0,.5);opacity:0;transform:translateY(26px);transition:opacity .55s ease,transform .55s ease}",
      "#wedTimeline .tl-day.is-in .tl-card{opacity:1;transform:none}",
      "#wedTimeline h3{font-family:'Hershey-Noailles-Times',cursive;font-style:italic;font-weight:400;font-size:1.6rem;line-height:1.05;margin:0 0 9px;color:#42421d}",
      "#wedTimeline .tl-intro{font-size:.9rem;line-height:1.5;margin:0 0 13px}",
      "#wedTimeline .tl-sched{list-style:none;margin:0;padding:0}",
      "#wedTimeline .tl-sched li{font-size:.88rem;line-height:1.4;padding:7px 0;border-top:1px dashed rgba(42,32,24,.25)}",
      "#wedTimeline .tl-time{font-weight:800;color:#42421d}",
      "@media(max-width:809.98px){",
      "#wedTimeline{max-width:520px;padding-left:4px}",
      "#wedTimeline .tl-line{left:19px}",
      "#wedTimeline .tl-heart{left:19px}",
      "#wedTimeline .tl-day{width:100%;margin-bottom:34px;padding-left:44px!important;padding-right:14px!important;text-align:left!important}",
      "#wedTimeline .tl-node{left:11px!important;right:auto!important}",
      "}",
    ].join("");
    var s = document.createElement("style");
    s.id = "wedGalleryCss";
    s.textContent = css;
    document.head.appendChild(s);
  }

  // Parse a sortable month index from a photo's caption (e.g. "… · Dec 2024" -> 2024*12+11).
  // Returns null when the caption has no date.
  var MONTHS = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  function photoDate(src) {
    var m = (NOTES[src] || "").match(/([A-Z][a-z]{2})\s+(\d{4})/);
    return (m && m[1] in MONTHS) ? parseInt(m[2], 10) * 12 + MONTHS[m[1]] : null;
  }

  // Pick `n` photos at random on each load, spread across capture dates so we don't
  // get several shots from the same trip. Photos are grouped by month; the distinct
  // months are sorted and split into `n` equal time-ordered segments, and one random
  // month (then one random photo from it) is drawn per segment — so the picks are
  // always from different months. If there aren't enough distinct months, the rest
  // are filled in from undated photos at random.
  function pickPhotos(n) {
    n = n || 6;
    var byDate = {}, undated = [];
    PHOTOS.forEach(function (src) {
      var d = photoDate(src);
      if (d == null) undated.push(src);
      else (byDate[d] = byDate[d] || []).push(src);
    });
    var dates = Object.keys(byDate).map(Number).sort(function (a, b) { return a - b; });
    function randOf(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    var chosen = [];
    if (dates.length >= n) {
      for (var i = 0; i < n; i++) {
        var lo = Math.floor(i * dates.length / n);
        var hi = Math.floor((i + 1) * dates.length / n);
        if (hi <= lo) hi = lo + 1;
        chosen.push(randOf(byDate[dates[lo + Math.floor(Math.random() * (hi - lo))]]));
      }
    } else {
      dates.forEach(function (d) { chosen.push(randOf(byDate[d])); });
      var pool = undated.slice();
      while (chosen.length < n && pool.length) {
        chosen.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
      }
    }
    return chosen;
  }

  function build() {
    if (document.getElementById("wedGallery")) return; // guard against double-run
    injectStyles();

    var wrap = document.createElement("div");
    wrap.id = "wedGallery";

    var track = document.createElement("div");
    track.id = "wedGalleryTrack";
    pickPhotos(6).forEach(function (src) {
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
    // Touch: rely on native horizontal scrolling (CSS touch-action:pan-x above)
    // so a swipe pans left/right only and can never drift the page vertically.
    // The mouse handlers above keep drag-to-scroll working on desktop.
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

    function iconMask(body) {
      return 'url("data:image/svg+xml,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + body + '</svg>'
      ) + '")';
    }

    var cards = [
      {
        icon: '<path d="M2 22h20"/><path d="M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 5 6l1.9-.95a2 2 0 0 1 1.8.1l5.84 3.5 3.16-.85a2 2 0 0 1 2.4 1.4 2 2 0 0 1-1.4 2.4Z"/>',
        bg: "#d9a7cf", title: "Logistics",
        html:
          "<p>Direct flights to <strong>Langkawi (LGK)</strong> are from <strong>KL, Penang &amp; Singapore</strong> only.</p>" +
          "<p><strong>For overseas guests:</strong> fly into KL or Singapore first, then a short connecting flight to Langkawi.</p>" +
          "<p><strong>Airport transfer:</strong> the airport is about <strong>30 min</strong> from the hotels by taxi or Grab.</p>" +
          "<p><strong>Duty-free island</strong> — alcohol is cheaper than bottled water (yes, really).</p>",
      },
      {
        icon: '<path d="M2 5v15"/><path d="M2 11h18a2 2 0 0 1 2 2v7"/><path d="M2 16h20"/><path d="M6 11V8h5v3"/>',
        bg: "#f4b89a", title: "Accommodation",
        html:
          "<p>We've secured a group rate at the hotel below.</p>" +
          "<p>The two hotels are connected, so you can travel between them by hotel buggy car.</p>" +
          "<div class='wt-rate'>" +
            "<div class='wt-hotelrow'><a class='wt-link' href='https://www.marriott.com/en-us/hotels/lgkxr-the-st-regis-langkawi/overview/' target='_blank' rel='noopener'>St. Regis</a><span class='wt-off'>66% off!</span></div>" +
            "<div class='wt-prices'><span class='wt-was'>RM3,500</span><span class='wt-now'>RM1,200</span><span class='wt-per'>/night</span></div>" +
            "<div class='wt-room'>Guest room</div>" +
          "</div>" +
          "<div class='wt-rate'>" +
            "<div class='wt-hotelrow'><a class='wt-link' href='https://www.marriott.com/en-us/hotels/lgkwi-the-westin-langkawi-resort-and-spa/overview/' target='_blank' rel='noopener'>Westin</a><span class='wt-off'>45% off!</span></div>" +
            "<div class='wt-prices'><span class='wt-was'>RM1,235</span><span class='wt-now'>RM680</span><span class='wt-per'>/night</span></div>" +
            "<div class='wt-room'>Standard room</div>" +
          "</div>" +
          "<p class='wt-note'>Group rates are available at both hotels (10–16 Feb).</p>" +
          "<p class='wt-note'>Other room types are also available at a discounted rate.</p>",
      },
      {
        icon: '<path d="M8 4 12 6 16 4"/><path d="M8 4 10 12 6 21h12l-4-9 2-8"/><path d="M10 12h4"/>',
        bg: "#9fc0d6", title: "Dress code",
        html:
          "<p><strong>Formal</strong> Dress to impress!</p>" +
          "<div class='wt-dress'>" +
            "<div class='wt-dress-row'><strong>Gents:</strong> Black suits <span class='wt-swatch' style='background:#1c1c1c'></span></div>" +
            "<div class='wt-dress-row'><strong>Ladies:</strong> Beige <span class='wt-swatch' style='background:#e0cba8'></span> or brown <span class='wt-swatch' style='background:#8a6d4b'></span></div>" +
          "</div>",
      },
      {
        icon: '<path d="M3 11h13V6A8 8 0 0 0 3 11Z"/><path d="M3 11l3 6h7l3-6"/><path d="M16 6c3 0 5 1.5 6 4"/><circle cx="7" cy="20" r="2"/><circle cx="13" cy="20" r="2"/>',
        bg: "#c9d18a", title: "Kids",
        html:
          "<p>We've planned the day as a grown-ups-only celebration, so we gently ask to keep it kids-free, but we totally get that it's not always possible! If your little ones come along, we'll help you sort out a babysitter for the day: BYOM (Bring Your Own Mum, or maid!), or the hotel's childcare service for ages 4–12. They're in good hands, and you get to enjoy the night.</p>",
      },
    ];

    var wrap = document.createElement("div");
    wrap.id = "wedTravel";
    cards.forEach(function (c) {
      var card = document.createElement("article");
      card.className = "wt-card";
      card.style.setProperty("--wt-bg", c.bg);
      card.style.setProperty("--wt-icon", iconMask(c.icon));
      card.innerHTML =
        '<div class="wt-icon"><span class="wt-glyph" aria-hidden="true"></span></div>' +
        "<h3>" + c.title + "</h3>" + c.html;
      wrap.appendChild(card);
    });
    // drag-to-scroll for the travel cards (mouse; touch uses native pan-x)
    var tDown = false, tStartX = 0, tStartScroll = 0;
    wrap.addEventListener("mousedown", function (e) { tDown = true; tStartX = e.pageX; tStartScroll = wrap.scrollLeft; wrap.style.cursor = "grabbing"; });
    window.addEventListener("mousemove", function (e) { if (!tDown) return; e.preventDefault(); wrap.scrollLeft = tStartScroll - (e.pageX - tStartX); });
    window.addEventListener("mouseup", function () { tDown = false; wrap.style.cursor = ""; });
    section.appendChild(wrap);
    var tHint = document.createElement("p");
    tHint.id = "wedTravelHint";
    tHint.textContent = "\u2190 Drag \u2192";
    section.appendChild(tHint);
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
      dt.placeholder = "Dietary restrictions";
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
    var dietary = form.querySelector('[name="Dietary restrictions"]');
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
        // single-select: radio buttons (St. Regis / Westin / No)
        var setHotel = function (label, value) {
          var inp = label.querySelector("input");
          if (inp) { inp.type = "radio"; inp.name = "Hotel"; inp.setAttribute("value", value); inp.checked = false; inp.removeAttribute("checked"); }
          var lp = label.querySelector("p");
          if (lp) lp.textContent = value;
        };
        setHotel(tmpl, "The St. Regis Langkawi");
        var westin = tmpl.cloneNode(true);
        setHotel(westin, "The Westin Langkawi");
        hbox.appendChild(westin);
        var noOpt = tmpl.cloneNode(true);
        setHotel(noOpt, "No / staying elsewhere");
        hbox.appendChild(noOpt);
        hotelGroup.id = "wedHotelGroup";
        var note = document.createElement("p");
        note.textContent = "We've negotiated group rates at both. Select where you'd like to stay and we'll email you a reservation link once the hotel sends it through.";
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
        ? "Yay, your RSVP is in! We can't wait to celebrate with you in Langkawi."
        : "Hmm, that didn't send. Please try again, or message us directly.";
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
      { q: "Can I stay anywhere else besides St Regis and Westin?",
        a: "Absolutely! We've recommended St. Regis and Westin (with group rates) because that's where we'll be staying, but feel free to pick your own spot." },
      { q: "Any tips on booking flights?",
        a: "Book early! Fares only climb the closer we get, so grab yours sooner rather than later, future-you will thank you." },
    ];

    var wrap = document.createElement("div");
    wrap.id = "wedFaq";
    var h = document.createElement("h3");
    h.textContent = "Questions? We've got you";
    wrap.appendChild(h);
    items.forEach(function (it) {
      var d = document.createElement("div"); d.className = "faq-item";
      var q = document.createElement("p"); q.className = "faq-q"; q.textContent = it.q;
      var a = document.createElement("p"); a.className = "faq-a"; a.textContent = it.a;
      d.appendChild(q); d.appendChild(a); wrap.appendChild(d);
    });
    section.appendChild(wrap);
  }

  // "What awaits us" — replace the order-of-events card carousel with a vertical
  // timeline (text + agenda only), with a scroll-driven heart and per-day reveal.
  function buildEvents() {
    var section = document.querySelector('[data-framer-name="itinerary"]');
    if (!section || document.getElementById("wedTimeline")) return;

    // hide Framer's original card carousel; keep the "The order of events" heading
    var firstCard = section.querySelector('[data-framer-name="card"]');
    var cardsBlock = firstCard ? firstCard.closest('[data-framer-name="content"]') : null;
    if (cardsBlock) cardsBlock.style.display = "none";

    var HEART = '<svg viewBox="0 0 24 24"><path d="M12 20.3 4.6 12.9C2.2 10.5 2.2 6.8 4.6 4.6 6.8 2.6 10 3 12 5.2 14 3 17.2 2.6 19.4 4.6 21.8 6.8 21.8 10.5 19.4 12.9Z"/></svg>';

    var DAYS = [
      {
        date: "Friday, Feb 12th",
        intro: "We are planning a welcome dinner for those who arrive this day, so come kick off the celebration with us!",
        sched: [["3:00pm", "Guest check-in at the hotel/resort"], ["5:30pm", "Welcome dinner & more (TBD)"]],
      },
      {
        date: "Saturday, Feb 13th",
        intro: "The big day! We can’t wait to share our vows with all of you, laugh, cry, and celebrate together. After the ceremony, there will be drinks, photos, and an after party. Tonight is all about love, joy, and making memories — we’re so glad you’ll be a part of it.",
        sched: [["4:00pm", "Ceremony"], ["5:30pm", "Cocktail hour & photos"], ["7:00pm", "Reception: dinner and after party"]],
      },
      {
        date: "Sunday, Feb 14th",
        intro: "Let's have breakfast together for those who stay at St. Regis and can wake up. Checkout is at 12:00pm.",
        sched: [],
      },
    ];

    var tl = document.createElement("div");
    tl.id = "wedTimeline";
    tl.innerHTML = '<div class="tl-line"><div class="tl-fill"></div></div><div class="tl-heart">' + HEART + "</div>";

    DAYS.forEach(function (d, i) {
      var day = document.createElement("div");
      day.className = "tl-day " + (i % 2 ? "tl-right" : "tl-left");
      var sched = d.sched.map(function (r) {
        return '<li><span class="tl-time">' + r[0] + "</span> — " + r[1] + "</li>";
      }).join("");
      day.innerHTML =
        '<span class="tl-node"></span>' +
        '<div class="tl-card">' +
          "<h3>" + d.date + "</h3>" +
          '<p class="tl-intro">' + d.intro + "</p>" +
          '<ul class="tl-sched">' + sched + "</ul>" +
        "</div>";
      tl.appendChild(day);
    });

    var host = cardsBlock ? cardsBlock.parentElement : section;
    host.appendChild(tl);

    // colored line "draws" + heart travels down as you scroll through the section
    var line = tl.querySelector(".tl-line");
    var fill = tl.querySelector(".tl-fill");
    var heart = tl.querySelector(".tl-heart");
    var ticking = false;
    function update() {
      ticking = false;
      var r = line.getBoundingClientRect();
      var p = window.innerHeight * 0.55 - r.top;
      p = Math.max(0, Math.min(r.height, p));
      fill.style.height = p + "px";
      heart.style.top = p + "px";
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    // reveal each day (card + node) as it enters the viewport
    var days = tl.querySelectorAll(".tl-day");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
      }, { threshold: 0.25 });
      Array.prototype.forEach.call(days, function (d) { io.observe(d); });
    } else {
      Array.prototype.forEach.call(days, function (d) { d.classList.add("is-in"); });
    }
  }

  function run() { build(); buildTravel(); buildEvents(); buildFaq(); enhanceRsvp(); }
  if (document.readyState !== "loading") run();
  else document.addEventListener("DOMContentLoaded", run);
})();
