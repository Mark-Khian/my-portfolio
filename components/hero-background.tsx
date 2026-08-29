export function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Subtle top radial glow — complements particle canvas */}
      <div className="absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,oklch(0.623_0.214_259.815_/_12%),transparent_70%)]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />
    </div>
  );
}
