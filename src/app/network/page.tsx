import { getOrganizations, getPartnerships } from "@/lib/data";
import { NetworkGraph } from "@/components/network/NetworkGraph";
import { AtlasBackdrop } from "@/components/visuals/AtlasBackdrop";

export default function NetworkPage() {
  const organizations = getOrganizations();
  const partnerships = getPartnerships();

  return (
    <div className="relative">
      <AtlasBackdrop mark="NET" coordinate="Network topology · undirected" />
      <section className="relative mx-auto max-w-[1600px] px-4 pb-10 pt-14 md:px-6 md:pt-16">
        <div className="flex flex-wrap items-center gap-3">
          <p className="label-caps text-canopy">Plate 02</p>
          <span className="h-px w-8 bg-lichen" />
          <p className="index-mark">Relational structure</p>
        </div>
        <h1 className="mt-4 max-w-[12ch] font-display text-[clamp(2.5rem,6vw,4.25rem)] font-medium leading-[1.02] tracking-tight text-ink">
          The Network
        </h1>
        <div className="mt-6 h-px w-20 bg-canopy/45" />
        <p className="mt-6 max-w-2xl text-base leading-[1.7] text-ink-muted md:text-lg">
          Ecological organizations as an interconnected system — partnerships, shared
          projects, research collaborations, coalitions, and geographic ties.
        </p>
      </section>
      <section className="relative mx-auto max-w-[1600px] px-4 pb-16 md:px-6">
        <NetworkGraph organizations={organizations} partnerships={partnerships} />
      </section>
    </div>
  );
}
