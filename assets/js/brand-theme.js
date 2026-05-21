/* ============================================================
   Claude Architect — Live Brand Theme
   Accent (5 swatches) + Heading font (3 options)
   Persists to localStorage, syncs brand-glyph SVG live
   ============================================================ */
(function () {
  'use strict';

  const ACCENTS = {
    coral:  { label: 'Coral',  hex: '#d95c41', hover: '#c14a30', soft: 'rgba(217,92,65,.13)', tint: '#fff5f1' },
    steel:  { label: 'Steel',  hex: '#2563eb', hover: '#1d4ed8', soft: 'rgba(37,99,235,.12)',  tint: '#eff6ff' },
    forest: { label: 'Forest', hex: '#16a34a', hover: '#15803d', soft: 'rgba(22,163,74,.12)',  tint: '#f0fdf4' },
    purple: { label: 'Purple', hex: '#7c3aed', hover: '#6d28d9', soft: 'rgba(124,58,237,.12)', tint: '#faf5ff' },
    mono:   { label: 'Mono',   hex: '#374151', hover: '#1f2937', soft: 'rgba(55,65,81,.10)',   tint: '#f8fafc' },
  };

  const FONTS = {
    inter:       { label: 'Inter',          stack: "'Inter', -apple-system, sans-serif",        url: null },
    ibmplex:     { label: 'IBM Plex Sans',  stack: "'IBM Plex Sans', 'Inter', sans-serif",       url: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap' },
    sourceserif: { label: 'Source Serif',   stack: "'Source Serif Pro', Georgia, serif",         url: 'https://fonts.googleapis.com/css2?family=Source+Serif+Pro:ital,wght@0,400;0,600;0,700;1,400&display=swap' },
  };

  /* ── Apply accent ─────────────────────────────────────────── */
  function applyAccent(key) {
    const a = ACCENTS[key];
    if (!a) return;
    const root = document.documentElement;
    root.style.setProperty('--accent',       a.hex);
    root.style.setProperty('--accent-hover', a.hover);
    root.style.setProperty('--accent-soft',  a.soft);
    root.style.setProperty('--accent-tint',  a.tint);
    root.style.setProperty('--sidebar-active', a.hex);
    root.style.setProperty('--sidebar-active-bg', a.tint);

    /* Re-stroke all brand glyphs */
    document.querySelectorAll('.brand-glyph').forEach(svg => {
      svg.style.color = a.hex;
    });

    localStorage.setItem('ca-accent', key);

    document.querySelectorAll('[data-accent]').forEach(el => {
      el.classList.toggle('bp-active', el.dataset.accent === key);
      el.setAttribute('aria-pressed', el.dataset.accent === key ? 'true' : 'false');
    });
  }

  /* ── Apply font ───────────────────────────────────────────── */
  function applyFont(key) {
    const f = FONTS[key];
    if (!f) return;
    if (f.url && !document.querySelector(`link[data-ca-font="${key}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet'; link.href = f.url;
      link.dataset.caFont = key;
      document.head.appendChild(link);
    }
    document.documentElement.style.setProperty('--font', f.stack);
    localStorage.setItem('ca-font', key);
    document.querySelectorAll('[data-font]').forEach(el => {
      el.classList.toggle('bp-active', el.dataset.font === key);
      el.setAttribute('aria-pressed', el.dataset.font === key ? 'true' : 'false');
    });
  }

  /* ── Build panel HTML ─────────────────────────────────────── */
  function buildPanel() {
    const topbarRight = document.querySelector('.topbar-right');
    if (!topbarRight) return;

    const wrap = document.createElement('div');
    wrap.className = 'bp-wrap';
    wrap.setAttribute('aria-label', 'Brand theme controls');

    const accentSwatches = Object.entries(ACCENTS).map(([key, a]) =>
      `<button class="bp-swatch" data-accent="${key}" title="${a.label}" aria-label="${a.label}" aria-pressed="false"
         style="--sw-color:${a.hex};"></button>`
    ).join('');

    const fontBtns = Object.entries(FONTS).map(([key, f]) =>
      `<button class="bp-font-btn" data-font="${key}" aria-pressed="false">${f.label}</button>`
    ).join('');

    wrap.innerHTML = `
      <button class="bp-trigger" aria-haspopup="true" aria-expanded="false" title="Customize brand">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true">
          <circle cx="7" cy="7" r="2.4"/>
          <line x1="7" y1="0.5" x2="7" y2="2.5"/>
          <line x1="7" y1="11.5" x2="7" y2="13.5"/>
          <line x1="0.5" y1="7" x2="2.5" y2="7"/>
          <line x1="11.5" y1="7" x2="13.5" y2="7"/>
          <line x1="2.4" y1="2.4" x2="3.8" y2="3.8"/>
          <line x1="10.2" y1="10.2" x2="11.6" y2="11.6"/>
          <line x1="11.6" y1="2.4" x2="10.2" y2="3.8"/>
          <line x1="3.8" y1="10.2" x2="2.4" y2="11.6"/>
        </svg>
        <span>Brand</span>
      </button>
      <div class="bp-panel" role="dialog" aria-label="Theme panel" hidden>
        <div class="bp-section">
          <div class="bp-label">Accent</div>
          <div class="bp-swatches">${accentSwatches}</div>
        </div>
        <div class="bp-divider"></div>
        <div class="bp-section">
          <div class="bp-label">Heading font</div>
          <div class="bp-fonts">${fontBtns}</div>
        </div>
      </div>`;

    topbarRight.prepend(wrap);

    const trigger = wrap.querySelector('.bp-trigger');
    const panel   = wrap.querySelector('.bp-panel');

    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const open = !panel.hidden;
      panel.hidden = open;
      trigger.setAttribute('aria-expanded', String(!open));
    });

    document.addEventListener('click', () => {
      if (!panel.hidden) { panel.hidden = true; trigger.setAttribute('aria-expanded','false'); }
    });
    panel.addEventListener('click', e => e.stopPropagation());

    wrap.querySelectorAll('[data-accent]').forEach(btn =>
      btn.addEventListener('click', () => applyAccent(btn.dataset.accent)));
    wrap.querySelectorAll('[data-font]').forEach(btn =>
      btn.addEventListener('click', () => applyFont(btn.dataset.font)));
  }

  /* ── Restore saved preferences ────────────────────────────── */
  function restore() {
    applyAccent(localStorage.getItem('ca-accent') || 'coral');
    applyFont(localStorage.getItem('ca-font')   || 'inter');
  }

  /* ── Eagerly apply saved accent (prevents flash) ──────────── */
  (function earlyAccent() {
    const key = localStorage.getItem('ca-accent') || 'coral';
    const a   = ACCENTS[key];
    if (!a) return;
    const root = document.documentElement;
    root.style.setProperty('--accent',       a.hex);
    root.style.setProperty('--accent-hover', a.hover);
    root.style.setProperty('--accent-soft',  a.soft);
    root.style.setProperty('--accent-tint',  a.tint);
  })();

  document.addEventListener('DOMContentLoaded', () => {
    buildPanel();
    restore();
  });

})();
