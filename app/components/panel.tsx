"use client";
import { useState, useEffect } from "react";
import IntroContent from "./intro-content";
import ProjectsContent from "./projects-content";
import ProjectDetail from "./project-detail";

interface Props {
  open: boolean;
}

export default function Panel({ open }: Props) {
  const [projectsOpen,  setProjectsOpen]  = useState(false);
  const [hoveredIdx,    setHoveredIdx]    = useState<number | null>(null);
  const [selectedSlug,  setSelectedSlug]  = useState<string | null>(null);

  useEffect(() => {
    if (!open) { setProjectsOpen(false); setSelectedSlug(null); }
  }, [open]);

  useEffect(() => {
    if (!projectsOpen) setSelectedSlug(null);
  }, [projectsOpen]);

  const detailVisible = open && projectsOpen && selectedSlug !== null;

  return (
    <>
      <aside
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100dvh",
          width: projectsOpen ? "25vw" : "60vw",
          // closed → off-screen right | projects → left-aligned | intro → right-aligned
          transform: !open
            ? "translateX(100vw)"
            : projectsOpen
            ? "translateX(0)"
            : "translateX(40vw)",
          transition: [
            "transform 0.65s cubic-bezier(0.4,0,0.2,1)",
            "width 0.65s cubic-bezier(0.4,0,0.2,1)",
          ].join(", "),
          background: "rgba(25, 23, 23, 0.3)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
          borderLeft:  projectsOpen ? "none"              : "1px solid #c22d4f",
          borderRight: projectsOpen ? "1px solid #c22d4f" : "none",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Content area — key forces remount + fade-in on each swap */}
        <div
          key={projectsOpen ? "projects" : "intro"}
          style={{
            flex: 1,
            display: "flex",
            overflow: "hidden",
            animation: "panel-fade-in 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
          }}
        >
          {projectsOpen ? (
            <ProjectsContent
              selectedSlug={selectedSlug}
              onSelect={setSelectedSlug}
            />
          ) : (
            <IntroContent
              open={open}
              hoveredIdx={hoveredIdx}
              setHoveredIdx={setHoveredIdx}
            />
          )}
        </div>

        {/* Persistent bottom button */}
        <div
          style={{
            flexShrink: 0,
            padding: "1.125rem 2rem",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <button
            onClick={() => setProjectsOpen((v) => !v)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              border: "1px solid #ce2d4f",
              borderRadius: 4,
              background: projectsOpen ? "#ce2d4f" : "transparent",
              color: projectsOpen ? "white" : "#ce2d4f",
              fontSize: "0.8125rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.25s ease-out, color 0.25s ease-out",
              letterSpacing: "0.02em",
            }}
          >
            {projectsOpen ? "← Back to profile" : "View all projects →"}
          </button>
        </div>
      </aside>

      {/* Detail panel — slides in from the right when a card is selected */}
      <ProjectDetail
        slug={selectedSlug}
        visible={detailVisible}
        onClose={() => setSelectedSlug(null)}
      />
    </>
  );
}
