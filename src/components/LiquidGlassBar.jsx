import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

export default function LiquidGlassBar({
  categories,
  activeCategory,
  onSelect,
  counts = {},
  glassEnabled = true,
}) {
  const trackRef = useRef(null);
  const btnRefs = useRef({});
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });

  function updatePill() {
    const track = trackRef.current;
    const activeBtn = btnRefs.current[activeCategory];
    if (!track || !activeBtn) return;

    const left = activeBtn.offsetLeft;
    const width = activeBtn.offsetWidth;
    setPillStyle({ left, width, opacity: 1 });

    // Smoothly scroll active button into view if horizontal overflow
    const trackRect = track.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    if (btnRect.left < trackRect.left + 12 || btnRect.right > trackRect.right - 12) {
      activeBtn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }

  useLayoutEffect(() => {
    updatePill();
  }, [activeCategory, categories]);

  useEffect(() => {
    window.addEventListener("resize", updatePill);
    return () => window.removeEventListener("resize", updatePill);
  }, [activeCategory]);

  return (
    <div className={`liquid-glass-shell ${glassEnabled ? "glass-on" : "glass-classic"}`}>
      <div className="liquid-glass-track" ref={trackRef} role="tablist" aria-label="Product categories">
        <div
          className="liquid-glass-indicator"
          style={{
            transform: `translate3d(${pillStyle.left}px, 0, 0)`,
            width: `${pillStyle.width}px`,
            opacity: pillStyle.opacity,
          }}
          aria-hidden="true"
        />
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count = counts[cat.id] || 0;
          return (
            <button
              key={cat.id}
              ref={(el) => {
                btnRefs.current[cat.id] = el;
              }}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`liquid-glass-tab ${isActive ? "active" : ""}`}
              onClick={() => onSelect(cat.id)}
            >
              <span className="lg-tab-label">{cat.label}</span>
              {count > 0 && <span className="lg-tab-count">{count}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
