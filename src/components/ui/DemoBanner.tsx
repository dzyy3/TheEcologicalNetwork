export function DemoBanner() {
  return (
    <div className="border-b border-signal/25 bg-[#EDE6D6]">
      <div className="mx-auto flex max-w-[1600px] items-center justify-center gap-3 px-4 py-1.5 text-center md:px-6">
        <span className="font-mono text-[9px] uppercase tracking-label text-signal">
          Demo
        </span>
        <span className="h-3 w-px bg-signal/30" />
        <span className="font-mono text-[10px] uppercase tracking-label text-ink-muted">
          Organizations and environmental intensities are fictional placeholders
        </span>
      </div>
    </div>
  );
}
