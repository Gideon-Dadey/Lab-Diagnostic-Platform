import React from "react";

const DEFAULT_PRIMARY = "#4f46e5"; 
const DEFAULT_BG = "#f8fafc"; 
const DEFAULT_TEXT = "rgba(15, 23, 42, 0.85)";

const Loader = ({
  message = "Loading…",
  subtext = "",
  primary = DEFAULT_PRIMARY,
  background = DEFAULT_BG,
  textColor = DEFAULT_TEXT,
  variant = "fullscreen", 
  size = 72, 
}) => {
  const isFullscreen = variant === "fullscreen";

  
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const containerStyle = isFullscreen
    ? {
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background,
        zIndex: 9999,
        padding: 24,
      }
    : {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
      };

  const cardStyle = isFullscreen
    ? {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
        borderRadius: 14,
        padding: "18px 26px",
        boxShadow: "0 10px 30px rgba(2,6,23,0.6)",
        backdropFilter: "blur(6px)",
        color: textColor,
        maxWidth: 640,
        width: "min(95%, 720px)",
      }
    : {
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        color: primary,
      };

  const textStyle = {
    fontSize: isFullscreen ? 18 : 14,
    fontWeight: 600,
    color: isFullscreen ? textColor : "inherit",
    margin: 0,
    lineHeight: 1.2,
    textAlign: "center",
  };

  const subtextStyle = {
    fontSize: isFullscreen ? 13 : 12,
    color: isFullscreen ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.6)",
    margin: 0,
    textAlign: "center",
  };

  const spinnerSize = isFullscreen ? Math.max(72, size) : size;

  const spinnerStyle = {
    width: spinnerSize,
    height: spinnerSize,
    display: "block",
    flexShrink: 0,
  };

  
  const motionStyles = `
    @keyframes loader-rotate { 100% { transform: rotate(360deg); } }
    @keyframes loader-pulse { 0% { transform: scale(0.98); opacity: 0.9 } 50% { transform: scale(1.02); opacity: 1 } 100% { transform: scale(0.98); opacity: 0.9 } }
    @keyframes loader-dash { 0% { stroke-dashoffset: 120; } 50% { stroke-dashoffset: 30; } 100% { stroke-dashoffset: 120; } }
  `;

  return (
    <div style={containerStyle} role={isFullscreen ? "status" : undefined} aria-live="polite">
      {}
      <style>{prefersReducedMotion ? "" : motionStyles}</style>

      <div style={cardStyle}>
        {/* Spinner + ring */}
        <svg
          viewBox="0 0 64 64"
          style={spinnerStyle}
          aria-hidden="true"
          role="img"
        >
          <defs>
            <linearGradient id="loader-grad" x1="0" x2="1">
              <stop offset="0%" stopColor={primary} stopOpacity="1" />
              <stop offset="100%" stopColor={primary} stopOpacity="0.25" />
            </linearGradient>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodOpacity="0.07" />
            </filter>
          </defs>

          {}
          <circle cx="32" cy="32" r="20" fill="url(#loader-grad)" opacity="0.06" filter="url(#shadow)" />

          {}
          <g
            style={
              prefersReducedMotion
                ? {}
                : { transformOrigin: "32px 32px", animation: "loader-rotate 1.4s linear infinite" }
            }
          >
            {}
            <circle
              cx="32"
              cy="32"
              r="18"
              fill="none"
              stroke="url(#loader-grad)"
              strokeWidth="3.8"
              strokeLinecap="round"
              strokeDasharray="120"
              strokeDashoffset="60"
              style={
                prefersReducedMotion
                  ? {}
                  : { transition: "stroke-dashoffset 0.9s ease-in-out", animation: "loader-dash 1.6s ease-in-out infinite" }
              }
            />

            {}
            <circle
              cx="50"
              cy="32"
              r="3.2"
              fill={primary}
              style={prefersReducedMotion ? {} : { transformOrigin: "32px 32px", animation: "loader-rotate 1.4s linear infinite" }}
              opacity="0.95"
            />
          </g>

          {}
          {!prefersReducedMotion && (
            <circle
              cx="32"
              cy="32"
              r="8"
              fill={primary}
              opacity="0.06"
              style={{ animation: "loader-pulse 1.8s ease-in-out infinite" }}
            />
          )}
        </svg>

        {}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <p style={textStyle}>{message}</p>
          {subtext ? <p style={subtextStyle}>{subtext}</p> : null}

          {}
          {isFullscreen && (
            <div
              aria-hidden
              style={{
                width: "100%",
                height: 8,
                background: "rgba(255,255,255,0.06)",
                borderRadius: 999,
                overflow: "hidden",
                marginTop: 8,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
              }}
            >
              <div
                style={{
                  width: "34%",
                  height: "100%",
                  background: `linear-gradient(90deg, ${primary}, rgba(255,255,255,0.18))`,
                  borderRadius: 999,
                  boxShadow: "0 6px 18px rgba(79,70,229,0.12)",
                  transition: "width 800ms ease",
                }}
              />
            </div>
          )}
        </div>

        {}
        <span style={{ position: "absolute", left: -9999, top: "auto", width: 1, height: 1, overflow: "hidden" }}>
          {message}
        </span>
      </div>
    </div>
  );
};

export default Loader;