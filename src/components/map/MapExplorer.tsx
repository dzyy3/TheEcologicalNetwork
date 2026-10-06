"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { Organization, OrganizationFilters } from "@/types";
import { filterOrganizations } from "@/lib/data";
import { MapFilters, emptyFilters } from "@/components/map/MapFilters";
import { SearchBox } from "@/components/map/SearchBox";
import { OrgPanel } from "@/components/map/OrgPanel";
import { OrgListView, ViewToggle } from "@/components/map/ViewToggle";

const NationalMap = dynamic(
  () => import("@/components/map/NationalMap").then((m) => m.NationalMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full flex-col items-center justify-center gap-2 bg-sand text-sm text-ink-muted">
        <span className="label-caps text-canopy">Loading atlas</span>
        <span>Preparing cartographic layer…</span>
      </div>
    ),
  }
);

export function MapExplorer({ organizations }: { organizations: Organization[] }) {
  const [filters, setFilters] = useState<OrganizationFilters>(emptyFilters);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<"map" | "list">("map");
  const [densityMode, setDensityMode] = useState(false);
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);

  const filtered = useMemo(
    () => filterOrganizations(filters, organizations),
    [filters, organizations]
  );

  const selected = organizations.find((o) => o.id === selectedId) ?? null;
  const partners = selected
    ? organizations.filter((o) => selected.partnerIds.includes(o.id))
    : [];

  const statesCovered = useMemo(() => {
    return new Set(filtered.flatMap((o) => o.locations.map((l) => l.stateCode))).size;
  }, [filtered]);

  return (
    <div className="atlas-frame relative flex h-[min(84vh,900px)] min-h-[560px] flex-col overflow-hidden lg:flex-row">
      <aside className="z-10 flex w-full flex-col gap-3 border-b border-ink/10 bg-sand-bright/95 p-3.5 lg:w-[300px] lg:border-b-0 lg:border-r lg:p-4">
        <div className="flex items-center justify-between border-b border-ink/10 pb-2">
          <p className="label-caps text-canopy">Control panel</p>
          <p className="index-mark">CP-01</p>
        </div>

        <SearchBox
          organizations={organizations}
          value={filters.search}
          onChange={(search) => setFilters((f) => ({ ...f, search }))}
          onSelectOrg={(id) => {
            setSelectedId(id);
            setView("map");
          }}
          onSelectPlace={(lat, lng) => {
            setFlyTo({ lat, lng, zoom: 6.5 });
            setView("map");
          }}
        />

        <div className="flex items-center justify-between gap-2">
          <ViewToggle view={view} onChange={setView} />
          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-label text-canopy">
              {String(filtered.length).padStart(2, "0")} shown
            </p>
            <p className="font-mono text-[9px] uppercase tracking-label text-ink-faint">
              {statesCovered} / 50 states
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 border border-ink/10 bg-sand/70 px-2 py-2">
          <MetaChip label="Focus" value="Ecology" />
          <MetaChip label="Mode" value={densityMode ? "Density" : "Points"} />
          <MetaChip label="View" value={view === "map" ? "Map" : "List"} />
        </div>

        <MapFilters
          filters={filters}
          onChange={setFilters}
          densityMode={densityMode}
          onDensityChange={setDensityMode}
        />
      </aside>

      <div className="relative min-h-0 flex-1 bg-sand-dim/40">
        {view === "map" ? (
          <NationalMap
            organizations={filtered}
            selectedId={selectedId}
            densityMode={densityMode}
            onSelect={setSelectedId}
            flyTo={flyTo}
          />
        ) : (
          <OrgListView
            organizations={filtered}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        )}

        {selected && (
          <OrgPanel
            org={selected}
            partners={partners}
            onClose={() => setSelectedId(null)}
          />
        )}
      </div>
    </div>
  );
}

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[8px] uppercase tracking-label text-ink-faint">{label}</p>
      <p className="mt-0.5 text-[11px] font-medium text-ink">{value}</p>
    </div>
  );
}
