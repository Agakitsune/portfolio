"use client";
import { allProjects } from "contentlayer/generated";

interface Props {
  selectedSlug: string | null;
  onSelect:     (slug: string | null) => void;
}

export default function ProjectsContent({ selectedSlug, onSelect }: Props) {
  const projects = allProjects
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime());

  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      {projects.map((project) => {
        const active = selectedSlug === project.slug;
        return (
          <button
            key={project.slug}
            onClick={() => onSelect(active ? null : project.slug)}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.375rem",
              width: "100%",
              padding: "1.125rem 1.5rem",
              background: active ? "rgba(206,45,79,0.08)" : "transparent",
              border: "none",
              borderLeft: `3px solid ${active ? "#ce2d4f" : "transparent"}`,
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              textAlign: "left",
              cursor: "pointer",
              transition: [
                "background 0.2s cubic-bezier(0.4,0,0.2,1)",
                "border-color 0.2s cubic-bezier(0.4,0,0.2,1)",
              ].join(", "),
            }}
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.03)";
            }}
            onMouseLeave={(e) => {
              if (!active) e.currentTarget.style.background = "transparent";
            }}
          >
            <span
              style={{
                color: active ? "white" : "#a1a1aa",
                fontSize: "0.9375rem",
                fontWeight: active ? 600 : 400,
                lineHeight: 1.3,
                transition: "color 0.2s ease-out",
              }}
            >
              {project.title}
            </span>
            <span
              style={{
                color: "#71717a",
                fontSize: "0.8125rem",
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {project.description}
            </span>
            {project.date && (
              <span style={{ color: "#52525b", fontSize: "0.6875rem", marginTop: "0.125rem" }}>
                {new Date(project.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                })}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
