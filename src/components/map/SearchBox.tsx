"use client";

import { useMemo, useState } from "react";
import { Search, MapPin, Building2 } from "lucide-react";
import { searchPlaces } from "@/lib/data";
import type { Organization } from "@/types";

export function SearchBox({
  organizations,
  value,
  onChange,
  onSelectOrg,
  onSelectPlace,
}: {
  organizations: Organization[];
  value: string;
  onChange: (v: string) => void;
  onSelectOrg: (orgId: string) => void;
  onSelectPlace: (lat: number, lng: number, label: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const results = useMemo(
    () => searchPlaces(value, organizations),
    [value, organizations]
  );

  return (
    <div className="relative">
      <div className="panel flex items-center gap-2 px-3 py-2">
        <Search className="h-4 w-4 shrink-0 text-ink-muted" />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Search organization, city, or state…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-ink-faint"
          aria-label="Search organizations and places"
        />
      </div>
      {focused && value.trim() && results.length > 0 && (
        <ul className="panel absolute left-0 right-0 top-full z-30 mt-1 max-h-64 overflow-y-auto py-1">
          {results.map((r, i) => (
            <li key={`${r.type}-${r.label}-${i}`}>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-ink/[0.03]"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  if (r.type === "organization" && r.orgId) {
                    onSelectOrg(r.orgId);
                  } else if (r.lat != null && r.lng != null) {
                    onSelectPlace(r.lat, r.lng, r.label);
                  }
                  onChange(r.type === "organization" ? r.label : r.label);
                }}
              >
                {r.type === "organization" ? (
                  <Building2 className="h-3.5 w-3.5 text-moss" />
                ) : (
                  <MapPin className="h-3.5 w-3.5 text-water" />
                )}
                <span className="truncate">{r.label.replace(/^\[DEMO\]\s*/, "")}</span>
                <span className="ml-auto font-mono text-[9px] uppercase tracking-wider text-ink-faint">
                  {r.type}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
