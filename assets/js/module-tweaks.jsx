// Brand-only Tweaks for module/lesson pages.
// Lighter panel than the home — exposes Accent color + Heading font.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#d95c41",
  "headingFont": "Inter"
}/*EDITMODE-END*/;

const ACCENT_PRESETS = {
  "#d95c41": { soft: "#fbe9e2", tint: "#fff5f1" },   // Coral (default)
  "#2b6cb0": { soft: "#dbe7f5", tint: "#eff5fb" },   // Steel blue
  "#1f8a5b": { soft: "#d3ead9", tint: "#eef6ef" },   // Forest green
  "#7a4ab8": { soft: "#e2d6f1", tint: "#f3edfa" },   // Purple
  "#222222": { soft: "#dcdcdc", tint: "#f4f4f3" },   // Monochrome
};

const FONT_OPTIONS = ["Inter", "IBM Plex Sans", "Source Serif Pro"];
const FONT_GOOGLE = {
  "Inter": "Inter:wght@400;500;600;700;800",
  "IBM Plex Sans": "IBM+Plex+Sans:wght@400;500;600;700",
  "Source Serif Pro": "Source+Serif+Pro:wght@400;600;700",
};

function applyAccent(hex) {
  const preset = ACCENT_PRESETS[hex] || { soft: hex + "33", tint: hex + "1A" };
  const r = document.documentElement.style;
  r.setProperty('--accent', hex);
  r.setProperty('--accent-soft', preset.soft);
  r.setProperty('--accent-tint', preset.tint);
  document.querySelectorAll('.brand-glyph').forEach(svg => {
    svg.setAttribute('stroke', hex);
    svg.querySelectorAll('[fill]').forEach(el => {
      if (el.getAttribute('fill') !== 'none') el.setAttribute('fill', hex);
    });
  });
}

function loadFont(family) {
  if (document.querySelector(`link[data-font="${family}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.dataset.font = family;
  link.href = `https://fonts.googleapis.com/css2?family=${FONT_GOOGLE[family]}&display=swap`;
  document.head.appendChild(link);
}

function applyFont(family) {
  loadFont(family);
  document.documentElement.style.setProperty(
    '--font',
    `'${family}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
  );
}

function ModuleTweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => { applyAccent(t.accent); }, [t.accent]);
  React.useEffect(() => { applyFont(t.headingFont); }, [t.headingFont]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Brand" />
      <TweakColor
        label="Accent"
        value={t.accent}
        options={Object.keys(ACCENT_PRESETS)}
        onChange={(v) => setTweak('accent', v)}
      />
      <TweakSelect
        label="Heading font"
        value={t.headingFont}
        options={FONT_OPTIONS}
        onChange={(v) => setTweak('headingFont', v)}
      />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<ModuleTweaksApp />);
