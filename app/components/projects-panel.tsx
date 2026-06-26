"use client";
import { useRouter } from "next/navigation";
import { allProjects } from "contentlayer/generated";
import { Mdx } from "./mdx";
import { ExternalLink, Github } from "lucide-react";

interface Props {
  open:         boolean;
  selectedSlug: string | null;
}

export default function ProjectsPanel({ open, selectedSlug }: Props) {
  const router = useRouter();

  const projects = allProjects
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime());

  const selected = projects.find((p) => p.slug === selectedSlug) ?? null;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "fixed",
        top: 0,
        left: "25vw",
        width: "75vw",
        height: "100dvh",
        zIndex: 49,
        transform: open ? "translateX(0)" : "translateX(110%)",
        transition: "transform 0.65s cubic-bezier(0.4,0,0.2,1)",
        display: "flex",
        overflow: "hidden",
        borderLeft: "1px solid rgba(206,45,79,0.25)",
      }}
    >
      {/* ── Left: project list ── */}
      <div
        style={{
          width: selected ? "280px" : "100%",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "rgba(13, 11, 11, 0.97)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderRight: selected ? "1px solid rgba(206,45,79,0.2)" : "none",
          transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div style={{ flex: 1, overflowY: "auto" }}>
          {projects.map((project) => {
            const active = project.slug === selectedSlug;
            return (
              <button
                key={project.slug}
                onClick={() => router.push(active ? "/projects" : `/projects/${project.slug}`)}
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
                  transition: "background 0.2s ease-out, border-color 0.2s ease-out",
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(206,45,79,0.06)"; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{
                  color: active ? "white" : "#a1a1aa",
                  fontSize: "0.9375rem",
                  fontWeight: active ? 600 : 400,
                  lineHeight: 1.3,
                  transition: "color 0.2s ease-out",
                  // truncate title when list is narrow
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: selected ? "nowrap" : "normal",
                }}>
                  {project.title}
                </span>
                {!selected && (
                  <span style={{
                    color: "#71717a",
                    fontSize: "0.8125rem",
                    lineHeight: 1.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}>
                    {project.description}
                  </span>
                )}
                {project.date && (
                  <span style={{ color: "#52525b", fontSize: "0.6875rem", marginTop: "0.125rem" }}>
                    {new Date(project.date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Right: article ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "rgba(15, 13, 13, 0.85)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          opacity: selected ? 1 : 0,
          pointerEvents: selected ? "auto" : "none",
          transition: "opacity 0.3s ease-out",
        }}
      >
        {selected && (
          <>
            {/* Header */}
            <div
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem 2rem",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <h1
                style={{
                  flex: 1,
                  color: "white",
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  margin: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {selected.title}
              </h1>

              <div style={{ display: "flex", gap: "0.75rem", flexShrink: 0 }}>
                {selected.repository && (
                  <a
                    href={selected.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-white transition-colors"
                    aria-label="Repository"
                  >
                    <Github size={18} />
                  </a>
                )}
                {selected.url && (
                  <a
                    href={selected.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-white transition-colors"
                    aria-label="Live site"
                  >
                    <ExternalLink size={18} />
                  </a>
                )}
              </div>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "2rem 2.5rem", maxWidth: 780 }}>
              <p style={{
                color: "#71717a",
                fontSize: "0.9375rem",
                lineHeight: 1.65,
                marginBottom: "2rem",
                paddingBottom: "1.5rem",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}>
                {selected.description}
              </p>
              <div className="dark-prose">
                <Mdx code={selected.body.code} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
