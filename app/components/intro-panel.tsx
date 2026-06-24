"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Github, Mail, Joystick } from "lucide-react";

const RISE    = 153;
const SEP     = 20;
const OVERLAP = RISE - SEP;
const EXTRA   = 120;

const IMAGES = [
  { src: "/images/bloom_mc.png",    alt: "Bloom MC" },
  { src: "/images/quake_trace.png", alt: "Quake Trace" },
  { src: "/images/stencil.png",     alt: "Stencil Test" },
  { src: "/images/surge.png",       alt: "Surging Blood Corridor" },
  { src: "/images/alchemist.png",   alt: "Alchemist" },
];
const N = IMAGES.length;
const BASE_H = `calc((100dvh + ${OVERLAP * (N - 1)}px) / ${N})`;

interface Props {
  projectsOpen: boolean;
}

export default function IntroPanel({ projectsOpen }: Props) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const router = useRouter();

  const imgHeight = (i: number) => {
    if (hoveredIdx === null) return BASE_H;
    if (i === hoveredIdx)   return `calc(${BASE_H} + ${EXTRA}px)`;
    return `calc(${BASE_H} - ${EXTRA / (N - 1)}px)`;
  };

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100dvh",
        width: projectsOpen ? "25vw" : "60vw",
        transform: projectsOpen ? "translateX(0)" : "translateX(40vw)",
        transition: [
          "transform 0.65s cubic-bezier(0.4,0,0.2,1)",
          "width 0.65s cubic-bezier(0.4,0,0.2,1)",
        ].join(", "),
        background: "rgba(25, 23, 23, 0.92)",
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
        borderLeft:  projectsOpen ? "none"              : "1px solid #c22d4f",
        borderRight: projectsOpen ? "1px solid #c22d4f" : "none",
        zIndex: 50,
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
      }}
    >
      {/* Left column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "3rem 2rem 1.5rem",
            gap: "1.25rem",
            opacity: projectsOpen ? 0 : 1,
            pointerEvents: projectsOpen ? "none" : "auto",
            transition: "opacity 0.35s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <img
            src="/profile.jpg"
            alt="Profile"
            style={{
              width: 96, height: 96, minWidth: 96, minHeight: 96,
              flexShrink: 0, borderRadius: "50%", objectFit: "cover",
              border: "2px solid #ce2d4fff", marginTop: "2rem",
            }}
          />

          <h2
            className="font-display text-4xl text-white whitespace-nowrap"
            style={{ animation: "name-arrive 0.65s cubic-bezier(0.4,0,0.2,1) 0.1s both" }}
          >
            furr_
          </h2>

          <div className="flex gap-6">
            <a href="https://github.com/Agakitsune" target="_blank" rel="noopener noreferrer"
              aria-label="GitHub" className="text-zinc-400 hover:text-white transition-colors">
              <Github size={20} />
            </a>
            <a href="mailto:raphael.turpin@epitech.eu" aria-label="Email"
              className="text-zinc-400 hover:text-white transition-colors">
              <Mail size={20} />
            </a>
            <a href="https://agakitsune.itch.io" target="_blank" rel="noopener noreferrer"
              aria-label="itch.io" className="text-zinc-400 hover:text-white transition-colors">
              <Joystick size={20} />
            </a>
          </div>

          <div
            style={{
              width: "100%",
              maxHeight: projectsOpen ? 0 : 1000,
              opacity: projectsOpen ? 0 : 1,
              overflow: "hidden",
              pointerEvents: projectsOpen ? "none" : "auto",
              transition: "max-height 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease-out",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <div className="w-full h-px bg-white/10" style={{ marginTop: "0.25rem" }} />

            <section className="w-full text-left">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">
                About Me
              </h3>
              <div className="flex flex-col gap-5 text-zinc-100 leading-relaxed"
                style={{ fontSize: "1.2rem", lineHeight: 1.25 }}>
                <p>Hello there!</p>
                <p>
                  I'm <strong className="text-white">furr_</strong>. A french🇫🇷 passionate game developer
                  focused on <strong className="text-white">high-performance systems</strong> and{" "}
                  <strong className="text-white">data-oriented design</strong>.
                </p>
                <p>
                  I tend to work mostly with{" "}
                  <strong className="text-white">C, C++, Vulkan</strong> and{" "}
                  <strong className="text-white">Godot</strong> and love to mess around with shaders and pipelines.
                </p>
                <p>
                  I am in love with <strong className="text-white">pixel art</strong>,{" "}
                  <strong className="text-white">low poly</strong> aesthetics and programming black magic
                  from the 90s. Love a lot of games (Minecraft, Celeste, Ultrakill, Oxenfree, Castlevania…).
                </p>
              </div>
            </section>

            <div className="w-full h-px bg-white/5" />

            <section className="w-full text-left">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
                Skills
              </h3>
              <div className="flex flex-col gap-2">
                {[
                  { name: "C / C++",              level: 6 },
                  { name: "Vulkan / OpenGL",      level: 4 },
                  { name: "Rust",                 level: 2 },
                  { name: "Haskell",              level: 3 },
                  { name: "Game Dev",             level: 4 },
                  { name: "Data-Oriented Design", level: 2 },
                  { name: "Godot",                level: 6 },
                  { name: "Blender",              level: 3 },
                ].map(({ name, level }) => (
                  <div key={name} className="flex items-center justify-between gap-4">
                    <span className="text-sm text-zinc-300 shrink-0">{name}</span>
                    <div className="flex gap-1">
                      {Array.from({ length: 6 }, (_, i) => (
                        <div key={i} style={{
                          width: 18, height: 6, borderRadius: 2,
                          background: i < level ? "#ce2d4f" : "rgba(255,255,255,0.08)",
                        }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Pinned bottom — toggle button */}
        <div
          style={{
            flexShrink: 0,
            padding: "1.125rem 2rem",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <button
            onClick={() => router.push(projectsOpen ? "/about" : "/projects")}
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
      </div>

      {/* Right image banner — hidden in projects sidebar mode */}
      {!projectsOpen && (
        <div
          style={{
            width: 420,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            background: "#ce2d4f",
          }}
        >
          {IMAGES.map(({ src, alt }, i) => {
            const first = i === 0;
            const last  = i === N - 1;
            const topEdge    = `0% ${RISE}px, 100% 0%`;
            const bottomEdge = `100% calc(100% - ${RISE}px), 0% 100%`;
            const clipPath = first
              ? `polygon(0% 0%, 100% 0%, ${bottomEdge})`
              : last
              ? `polygon(${topEdge}, 100% 100%, 0% 100%)`
              : `polygon(${topEdge}, ${bottomEdge})`;

            return (
              <img
                key={src}
                src={src}
                alt={alt}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  display: "block",
                  width: "100%",
                  height: imgHeight(i),
                  objectFit: "cover",
                  flexShrink: 0,
                  position: "relative",
                  zIndex: i + 1,
                  marginTop: first ? 0 : -OVERLAP,
                  clipPath,
                  transition: "height 0.35s cubic-bezier(0.4,0,0.2,1)",
                  cursor: "pointer",
                }}
              />
            );
          })}
        </div>
      )}
    </aside>
  );
}
