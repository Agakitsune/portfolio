"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import HeroText, { T_BEAM_AT, T_SWEEP1_DUR } from "./components/hero-text";
import InspireText from "./components/inspire-text";

const bg_mid = "#252323";
const beamDelay = `${T_BEAM_AT / 1000}s`;

export default function Home() {
    const [ready,   setReady]   = useState(false);
  const [leaving, setLeaving] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    if (leaving) return;
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      (document as any).startViewTransition(() => router.push("/about"));
    } else {
      setLeaving(true);
      setTimeout(() => router.push("/about"), 500);
    }
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center w-screen h-screen overflow-hidden"
      style={{
        background: bg_mid,
        opacity: leaving ? 0 : 1,
        transition: leaving ? "opacity 0.5s ease-out" : undefined,
      }}
      onClick={handleClick}
    >
      {/* Full-screen diagonal beam */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(135deg, transparent 43%, rgba(206,45,79,0.18) 50%, transparent 57%)",
          backgroundSize: "300% 100%",
          backgroundPosition: "100% center",
          animation: `text-reveal ${T_SWEEP1_DUR}ms ease-out ${beamDelay} forwards`,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 10 }}>
        <HeroText
          className="text-4xl cursor-default font-display sm:text-6xl md:text-9xl whitespace-nowrap"
          onDone={() => setReady(true)}
        />
      </div>

      <div
        className="my-16 text-center"
        style={{
          opacity: ready && !leaving ? 1 : 0,
          transition: "opacity 0.5s ease-out",
          pointerEvents: leaving ? "none" : "auto",
        }}
      >
        <InspireText />
      </div>
    </div>
  );
}
