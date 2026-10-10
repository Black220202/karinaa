/* =========================================================
   Studio KJ26 — interactions
   ========================================================= */
(function () {
  "use strict";

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

  /* ---------- current year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- hero reveal on load ---------- */
  const reveal = () => document.body.classList.add("is-loaded");
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(reveal);
    window.setTimeout(reveal, 700);
  } else {
    window.addEventListener("load", reveal);
  }

  /* ---------- into-view + scale-in ---------- */
  const animated = $$(".reveal, .scale-in");
  if ("IntersectionObserver" in window && animated.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );
    animated.forEach((el) => io.observe(el));
  } else {
    animated.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- parallax ---------- */
  const parallaxEls = $$(".paralax-slow, .paralax-fast");
  let ticking = false;
  function updateParallax() {
    const vh = window.innerHeight;
    parallaxEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > vh + 200) return;
      const fast = el.classList.contains("paralax-fast");
      const speed = fast ? 0.12 : 0.05;
      const center = rect.top + rect.height / 2 - vh / 2;
      const offset = clamp(-center * speed, -80, 80);
      el.style.translate = "0 " + offset.toFixed(1) + "px";
    });
    ticking = false;
  }
  function onScrollParallax() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateParallax);
    }
  }
  if (parallaxEls.length) {
    window.addEventListener("scroll", onScrollParallax, { passive: true });
    window.addEventListener("resize", onScrollParallax);
    updateParallax();
  }

  /* ---------- navbar theme over dark sections ---------- */
  const navbar = $(".navbar");
  const darkSections = $$(".on-dark");
  function updateNavTheme() {
    if (!navbar) return;
    const probe = 48;
    let overDark = false;
    darkSections.forEach((sec) => {
      const r = sec.getBoundingClientRect();
      if (r.top <= probe && r.bottom >= probe) overDark = true;
    });
    navbar.classList.toggle("on-dark", overDark);
  }
  window.addEventListener("scroll", updateNavTheme, { passive: true });
  updateNavTheme();

  /* ---------- menu panel ---------- */
  const toggle = $("#nav-toggle");
  const panel = $("#nav-menu");
  function closeMenu() {
    if (!panel || !toggle) return;
    panel.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    document.body.style.overflow = "";
  }
  if (toggle && panel) {
    toggle.addEventListener("click", () => {
      const open = !panel.classList.contains("is-open");
      panel.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";
    });
    $$("a", panel).forEach((a) => a.addEventListener("click", closeMenu));
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- testimonial slider ---------- */
  const slides = $$(".testimonial-slide");
  const numberEl = $("#testimonial-number");
  let index = 0;
  if (slides.length) {
    const pad = (n) => String(n).padStart(2, "0");
    const setActive = (i) => {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle("is-active", k === index));
      if (numberEl) numberEl.textContent = pad(index + 1) + " — " + pad(slides.length);
    };
    const prev = $("#prev-testimonial");
    const next = $("#next-testimonial");
    if (prev) prev.addEventListener("click", () => setActive(index - 1));
    if (next) next.addEventListener("click", () => setActive(index + 1));
    setActive(0);
  }
})();
