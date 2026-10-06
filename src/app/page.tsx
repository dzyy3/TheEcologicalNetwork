import Link from "next/link";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { getOrganizations, getRegistryStats } from "@/lib/data";
import { MapExplorer } from "@/components/map/MapExplorer";
import { AtlasBackdrop } from "@/components/visuals/AtlasBackdrop";

export default function HomePage() {
  const organizations = getOrganizations();
  const stats = getRegistryStats(organizations);

  return (
    <div className="relative">
      <AtlasBackdrop />

      <section className="relative mx-auto max-w-[1600px] px-4 pb-8 pt-12 md:px-6 md:pb-10 md:pt-16">
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-center gap-3 animate-fade-up">
              <p className="label-caps text-canopy">National Ecological Registry</p>
              <span className="hidden h-px w-10 bg-lichen sm:block" />
              <p className="index-mark">Est. interface · Vol. 01</p>
            </div>

            <h1 className="mt-6 max-w-[14ch] font-display text-[clamp(3rem,8vw,5.75rem)] font-medium leading-[0.95] tracking-tight text-ink animate-fade-up">
              The Ecological Network
            </h1>

            <div className="mt-8 h-px w-24 origin-left bg-canopy/50 animate-rule-in" />

            <p className="mt-7 max-w-xl text-lg leading-[1.65] text-ink-muted animate-fade-up md:text-xl">
              Mapping the organizations working to sustain America&apos;s living systems.
            </p>

            <div className="mt-10 flex flex-wrap gap-3 animate-fade-up">
              <a href="#map" className="btn-primary">
                Explore the Map <ArrowDownRight className="h-3.5 w-3.5" />
              </a>
              <Link href="/need" className="btn-secondary">
                Where is support needed?
              </Link>
              <Link href="/network" className="btn-secondary">
                Explore the Network
              </Link>
            </div>
          </div>

          <aside className="lg:col-span-4 lg:pb-2">
            <div className="panel border-ink/15 p-5 animate-fade-up">
              <div className="flex items-center justify-between border-b border-ink/10 pb-3">
                <p className="label-caps text-canopy">Registry index</p>
                <p className="index-mark">Fig. A</p>
              </div>
              <dl className="mt-4 space-y-3">
                <IndexRow label="Organizations" value={String(stats.organizationsMapped).padStart(2, "0")} />
                <IndexRow label="States represented" value={`${stats.statesRepresented} / 50`} />
                <IndexRow label="Ecosystems" value={String(stats.ecosystemsRepresented).padStart(2, "0")} />
                <IndexRow label="Verified records" value={String(stats.verifiedOrganizations).padStart(2, "0")} />
                <IndexRow label="Partnership edges" value={String(stats.documentedPartnerships).padStart(2, "0")} />
              </dl>
              <p className="mt-4 border-t border-ink/10 pt-3 font-mono text-[10px] uppercase tracking-label text-signal">
                Demo dataset · not research evidence
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section id="map" className="relative mx-auto max-w-[1600px] px-4 pb-16 md:px-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="index-mark">Plate 01</span>
              <span className="h-px w-8 bg-lichen" />
              <p className="label-caps text-canopy">Cartographic interface</p>
            </div>
            <h2 className="mt-2 font-display text-[1.85rem] font-medium tracking-tight text-ink md:text-[2.15rem]">
              National Map
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-[1.7] text-ink-muted">
              Pan, zoom, filter, and inspect organizations. Markers use demo logo initials
              as registry signals.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 font-mono text-[10px] uppercase tracking-label text-ink-faint">
            <span>Layers · presence</span>
            <span>Density · optional</span>
            <span>Verification · visible</span>
          </div>
        </div>
        <MapExplorer organizations={organizations} />
      </section>

      <section className="relative border-y border-canopy/25 bg-soil">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(243,241,232,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(243,241,232,0.7) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative mx-auto max-w-[1600px] px-4 py-4 md:px-6">
          <p className="label-caps text-moss-light">Quantitative frame · demo sample</p>
        </div>
        <div className="relative mx-auto grid max-w-[1600px] gap-8 px-4 pb-14 pt-2 sm:grid-cols-2 md:grid-cols-5 md:gap-6 md:px-6 md:pb-16">
          <Stat label="Organizations mapped" value={stats.organizationsMapped} note="Demo sample" index="A1" />
          <Stat label="States represented" value={stats.statesRepresented} note="In demo set" index="A2" />
          <Stat label="Ecosystems represented" value={stats.ecosystemsRepresented} note="In demo set" index="A3" />
          <Stat label="Verified organizations" value={stats.verifiedOrganizations} note="Demo statuses" index="A4" />
          <Stat label="Documented partnerships" value={stats.documentedPartnerships} note="Demo edges" index="A5" />
        </div>
        <p className="relative mx-auto max-w-[1600px] px-4 pb-10 text-xs leading-relaxed text-[#8A948F] md:px-6">
          Statistics reflect the current demo dataset only. Replace seed data with verified
          national records before treating counts as research evidence.
        </p>
      </section>

      <section className="relative mx-auto max-w-[1600px] px-4 py-20 md:px-6 md:py-24">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="label-caps text-canopy">Inquiry modes</p>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink">
              How the registry can be read
            </h2>
          </div>
          <Link
            href="/network"
            className="hidden items-center gap-2 text-sm text-canopy transition hover:text-canopy-deep sm:inline-flex"
          >
            Enter the network <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-0 md:grid-cols-3">
          <Principle
            index="01"
            title="Where"
            body="See geographic presence, service areas, and density of ecological organizations across the United States."
          />
          <Principle
            index="02"
            title="What"
            body="Filter by ecological focus, ecosystems, organization type, age, and verification level."
          />
          <Principle
            index="03"
            title="How connected"
            body="Move from isolated profiles to network structure — partnerships, shared projects, and coalitions."
          />
        </div>
      </section>
    </div>
  );
}

function IndexRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-ink/10 pb-2">
      <dt className="text-sm text-ink-muted">{label}</dt>
      <dd className="font-mono text-sm tabular-nums text-canopy">{value}</dd>
    </div>
  );
}

function Stat({
  label,
  value,
  note,
  index,
}: {
  label: string;
  value: number;
  note: string;
  index: string;
}) {
  return (
    <div className="border-t border-white/10 pt-4">
      <p className="font-mono text-[9px] uppercase tracking-label text-moss">{index}</p>
      <p className="mt-2 label-caps text-[#8A948F]">{label}</p>
      <p className="mt-3 font-display text-[2.65rem] font-medium tracking-tight text-sand-bright">
        {value}
      </p>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-label text-[#6E7A75]">
        {note}
      </p>
    </div>
  );
}

function Principle({
  index,
  title,
  body,
}: {
  index: string;
  title: string;
  body: string;
}) {
  return (
    <div className="border-t border-ink/15 px-0 py-6 md:border-l md:border-t-0 md:px-6 md:first:border-l-0 md:first:pl-0">
      <p className="font-mono text-[10px] uppercase tracking-label text-moss">{index}</p>
      <h3 className="mt-3 font-display text-2xl font-medium tracking-tight text-ink">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-[1.75] text-ink-muted">{body}</p>
    </div>
  );
}
