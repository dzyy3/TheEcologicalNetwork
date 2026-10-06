"use client";

import type { Organization } from "@/types";
import { OrgLogo } from "@/components/ui/OrgLogo";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { List, Map as MapIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ViewToggle({
  view,
  onChange,
}: {
  view: "map" | "list";
  onChange: (v: "map" | "list") => void;
}) {
  return (
    <div className="flex border border-ink/15 p-0.5">
      <button
        type="button"
        onClick={() => onChange("map")}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.1em] transition duration-200",
          view === "map" ? "bg-canopy text-sand-bright" : "text-ink-muted hover:text-canopy"
        )}
      >
        <MapIcon className="h-3.5 w-3.5" /> Map
      </button>
      <button
        type="button"
        onClick={() => onChange("list")}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.1em] transition duration-200",
          view === "list" ? "bg-canopy text-sand-bright" : "text-ink-muted hover:text-canopy"
        )}
      >
        <List className="h-3.5 w-3.5" /> List
      </button>
    </div>
  );
}

export function OrgListView({
  organizations,
  selectedId,
  onSelect,
}: {
  organizations: Organization[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="custom-scroll h-full overflow-y-auto bg-sand p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="label-caps text-canopy">
          {organizations.length} organization{organizations.length === 1 ? "" : "s"}
        </p>
        <p className="index-mark">List index</p>
      </div>
      <ul className="space-y-2">
        {organizations.map((org, i) => {
          const loc = org.locations[0];
          return (
            <li key={org.id}>
              <button
                type="button"
                onClick={() => onSelect(org.id)}
                className={cn(
                  "flex w-full items-start gap-3 border px-3.5 py-3 text-left transition duration-200",
                  selectedId === org.id
                    ? "border-canopy/40 bg-sand-bright shadow-soft"
                    : "border-ink/10 bg-sand-bright hover:border-canopy/30 hover:shadow-soft"
                )}
              >
                <span className="pt-1 font-mono text-[9px] text-ink-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <OrgLogo org={org} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-ink">
                      {org.name.replace(/^\[DEMO\]\s*/, "")}
                    </span>
                    <VerificationBadge status={org.verificationStatus} size="sm" />
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                    {loc?.city}, {loc?.stateCode} · {org.primaryFocus} ·{" "}
                    {org.organizationType}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
