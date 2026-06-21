/* ============================================
   Jimmy Emiliano Corzo — Batalla de Talentos SENA
   script.js — mejoras de interacción
   Sin librerías externas. Respeta prefers-reduced-motion.
   ============================================ */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Barra de progreso de lectura ---------- */
  function initProgressBar() {
    var bar = document.createElement('div');
    bar.className = 'reading-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    function update() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + '%';
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  /* ---------- 2. Resaltar sección activa en el nav ---------- */
  function initActiveNav() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav-acts a'));
    if (!links.length) return;

    var sections = links
      .map(function (link) {
        var id = link.getAttribute('href');
        return id ? document.querySelector(id) : null;
      })
      .filter(Boolean);

    if (!sections.length || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = links.find(function (l) {
            return l.getAttribute('href') === '#' + entry.target.id;
          });
          if (!link) return;
          if (entry.isIntersecting) {
            links.forEach(function (l) { l.classList.remove('is-active'); });
            link.classList.add('is-active');
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---------- 3. Aparición suave de cada acto al hacer scroll ---------- */
  function initRevealOnScroll() {
    var acts = document.querySelectorAll('.act');
    if (!acts.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      acts.forEach(function (a) { a.classList.add('is-visible'); });
      return;
    }

    acts.forEach(function (a) { a.classList.add('reveal'); });

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    acts.forEach(function (a) { observer.observe(a); });
  }

  /* ---------- 4. Pequeño efecto al revelar los chips de resultado ---------- */
  function initResultChips() {
    var chips = document.querySelectorAll('.result-chip');
    if (!chips.length || reduceMotion || !('IntersectionObserver' in window)) return;

    chips.forEach(function (c) { c.classList.add('chip-pending'); });

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('chip-pop');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );

    chips.forEach(function (c) { observer.observe(c); });
  }

  /* ---------- 5. Scroll suave al hacer clic en el nav (fallback además del CSS) ---------- */
  function initSmoothNav() {
    document.querySelectorAll('.nav-acts a').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href');
        var target = id ? document.querySelector(id) : null;
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        history.pushState(null, '', id);
      });
    });
  }

  function init() {
    initProgressBar();
    initActiveNav();
    initRevealOnScroll();
    initResultChips();
    initSmoothNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
