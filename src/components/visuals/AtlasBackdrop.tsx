export function AtlasBackdrop({
  mark = "TEN",
  coordinate = "38.90°N · 77.04°W",
}: {
  mark?: string;
  coordinate?: string;
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 atlas-field" />
      <div className="absolute inset-x-0 top-[18%] border-t border-ink/[0.04]" />
      <div className="absolute inset-x-0 top-[62%] border-t border-dashed border-ink/[0.05]" />
      <div className="absolute inset-y-0 left-[8%] border-l border-ink/[0.035]" />
      <div className="absolute inset-y-0 right-[12%] border-l border-ink/[0.035]" />

      <p className="absolute -right-2 top-24 rotate-90 font-display text-[clamp(4rem,14vw,9rem)] font-medium leading-none text-ink/[0.035] md:top-32">
        {mark}
      </p>

      <div className="absolute bottom-8 left-4 hidden font-mono text-[9px] uppercase tracking-[0.16em] text-ink/[0.18] md:left-6 md:block">
        {coordinate}
      </div>
      <div className="absolute right-4 top-8 hidden font-mono text-[9px] uppercase tracking-[0.16em] text-ink/[0.16] md:right-6 md:block">
        Vol. 01 · Living systems
      </div>
    </div>
  );
}
