"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SiGithub, SiItchdotio } from "react-icons/si";
import { FaEnvelope } from "react-icons/fa6";
import { allProjects } from "contentlayer/generated";
import { Mdx } from "./mdx";
import { useIsMobile, useIsLandscapeMobile } from "@/util/screen";

// ── Cards ────────────────────────────────────────────────────────────────────

const CARDS = allProjects
  .filter((p) => p.published)
  .sort((a, b) => a.title.localeCompare(b.title));

// ── Image banner (no hover) ───────────────────────────────────────────────────

const IMAGES = [
  { src: "/images/bloom_mc.png",    alt: "Bloom MC"                },
  { src: "/images/quake_trace.png", alt: "Quake Trace"             },
  { src: "/images/stencil.png",     alt: "Stencil Test"            },
  { src: "/images/surge.png",       alt: "Surging Blood Corridor"  },
  { src: "/images/alchemist.png",   alt: "Alchemist"               },
];
const RISE    = 153;
const SEP     = 20;
const OVERLAP = RISE - SEP;
const N       = IMAGES.length;
const BASE_H  = `calc((100% + ${OVERLAP * (N - 1)}px) / ${N})`;

function ImageBanner({ fading }: { fading: boolean }) {
  return (
    <div
      style={{
        width: 300,
        height: "100%",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#ce2d4f",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.18s ease-out",
      }}
    >
      {IMAGES.map(({ src, alt }, i) => {
        const first      = i === 0;
        const last       = i === N - 1;
        const topEdge    = `0% ${RISE}px, 100% 0%`;
        const bottomEdge = `100% calc(100% - ${RISE}px), 0% 100%`;
        const clipPath   = first
          ? `polygon(0% 0%, 100% 0%, ${bottomEdge})`
          : last
          ? `polygon(${topEdge}, 100% 100%, 0% 100%)`
          : `polygon(${topEdge}, ${bottomEdge})`;
        return (
          <img
            key={src}
            src={src}
            alt={alt}
            style={{
              display: "block",
              width: "100%",
              height: BASE_H,
              objectFit: "cover",
              flexShrink: 0,
              marginTop: first ? 0 : -OVERLAP,
              clipPath,
            }}
          />
        );
      })}
    </div>
  );
}

// ── Content components ────────────────────────────────────────────────────────

function ContentAbout() {
  return (
    <div style={{ padding: "3rem 2rem 1.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem", width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem", width: "100%" }}>
      <img
        src="/profile.jpg"
        alt="Profile"
        style={{
          width: 96, height: 96, minWidth: 96, minHeight: 96,
          flexShrink: 0, borderRadius: "50%", objectFit: "cover",
          border: "2px solid #ce2d4fff",
        }}
      />

      <h2 className="font-display text-4xl text-white whitespace-nowrap">furr_</h2>

      <div style={{ display: "flex", gap: "0.75rem" }}>
        {[
          { href: "https://github.com/Agakitsune", label: "GitHub",  bg: "#181717", icon: <SiGithub size={22} />    },
          { href: "mailto:raphael.turpin@epitech.eu", label: "Email", bg: "#ce2d4f", icon: <FaEnvelope size={22} /> },
          { href: "https://agakitsune.itch.io",    label: "itch.io", bg: "#FA5C5C", icon: <SiItchdotio size={22} /> },
        ].map(({ href, label, bg, icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("mailto") ? undefined : "_blank"}
            rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
            aria-label={label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              border: "1px solid white",
              borderRadius: 2,
              background: bg,
              color: "white",
              transition: "opacity 0.15s ease-out",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {icon}
          </a>
        ))}
      </div>
      </div>

      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div className="w-full h-px bg-white/10" />

        <section className="w-full text-left">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">About Me</h3>
          <div className="flex flex-col gap-5 text-zinc-100 leading-relaxed"
            style={{ fontSize: "1.2rem", lineHeight: 1.25 }}>
            <p>Hello there!</p>
            <p>
              I'm <strong className="text-white">furr_</strong>. A french🇫🇷 passionate game developer
              focused on <strong className="text-white">high-performance systems</strong>,{" "}
              <strong className="text-white">data-oriented design</strong> and{" "} <strong>graphic programming</strong>.
            </p>
            <p>
              I tend to work mostly with{" "}
              <strong className="text-white">C, C++, Vulkan</strong> and{" "}
              <strong className="text-white">Godot</strong> and love to mess around with shaders and pipelines.
            </p>
            <p>
              I am in love with <strong className="text-white">pixel art</strong> and{" "}
              <strong className="text-white">low poly</strong> aesthetics and programming black magic
              from the 90s.<br/>
              Love a lot of games (Minecraft, Celeste, Ultrakill, Oxenfree, Castlevania…) so don't ask me which is my favorite.
            </p>
          </div>
        </section>

        <div className="w-full h-px bg-white/5" />

        <section className="w-full text-left">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">Skills</h3>
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
  );
}

function ContentLeft({ activeSlug, onSelect }: { activeSlug: string | null; onSelect: (slug: string) => void }) {
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "1.25rem 1.5rem", background: "#ce2d4f" }}>
        <h2 className="font-display text-2xl" style={{ color: "white", marginBottom: "0.25rem" }}>
          Projects
        </h2>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8125rem", lineHeight: 1.6, margin: 0 }}>
          A collection of things I built, experimented with, or shipped.
        </p>
      </div>
      {CARDS.map((c) => {
        const active = c.slug === activeSlug;
        return (
          <button
            key={c.slug}
            onClick={() => onSelect(c.slug)}
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
            onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(206,45,79,0.04)"; }}
            onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
              <span style={{
                color: active ? "white" : "#a1a1aa",
                fontSize: "0.9375rem",
                fontWeight: active ? 600 : 400,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                transition: "color 0.2s ease-out",
              }}>
                {c.title}
              </span>
              <div style={{ display: "flex", gap: "0.25rem", flexShrink: 0, flexWrap: "wrap" }}>
                {c.tags?.map((t) => (
                  <span key={t} style={{
                    fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.05em",
                    color: "#ce2d4f", border: "1px solid rgba(206,45,79,0.35)",
                    borderRadius: 3, padding: "0.125rem 0.5rem",
                  }}>{t}</span>
                ))}
              </div>
            </div>
            <span style={{
              color: "#71717a",
              fontSize: "0.8125rem",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
              {c.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ContentDetail({ slug, onBack }: { slug: string; onBack: () => void }) {
  const card = CARDS.find((c) => c.slug === slug);
  if (!card) return null;
  return (
    <>
      <button
        onClick={onBack}
        style={{
          alignSelf: "flex-start",
          marginTop: "2rem",
          background: "none",
          border: "none",
          color: "#ce2d4f",
          fontSize: "0.8125rem",
          fontWeight: 600,
          cursor: "pointer",
          padding: 0,
          letterSpacing: "0.02em",
        }}
      >
        ← Back
      </button>
      <h2 className="font-display text-4xl text-white whitespace-nowrap">{card.title}</h2>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div className="w-full h-px bg-white/10" />
        <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
          {card.tags?.map((t) => (
            <span key={t} style={{
              fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.05em",
              color: "#ce2d4f", border: "1px solid rgba(206,45,79,0.35)",
              borderRadius: 3, padding: "0.125rem 0.5rem",
            }}>{t}</span>
          ))}
        </div>
        <p style={{ color: "#a1a1aa", fontSize: "0.9375rem", lineHeight: 1.65, margin: 0 }}>
          {card.description}
        </p>
        <div className="w-full h-px bg-white/5" />
        <div className="dark-prose">
          <Mdx code={card.body.code} />
        </div>
      </div>
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function PanelTest() {
  const pathname  = usePathname();
  const router    = useRouter();
  const isMobile          = useIsMobile();
  const isLandscapeMobile = useIsLandscapeMobile();

  const isOnLeft   = pathname?.startsWith("/left") ?? false;
  const activeSlug = pathname?.startsWith("/left/") ? pathname.slice("/left/".length) : null;

  const category = isOnLeft ? "left" : "about";
  const [visibleCategory, setVisibleCategory] = useState(category);
  const [fading,          setFading]          = useState(false);

  useEffect(() => {
    if (category === visibleCategory) return;
    setFading(true);
    const t = setTimeout(() => {
      setVisibleCategory(category);
      setFading(false);
    }, 180);
    return () => clearTimeout(t);
  }, [category]);

  const [visibleSlug,  setVisibleSlug]  = useState<string | null>(activeSlug);
  const [detailFading, setDetailFading] = useState(false);

  useEffect(() => {
    if (activeSlug === null) return;
    if (activeSlug === visibleSlug) return;
    if (visibleSlug === null) { setVisibleSlug(activeSlug); return; }
    setDetailFading(true);
    const t = setTimeout(() => {
      setVisibleSlug(activeSlug);
      setDetailFading(false);
    }, 180);
    return () => clearTimeout(t);
  }, [activeSlug]);

  return (
    <>
      {/* Detail panel — slides in from the left */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100dvh",
          width: isMobile ? (isLandscapeMobile ? (isOnLeft ? "55vw" : "40vw") : "100vw") : isOnLeft ? "75vw" : "50vw",
          minWidth: isMobile ? undefined : isOnLeft ? 480 : 400,
          background: "rgba(25, 23, 23, 0.92)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
          borderRight: isMobile ? "none" : "1px solid rgba(206,45,79,0.3)",
          zIndex: 51,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          transform: activeSlug ? "translateX(0)" : "translateX(-100%)",
          transition: "width 0.65s cubic-bezier(0.4,0,0.2,1), transform 0.4s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div
          className="panel-scroll"
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            padding: isMobile ? "1.5rem 1.25rem 6rem" : "3rem 3rem 6rem",
            gap: "1.25rem",
            opacity: detailFading ? 0 : 1,
            transition: "opacity 0.18s ease-out",
          }}
        >
          <div
            key={visibleSlug}
            style={{ animation: "content-slide-in 0.25s ease-out both", width: "100%", display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            {visibleSlug && <ContentDetail slug={visibleSlug} onBack={() => router.push("/left")} />}
          </div>
        </div>
      </div>

      {/* Right panel — column layout: row(content + banner) then full-width button */}
      <aside
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100dvh",
          width: isMobile ? (isLandscapeMobile ? (isOnLeft ? "45vw" : "60vw") : "100vw") : isOnLeft ? "25vw" : "50vw",
          minWidth: isOnLeft ? 280 : 400,
          background: "rgba(25, 23, 23, 0.92)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
          borderLeft: isMobile ? "none" : "1px solid #c22d4f",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          transition: "width 0.65s cubic-bezier(0.4,0,0.2,1)",
          viewTransitionName: "test-panel",
        } as React.CSSProperties}
      >
        {/* Row: scrollable content + image banner */}
        <div style={{ flex: 1, display: "flex", flexDirection: "row", overflow: "hidden" }}>
          {/* Left column: scrollable content */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            // hold the about-mode width while ContentAbout is still visible so
            // text doesn't reflow during the panel width transition; snaps away
            // after the 180ms fade when visibleCategory switches to "left"
            minWidth: visibleCategory === "about" && !isMobile && !isLandscapeMobile
              ? "calc(50vw - 300px)"
              : 0,
          }}>
            <div
              className="panel-scroll"
              style={{
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                opacity: fading ? 0 : 1,
                transition: "opacity 0.18s ease-out",
              }}
            >
              <div
                key={visibleCategory}
                style={{ animation: "content-slide-in 0.25s ease-out both", width: "100%", display: "flex", flexDirection: "column" }}
              >
                {visibleCategory === "left"
                  ? <ContentLeft activeSlug={activeSlug} onSelect={(slug) => router.push(`/left/${slug}`)} />
                  : <ContentAbout />
                }
              </div>
            </div>
          </div>

          {/* Image banner — only on about, hidden on all mobile */}
          {visibleCategory === "about" && !isMobile && !isLandscapeMobile && <ImageBanner fading={fading} />}
        </div>

        {/* Full-width bottom button */}
        <div style={{ flexShrink: 0, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button
            onClick={() => router.push(isOnLeft ? "/about" : "/left")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              padding: "1rem 2rem",
              border: "none",
              background: "#ce2d4f",
              color: "white",
              fontSize: "0.8125rem",
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: "0.02em",
              transition: "background 0.15s ease-out",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#b82646")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#ce2d4f")}
          >
            {isOnLeft ? "Back to Profil" : "See Projects"}
          </button>
        </div>
      </aside>
    </>
  );
}
