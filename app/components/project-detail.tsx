"use client";
import { allProjects } from "contentlayer/generated";
import { Mdx } from "./mdx";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";

interface Props {
  slug:    string | null;
  visible: boolean;
  onClose: () => void;
}

export default function ProjectDetail({ slug, visible, onClose }: Props) {
  const project = allProjects.find((p) => p.slug === slug) ?? null;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "fixed",
        top: 0,
        left: "25vw",
        width: "75vw",
        height: "100dvh",
        background: "rgba(15, 13, 13, 0.75)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderLeft: "1px solid rgba(206,45,79,0.2)",
        zIndex: 48,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transform: visible ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {project && (
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
            <button
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                color: "#ce2d4f",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "0.875rem",
                padding: 0,
                flexShrink: 0,
                transition: "color 0.2s ease-out",
              }}
            >
              <ArrowLeft size={15} />
              Back
            </button>

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
              {project.title}
            </h1>

            <div style={{ display: "flex", gap: "0.75rem", flexShrink: 0 }}>
              {project.repository && (
                <a
                  href={project.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-white transition-colors"
                  aria-label="Repository"
                >
                  <Github size={18} />
                </a>
              )}
              {project.url && (
                <a
                  href={project.url}
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
          <div style={{ flex: 1, overflowY: "auto", padding: "2rem" }}>
            <p
              style={{
                color: "#71717a",
                fontSize: "0.9375rem",
                lineHeight: 1.65,
                marginBottom: "1.5rem",
                paddingBottom: "1.5rem",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {project.description}
            </p>
            <div className="dark-prose">
              <Mdx code={project.body.code} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
