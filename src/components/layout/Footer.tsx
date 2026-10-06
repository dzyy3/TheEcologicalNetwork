import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-canopy/30 bg-soil text-[#C9C7BC]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(243,241,232,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(243,241,232,0.5) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="relative mx-auto grid max-w-[1600px] gap-12 px-4 py-16 md:grid-cols-12 md:px-6">
        <div className="md:col-span-5">
          <p className="label-caps text-moss-light">Institutional frame</p>
          <p className="mt-3 font-display text-[2rem] font-medium tracking-tight text-sand-bright">
            The Ecological Network
          </p>
          <p className="mt-4 max-w-md text-sm leading-[1.75] text-[#A8B0AB]">
            A research-oriented registry of ecological organizations,
            relationships, and places where living systems need support.
          </p>
        </div>
        <div className="md:col-span-3">
          <p className="label-caps text-moss-light">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/" className="transition hover:text-sand-bright">
                <span className="mr-2 font-mono text-[10px] text-moss">01</span>
                National Map
              </Link>
            </li>
            <li>
              <Link href="/network" className="transition hover:text-sand-bright">
                <span className="mr-2 font-mono text-[10px] text-moss">02</span>
                The Network
              </Link>
            </li>
            <li>
              <Link href="/need" className="transition hover:text-sand-bright">
                <span className="mr-2 font-mono text-[10px] text-moss">03</span>
                Where Support Is Needed
              </Link>
            </li>
            <li>
              <Link href="/add" className="transition hover:text-sand-bright">
                <span className="mr-2 font-mono text-[10px] text-moss">04</span>
                Add Your Organization
              </Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-4">
          <p className="label-caps text-moss-light">Data principles</p>
          <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-[#A8B0AB]">
            <li>No fabricated organizations or impact claims</li>
            <li>Sources and verification dates shown when available</li>
            <li>Demo data is clearly labeled</li>
            <li>Gap scores are analytical indicators, not truth claims</li>
          </ul>
        </div>
      </div>
      <div className="relative flex flex-col items-center justify-between gap-2 border-t border-white/10 px-4 py-4 font-mono text-[10px] uppercase tracking-label text-[#7A8682] md:flex-row md:px-6">
        <span>Ecological infrastructure for research, policy, and public knowledge</span>
        <span>Registry · Atlas · Network</span>
      </div>
    </footer>
  );
}
