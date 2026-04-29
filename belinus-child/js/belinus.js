// belinus.js — Belinus child theme JS bundle
// No jQuery. All IIFE. Progressive enhancement.
(function () {
  'use strict';

  /* ====================================================================
   * 0. UTILITIES
   * ==================================================================== */

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [].slice.call(ctx.querySelectorAll(sel));

  /* ====================================================================
   * 1. NAV — scroll-triggered backdrop + link colour
   * ==================================================================== */

  const initNav = () => {
    const nav = $('header.et-l--header');
    if (!nav) return;

    const onScroll = () => {
      const y = window.scrollY;
      nav.classList.toggle('scrolled', y > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  };

  /* ====================================================================
   * 2. MOBILE DRAWER — hamburger toggle
   * ==================================================================== */

  const initMobileDrawer = () => {
    const toggle = $('.mobile-menu-toggle');
    const drawer = $('.belinus-mobile-nav');
    if (!toggle || !drawer) return;

    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      drawer.hidden = open;
      document.body.classList.toggle('nav-open', !open);
    });

    $$('a', drawer).forEach((a) =>
      a.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        drawer.hidden = true;
        document.body.classList.remove('nav-open');
      })
    );
  };

  /* ====================================================================
   * 3. ACCORDION — specs section
   * ==================================================================== */

  const initAccordion = () => {
    const items = $$('.bl-accordion__item');
    if (!items.length) return;

    items.forEach((item) => {
      const trigger = $('.bl-accordion__trigger', item);
      const panel = $('.bl-accordion__panel', item);
      if (!trigger || !panel) return;

      trigger.addEventListener('click', () => {
        const expanded = trigger.getAttribute('aria-expanded') === 'true';
        // Close all others
        items.forEach((other) => {
          const oTrig = $('.bl-accordion__trigger', other);
          const oPanel = $('.bl-accordion__panel', other);
          if (oTrig) oTrig.setAttribute('aria-expanded', 'false');
          if (oPanel) oPanel.hidden = true;
        });
        if (!expanded) {
          trigger.setAttribute('aria-expanded', 'true');
          panel.hidden = false;
        }
      });
    });
  };

  /* ====================================================================
   * 4. STAT COUNTERS — animate numbers on scroll into view
   * ==================================================================== */

  const initStatCounters = () => {
    const counters = $$('.bl-stat-counter');
    if (!counters.length) return;

    const fmt = new Intl.NumberFormat(BELINUS.locale || 'en-EU', {
      maximumFractionDigits: 1,
    });

    const animate = (el) => {
      const raw = el.dataset.value || '0';
      const num = parseFloat(raw);
      const isPct = raw.endsWith('%');
      const isPlus = raw.endsWith('+');
      let current = 0;
      const step = num / 60;
      const tick = () => {
        current = Math.min(current + step, num);
        el.textContent =
          (isPct ? '' : isPlus ? '+' : '') +
          fmt.format(current) +
          (isPct ? '%' : '');
        if (current < num) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animate(e.target);
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => observer.observe(c));
  };

  /* ====================================================================
   * 5. ROI CALCULATOR — EUR Intl.NumberFormat, slider bindings
   * ==================================================================== */

  const initRoiCalculator = () => {
    const root = $('.bl-roi-calculator');
    if (!root) return;

    const out = root.querySelector('[data-out]');
    const sliders = root.querySelectorAll('.bl-roi-slider');
    const eurFmt = new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    });

    const calc = () => {
      let peak = 0;
      sliders.forEach((s) => {
        peak += parseFloat(s.value || 0);
      });
      const bill = peak * 0.22 * 365;
      if (out) out.textContent = eurFmt.format(bill);
    };

    sliders.forEach((s) => s.addEventListener('input', calc, { passive: true }));
    calc();
  };

  /* ====================================================================
   * 6. INTERSECTION OBSERVER — reveal .bl-reveal-up / .bl-stagger
   *    Motion.page targets these same classes; belinus.js only adds
   *    the class so Motion.page can pick it up (or JS fallback works).
   * ==================================================================== */

  const initReveal = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = $$('.bl-reveal-up, .bl-stagger');
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    targets.forEach((el) => observer.observe(el));
  };

  /* ====================================================================
   * 7. Chatwoot chat-open links — any [data-chatwoot-open] anchor opens
   *    the widget instead of navigating. Inline onclick handlers were
   *    stripped by the page builder's security filter, so we wire them here.
   * ==================================================================== */

  const initChatwootLinks = () => {
    const links = $$('[data-chatwoot-open]');
    if (!links.length) return;
    links.forEach((el) => {
      el.addEventListener('click', (e) => {
        if (window.chatwootSDK && typeof window.chatwootSDK.toggle === 'function') {
          e.preventDefault();
          window.chatwootSDK.toggle();
        }
      });
    });
  };

  /* ====================================================================
   * 8. CAL.COM SKELETON — replace placeholder with real embed if slug set
   * ==================================================================== */

  const initCalCom = () => {
    const slug = BELINUS.calcomSlug;
    if (!slug) return;

    const target = $('#calcom-embed');
    if (!target) return;

    // Simple skeleton swap — Cal's JS reads this element
    target.innerHTML =
      '<div style="min-height:600px;display:flex;align-items:center;justify-content:center;">' +
      '<p style="color:#888;">Loading calendar…</p></div>';

    // Cal.com inline embed pattern
    if (window.Cal && window.Cal.ns && window.Cal.ns[slug]) {
      window.Cal.ns[slug]('show', { layout: 'month_view' });
    }
  };

  /* ====================================================================
   * INIT
   * ==================================================================== */

  const init = () => {
    initNav();
    initMobileDrawer();
    initAccordion();
    initStatCounters();
    initRoiCalculator();
    initReveal();
    initChatwootLinks();
    initCalCom();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
