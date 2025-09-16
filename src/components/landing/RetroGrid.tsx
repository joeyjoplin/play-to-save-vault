// src/components/landing/RetroGrid.tsx
/**
 * RetroGrid
 * A subtle animated “neon grid” background using only CSS.
 * Works great behind hero content.
 */
export default function RetroGrid() {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 select-none"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0c0e1a] to-[#070810]" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "repeating-linear-gradient(0deg, rgba(120,130,255,0.12) 0, rgba(120,130,255,0.12) 1px, transparent 1px, transparent 40px)," +
              "repeating-linear-gradient(90deg, rgba(120,130,255,0.12) 0, rgba(120,130,255,0.12) 1px, transparent 1px, transparent 40px)",
            maskImage:
              "radial-gradient(ellipse at 50% 15%, black 35%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 50% 15%, black 35%, transparent 70%)",
            transform: "perspective(600px) rotateX(60deg) translateY(120px)",
            transformOrigin: "center top",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-accent/25 to-transparent blur-3xl" />
      </div>
    );
  }
  