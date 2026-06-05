/* ===== Local photo loader =====
   Each photo slot ships with an on-brand fallback (illustration / gradient).
   If the matching file exists in /images, it loads and replaces the fallback;
   otherwise the fallback stays. Drop files into /images to use real photos. */
(() => {
  document.querySelectorAll("img.hero__photo, .gcell > img, .eframe > img").forEach((img) => {
    img.addEventListener("load", () => {
      if (!img.naturalWidth) return;
      img.hidden = false;
      const fb = img.classList.contains("hero__photo")
        ? img.parentElement.querySelector(".hero__svg")
        : img.nextElementSibling; // the .ph fallback
      if (fb) fb.style.display = "none";
    });
    // re-trigger load now that the listener is attached (src is set in HTML)
    if (img.complete && img.naturalWidth) img.dispatchEvent(new Event("load"));
  });
})();

/* ===== Scroll reveal ===== */
// rise (translateY) — for elements without their own transform
const riseSel = [
  ".story__cols", ".event", ".honeymoon__text", ".rsvp__deadline",
  ".rsvp__form", ".cake__layout", ".cake__sub",
];
// slide-in from left — the big cursive section headings
const leftSel = [
  ".story__title", ".details__title", ".events__title",
  ".travel__title", ".rsvp__title", ".cake__title",
];
// fade-only — preserves rotate()/translate() layout transforms
const fadeSel = [".gallery", ".dcard"];
document.querySelectorAll(riseSel.join(",")).forEach((el) => el.classList.add("reveal"));
document.querySelectorAll(leftSel.join(",")).forEach((el) => el.classList.add("reveal-left"));
document.querySelectorAll(fadeSel.join(",")).forEach((el) => el.classList.add("reveal-fade"));
const io = new IntersectionObserver(
  (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } }),
  { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
);
document.querySelectorAll(".reveal, .reveal-left, .reveal-fade").forEach((el) => io.observe(el));

/* ===== Travel marquee: duplicate cards for a seamless loop ===== */
(() => {
  const track = document.getElementById("travelTrack");
  if (!track) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) { track.style.animation = "none"; return; }
  // clone the original set once so translateX(-50%) wraps seamlessly
  track.querySelectorAll(".travel__card").forEach((card) => {
    const c = card.cloneNode(true);
    c.setAttribute("aria-hidden", "true");
    track.appendChild(c);
  });
})();

/* ===== Draggable photo gallery ===== */
(() => {
  const wrap = document.getElementById("gallery");
  const track = document.getElementById("galleryTrack");
  let down = false, startX = 0, startScroll = 0;
  const start = (x) => { down = true; startX = x; startScroll = track.scrollLeft; wrap.classList.add("is-dragging"); };
  const move = (x) => { if (!down) return; track.scrollLeft = startScroll - (x - startX); };
  const end = () => { down = false; wrap.classList.remove("is-dragging"); };
  wrap.addEventListener("mousedown", (e) => start(e.pageX));
  window.addEventListener("mousemove", (e) => move(e.pageX));
  window.addEventListener("mouseup", end);
  wrap.addEventListener("touchstart", (e) => start(e.touches[0].pageX), { passive: true });
  wrap.addEventListener("touchmove", (e) => move(e.touches[0].pageX), { passive: true });
  wrap.addEventListener("touchend", end);
})();

/* ===== RSVP form ===== */
(() => {
  const form = document.getElementById("rsvpForm");
  const toggle = document.getElementById("attendToggle");
  const thanks = document.getElementById("rsvpThanks");
  let attending = "yes";
  toggle.addEventListener("click", (e) => {
    const b = e.target.closest(".toggle__opt");
    if (!b) return;
    toggle.querySelectorAll(".toggle__opt").forEach((o) => o.classList.remove("is-active"));
    b.classList.add("is-active");
    attending = b.dataset.val;
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    if (!name || !email) { form.reportValidity(); return; }
    const first = name.split(" ")[0];
    thanks.hidden = false;
    thanks.textContent = attending === "yes"
      ? `Yay, ${first}! Your RSVP is in — we can’t wait to celebrate with you. 🥂`
      : `Thanks for letting us know, ${first}. We’ll miss you, but we understand. 💌`;
    thanks.scrollIntoView({ behavior: "smooth", block: "center" });
  });
})();

/* ===== Interactive cake ===== */
(() => {
  const svg = document.getElementById("cakeSvg");
  const NS = "http://www.w3.org/2000/svg";
  const state = { base: "#f7f1de", decoColor: "#4d2008", deco: "swag", top: "flower" };

  // tier geometry: [x, y, width, height]
  const tiers = [
    { x: 110, y: 70,  w: 120, h: 70 },  // top
    { x: 85,  y: 150, w: 170, h: 80 },  // middle
    { x: 55,  y: 240, w: 230, h: 90 },  // bottom
  ];

  const el = (tag, attrs) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  };

  const swag = (t) => {
    // scalloped loops hanging just below each tier's top edge
    const loops = Math.max(2, Math.round(t.w / 38));
    const span = t.w / loops;
    let d = `M ${t.x} ${t.y + 14}`;
    for (let i = 0; i < loops; i++) {
      const x0 = t.x + i * span;
      d += ` Q ${x0 + span / 2} ${t.y + 14 + span * 0.5} ${x0 + span} ${t.y + 14}`;
    }
    return el("path", { d, fill: "none", stroke: state.decoColor, "stroke-width": 4, "stroke-linecap": "round" });
  };

  const drip = (t) => {
    const drips = Math.max(3, Math.round(t.w / 26));
    const span = t.w / drips;
    let d = `M ${t.x} ${t.y} L ${t.x + t.w} ${t.y} L ${t.x + t.w} ${t.y + 6}`;
    for (let i = drips; i >= 0; i--) {
      const x = t.x + i * span;
      const depth = 10 + (i % 2) * 12;
      d += ` Q ${x - span * 0.25} ${t.y + depth} ${x - span / 2} ${t.y + 4} Q ${x - span * 0.75} ${t.y + depth} ${x - span} ${t.y + 6}`;
    }
    d += " Z";
    return el("path", { d, fill: state.decoColor });
  };

  const bumps = (t) => {
    const g = el("g", {});
    const n = Math.max(3, Math.round(t.w / 30));
    const span = t.w / n;
    for (let i = 0; i < n; i++) {
      g.appendChild(el("circle", { cx: t.x + span / 2 + i * span, cy: t.y + t.h, r: span / 2.4, fill: state.decoColor }));
    }
    return g;
  };

  const toppingNode = (cx, cy) => {
    if (state.top === "none") return null;
    const map = { flower: "🌼", berry: "🍓", cherry: "🍒" };
    const txt = el("text", { x: cx, y: cy, "font-size": 22, "text-anchor": "middle", "dominant-baseline": "central" });
    txt.textContent = map[state.top];
    return txt;
  };

  const render = () => {
    svg.innerHTML = "";
    // plate
    svg.appendChild(el("ellipse", { cx: 170, cy: 345, rx: 145, ry: 16, fill: "#e7d8bf" }));
    // tiers
    tiers.forEach((t) => {
      svg.appendChild(el("rect", {
        x: t.x, y: t.y, width: t.w, height: t.h, rx: 8,
        fill: state.base, stroke: "rgba(77,32,8,.28)", "stroke-width": 1.5,
      }));
    });
    // decorations per tier
    tiers.forEach((t) => {
      let node;
      if (state.deco === "swag") node = swag(t);
      else if (state.deco === "drip") node = drip(t);
      else node = bumps(t);
      svg.appendChild(node);
    });
    // toppings scattered across tiers
    if (state.top !== "none") {
      const spots = [
        [150, 92], [205, 96],
        [110, 175], [175, 188], [235, 172],
        [90, 268], [150, 285], [210, 270], [270, 285], [180, 312],
      ];
      spots.forEach(([cx, cy]) => { const n = toppingNode(cx, cy); if (n) svg.appendChild(n); });
    }
    svg.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.02)" }, { transform: "scale(1)" }],
      { duration: 280, easing: "cubic-bezier(.22,.61,.36,1)" }
    );
  };

  const wire = (id, key, attr) => {
    const c = document.getElementById(id);
    c.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      c.querySelectorAll("button").forEach((x) => x.classList.remove("is-active"));
      b.classList.add("is-active");
      state[key] = b.dataset[attr];
      render();
    });
  };
  wire("baseColors", "base", "base");
  wire("decoColors", "decoColor", "decoColor");
  wire("decoTypes", "deco", "deco");
  wire("toppings", "top", "top");
  render();
})();
