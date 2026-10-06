"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { EnvironmentalLayer, Organization } from "@/types";
import { computeGapScores, GAP_CLASSIFICATION_LABELS } from "@/lib/gap-analysis";
import { ChevronDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const NeedMap = dynamic(
  () => import("@/components/need/NeedMap").then((m) => m.NeedMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[480px] items-center justify-center bg-sand-dim/40 text-sm text-ink-muted">
        Loading need map…
      </div>
    ),
  }
);

export function NeedExplorer({
  organizations,
  layers,
}: {
  organizations: Organization[];
  layers: EnvironmentalLayer[];
}) {
  const [activeLayerIds, setActiveLayerIds] = useState<string[]>([layers[0]?.id].filter(Boolean));
  const [showGaps, setShowGaps] = useState(true);
  const [methodOpen, setMethodOpen] = useState(false);
  const [expandedMeta, setExpandedMeta] = useState<string | null>(layers[0]?.id ?? null);

  const activeLayers = layers.filter((l) => activeLayerIds.includes(l.id));
  const gaps = useMemo(
    () => computeGapScores(organizations, activeLayers),
    [organizations, activeLayers]
  );

  function toggleLayer(id: string) {
    setActiveLayerIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  const rankedGaps = [...gaps].sort((a, b) => b.gapScore - a.gapScore).slice(0, 8);

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <aside className="space-y-3">
        <div className="panel p-4">
          <p className="label-caps">Ecological risk layers</p>
          <p className="mt-2 text-xs leading-relaxed text-ink-muted">
            Toggle layers designed to connect to authoritative public datasets. Current
            intensities are synthetic DEMO placeholders.
          </p>
          <ul className="mt-3 space-y-1">
            {layers.map((layer) => {
              const on = activeLayerIds.includes(layer.id);
              return (
                <li key={layer.id}>
                  <button
                    type="button"
                    onClick={() => toggleLayer(layer.id)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-[2px] border px-2 py-2 text-left text-sm transition",
                      on
                        ? "border-ink/20 bg-ink/[0.03]"
                        : "border-transparent hover:bg-ink/[0.03]"
                    )}
                  >
                    <span
                      className="h-3 w-3 shrink-0 rounded-[2px]"
                      style={{
                        backgroundColor: layer.color,
                        opacity: on ? 1 : 0.35,
                      }}
                    />
                    <span className="flex-1 text-ink">{layer.name}</span>
                    <span className="font-mono text-[9px] uppercase text-signal">Demo</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="panel p-4">
          <label className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-ink">Ecological Support Gaps</span>
            <input
              type="checkbox"
              checked={showGaps}
              onChange={(e) => setShowGaps(e.target.checked)}
              className="h-4 w-4 accent-canopy"
            />
          </label>
          <p className="mt-2 text-xs text-ink-muted">
            Analytical indicator comparing relative need vs. mapped organizational presence —
            not a funding recommendation.
          </p>
          <button
            type="button"
            className="btn-ghost mt-2 w-full justify-between px-0"
            onClick={() => setMethodOpen((v) => !v)}
          >
            <span className="flex items-center gap-1.5 text-xs">
              <Info className="h-3.5 w-3.5" /> Methodology
            </span>
            <ChevronDown className={cn("h-3.5 w-3.5 transition", methodOpen && "rotate-180")} />
          </button>
          {methodOpen && (
            <div className="mt-2 space-y-2 border-t border-ink/10 pt-2 text-xs leading-relaxed text-ink-muted">
              <p>
                <strong className="text-ink">Need</strong> = average intensity of active
                environmental layers per state (0–1).
              </p>
              <p>
                <strong className="text-ink">Presence</strong> = organization count in that
                state, normalized by the maximum count in the current set (0–1).
              </p>
              <p>
                <strong className="text-ink">Gap</strong> = Need − Presence. Higher values
                suggest higher relative need compared with mapped presence.
              </p>
              <p className="rounded-[2px] bg-signal/10 px-2 py-1.5 text-signal">
                With demo layers and demo orgs, classifications are illustrative only.
              </p>
            </div>
          )}
        </div>

        {activeLayers[0] && (
          <div className="panel p-4">
            <p className="label-caps">Layer metadata</p>
            <select
              className="mt-2 w-full rounded-[2px] border border-ink/10 bg-sand-bright px-2 py-1.5 text-sm"
              value={expandedMeta ?? ""}
              onChange={(e) => setExpandedMeta(e.target.value)}
            >
              {layers.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
            {(() => {
              const layer = layers.find((l) => l.id === expandedMeta) ?? activeLayers[0];
              return (
                <dl className="mt-3 space-y-2 text-xs">
                  <MetaRow label="Dataset" value={layer.datasetName} />
                  <MetaRow label="Source organization" value={layer.sourceOrganization} />
                  <MetaRow
                    label="Source URL"
                    value={
                      <a
                        href={layer.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-water underline-offset-2 hover:underline"
                      >
                        {layer.sourceUrl}
                      </a>
                    }
                  />
                  <MetaRow label="Date" value={layer.date} />
                  <MetaRow label="Resolution" value={layer.geographicResolution} />
                  <MetaRow label="Last updated" value={layer.lastUpdated} />
                  <MetaRow label="Methodology" value={layer.methodology} />
                </dl>
              );
            })()}
          </div>
        )}
      </aside>

      <div className="space-y-4">
        <NeedMap
          organizations={organizations}
          activeLayers={activeLayers}
          gaps={gaps}
          showGaps={showGaps}
        />

        <div className="panel p-4">
          <p className="label-caps">Classification key</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {(Object.keys(GAP_CLASSIFICATION_LABELS) as Array<keyof typeof GAP_CLASSIFICATION_LABELS>).map(
              (key) => {
                const item = GAP_CLASSIFICATION_LABELS[key];
                return (
                  <div key={key} className="rounded-[2px] border border-ink/10 p-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-[2px]"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-ink">{item.label}</span>
                    </div>
                    <p className="mt-1 text-xs text-ink-muted">{item.description}</p>
                  </div>
                );
              }
            )}
          </div>
        </div>

        <div className="panel overflow-hidden">
          <div className="border-b border-ink/10 px-4 py-3">
            <p className="label-caps">Highest relative gap scores (demo)</p>
          </div>
          <div className="custom-scroll overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-sand-dim/50 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                <tr>
                  <th className="px-4 py-2 font-medium">State</th>
                  <th className="px-4 py-2 font-medium">Need</th>
                  <th className="px-4 py-2 font-medium">Presence</th>
                  <th className="px-4 py-2 font-medium">Gap</th>
                  <th className="px-4 py-2 font-medium">Orgs</th>
                  <th className="px-4 py-2 font-medium">Class</th>
                </tr>
              </thead>
              <tbody>
                {rankedGaps.map((g) => (
                  <tr key={g.stateCode} className="border-t border-ink/10">
                    <td className="px-4 py-2 font-medium text-ink">
                      {g.stateName}
                    </td>
                    <td className="px-4 py-2 font-mono text-xs">{g.needScore.toFixed(2)}</td>
                    <td className="px-4 py-2 font-mono text-xs">
                      {g.presenceScore.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 font-mono text-xs">{g.gapScore.toFixed(2)}</td>
                    <td className="px-4 py-2">{g.organizationCount}</td>
                    <td className="px-4 py-2 text-xs text-ink-muted">
                      {GAP_CLASSIFICATION_LABELS[g.classification].label}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="font-mono text-[9px] uppercase tracking-wider text-ink-faint">{label}</dt>
      <dd className="mt-0.5 text-ink">{value}</dd>
    </div>
  );
}
