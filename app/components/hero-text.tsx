"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const ANGLE = "135deg";
const C1 = "#CE2D4F";
const C2 = "white";

export const T_REVEAL    = 400;
export const T_EASE      = 700;
const T_SWEEP_DELAY      = 450;
export const T_SWEEP1_DUR = 600;
const T_SWEEP2_DELAY     = 150;
const T_SWEEP2_DUR       = 600;
export const T_BEAM_AT   = T_REVEAL + T_EASE + T_SWEEP_DELAY;
export const T_DONE      = T_BEAM_AT + T_SWEEP1_DUR;

const S1 = `${T_SWEEP_DELAY / 1000}s`;
const S2 = `${(T_SWEEP_DELAY + T_SWEEP2_DELAY) / 1000}s`;

interface Props {
  className?: string;
  onDone?: () => void;
}

const T_SWEEPS_DONE = T_REVEAL + T_EASE + T_SWEEP_DELAY + T_SWEEP2_DELAY + 450;

export default function HeroText({ className = "", onDone }: Props) {
  const [showFull, setShowFull]       = useState(false);
  const [showOutline, setShowOutline] = useState(false);
  const [showPulse, setShowPulse]     = useState(false);
  const [offset, setOffset]           = useState(0);
  const [easing, setEasing]           = useState(false);
  const measureRef                    = useRef<HTMLSpanElement>(null);
  const [fw, setFw]                   = useState(0);

  useLayoutEffect(() => {
    if (measureRef.current)
      setFw(measureRef.current.getBoundingClientRect().width);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setShowFull(true),    T_REVEAL);
    const t2 = setTimeout(() => setShowOutline(true), T_REVEAL + T_EASE);
    const t3 = setTimeout(() => setShowPulse(true),   T_SWEEPS_DONE);
    const t4 = onDone ? setTimeout(onDone, T_DONE) : null;
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); if (t4) clearTimeout(t4); };
  }, [onDone]);

  // Snap offset before paint, then ease to 0 after one frame
  useLayoutEffect(() => {
    if (!showFull || fw === 0) return;
    setOffset(-fw / 2);
    setEasing(false);
    const t = setTimeout(() => { setEasing(true); setOffset(0); }, 32);
    return () => clearTimeout(t);
  }, [showFull, fw]);

  return (
    <>
      {/* Off-screen span to measure "furr" at the current responsive font size */}
      <span
        ref={measureRef}
        className={className}
        aria-hidden
        style={{ position: "fixed", top: 0, left: -9999, opacity: 0, pointerEvents: "none", whiteSpace: "nowrap" }}
      >
        furr
      </span>

      <div style={{ position: "relative", display: "inline-block" }}>
        <h1
          className={className}
          style={{
            transform: `translateX(${offset}px)`,
            transition: easing ? `transform ${T_EASE}ms cubic-bezier(0.4,0,0.2,1)` : "none",
          }}
        >
          {/* furr — invisible placeholder while _ eases, then outline + sweeps */}
          {showFull && (
            <span style={{ display: "inline-block", position: "relative" }}>
              {/* Outline — stable DOM node; fade-in animation only while sweeps haven't mounted yet */}
              <span
                style={{
                  color: "transparent",
                  WebkitTextStroke: "1px rgba(255,255,255,0.35)",
                  ...(!showOutline && {
                    animation: "outline-fade 0.5s ease-out 0.1s both",
                  }),
                }}
              >
                furr
              </span>

              {/* Sweeps mount once outline phase begins */}
              {showOutline && (
                <>
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      color: "transparent",
                      WebkitTextStroke: "none",
                      backgroundImage: `linear-gradient(${ANGLE}, ${C1} 50%, transparent 50%)`,
                      backgroundSize: "300% 100%",
                      backgroundPosition: "100% center",
                      animation: `text-reveal ${T_SWEEP1_DUR}ms ease-out ${S1} forwards`,
                    }}
                  >
                    furr
                  </span>

                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      color: "transparent",
                      WebkitTextStroke: "none",
                      backgroundImage: `linear-gradient(${ANGLE}, ${C2} 50%, transparent 50%)`,
                      backgroundSize: "300% 100%",
                      backgroundPosition: "100% center",
                      animation: `text-reveal ${T_SWEEP2_DUR}ms ease-out ${S2} forwards`,
                    }}
                  >
                    furr
                  </span>
                </>
              )}
            </span>
          )}

          {/* Underscore — always white, the anchor point */}
          <span style={{ color: "white" }}>_</span>
        </h1>

        {/* Ping ring — stroke-only clone that expands and fades like a sonar pulse */}
        {showPulse && (
          <h1
            className={className}
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              margin: 0,
              color: "transparent",
              WebkitTextFillColor: "transparent",
              WebkitTextStroke: "1px rgba(255,255,255,0.9)",
              pointerEvents: "none",
              userSelect: "none",
              animation: "text-ping 0.9s ease-out forwards",
            }}
          >
            furr_
          </h1>
        )}
      </div>
    </>
  );
}
