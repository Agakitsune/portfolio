"use client";

export default function TestPanel() {
  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        height: "100dvh",
        width: "35vw",
        background: "rgba(25, 23, 23, 0.92)",
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
        borderLeft: "1px solid #c22d4f",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        // gives this element its own VT layer so the browser can
        // animate it independently (slide-from-right) from the rest
        viewTransitionName: "test-panel",
      } as React.CSSProperties}
    >
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          padding: "3rem 2rem 1.5rem",
          gap: "1.5rem",
        }}
      >
        <h2 className="font-display text-3xl text-white">Test Panel</h2>

        <div className="w-full h-px bg-white/10" />

        <section className="w-full text-left flex flex-col gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Section A
          </h3>
          {["Item one", "Item two", "Item three", "Item four"].map((item) => (
            <div
              key={item}
              style={{
                padding: "0.75rem 1rem",
                borderRadius: 4,
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.03)",
                color: "#a1a1aa",
                fontSize: "0.9375rem",
              }}
            >
              {item}
            </div>
          ))}
        </section>

        <div className="w-full h-px bg-white/5" />

        <section className="w-full text-left">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
            Section B
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            This panel slides in from the right using a View Transition.
            It shares the same glass-dark aesthetic as the intro panel.
          </p>
        </section>
      </div>

      <div
        style={{
          flexShrink: 0,
          padding: "1.125rem 2rem",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1rem",
            border: "1px solid #ce2d4f",
            borderRadius: 4,
            color: "#ce2d4f",
            fontSize: "0.8125rem",
            fontWeight: 600,
            letterSpacing: "0.02em",
          }}
        >
          test-panel
        </span>
      </div>
    </aside>
  );
}
