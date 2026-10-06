"use client";

import type {
  EcologicalCategory,
  Ecosystem,
  OrganizationFilters,
  OrganizationType,
  VerificationStatus,
} from "@/types";
import {
  ALL_CATEGORIES,
  ALL_ECOSYSTEMS,
  ALL_ORG_TYPES,
  US_STATES,
  VERIFICATION_LEVELS,
} from "@/types";
import { VERIFICATION_META, cn } from "@/lib/utils";
import { ChevronDown, Filter, RotateCcw } from "lucide-react";
import { useState } from "react";

const emptyFilters: OrganizationFilters = {
  search: "",
  categories: [],
  states: [],
  ecosystems: [],
  organizationTypes: [],
  verificationLevels: [],
  minAgeYears: null,
  maxAgeYears: null,
};

export function MapFilters({
  filters,
  onChange,
  densityMode,
  onDensityChange,
  className,
}: {
  filters: OrganizationFilters;
  onChange: (next: OrganizationFilters) => void;
  densityMode: boolean;
  onDensityChange: (v: boolean) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  function toggle<T>(key: keyof OrganizationFilters, value: T) {
    const current = filters[key] as T[];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  }

  const activeCount =
    filters.categories.length +
    filters.states.length +
    filters.ecosystems.length +
    filters.organizationTypes.length +
    filters.verificationLevels.length +
    (filters.minAgeYears != null ? 1 : 0) +
    (filters.maxAgeYears != null ? 1 : 0);

  return (
    <div className={cn("panel overflow-hidden", className)}>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left md:cursor-default"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="flex items-center gap-2 text-sm font-medium text-ink">
          <Filter className="h-3.5 w-3.5 text-canopy" />
          Filters
          {activeCount > 0 && (
            <span className="bg-canopy px-1.5 py-0.5 font-mono text-[10px] text-sand-bright">
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-ink-muted transition md:hidden",
            open && "rotate-180"
          )}
        />
      </button>

      <div
        className={cn(
          "custom-scroll max-h-[55vh] space-y-4 overflow-y-auto border-t border-ink/10 px-3 py-3",
          !open && "hidden md:block"
        )}
      >
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="text-ink">Organization density</span>
          <input
            type="checkbox"
            checked={densityMode}
            onChange={(e) => onDensityChange(e.target.checked)}
            className="h-4 w-4 accent-canopy"
          />
        </label>

        <FilterGroup title="Category">
          <ChipGroup
            options={ALL_CATEGORIES}
            selected={filters.categories}
            onToggle={(v) => toggle<EcologicalCategory>("categories", v)}
          />
        </FilterGroup>

        <FilterGroup title="State">
          <select
            className="field"
            value=""
            onChange={(e) => {
              if (!e.target.value) return;
              toggle("states", e.target.value);
              e.target.value = "";
            }}
          >
            <option value="">Add state…</option>
            {US_STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
          {filters.states.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {filters.states.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => toggle("states", code)}
                  className="rounded-[2px] border border-water/25 bg-water/[0.06] px-2 py-0.5 font-mono text-[10px] text-water"
                >
                  {code} ×
                </button>
              ))}
            </div>
          )}
        </FilterGroup>

        <FilterGroup title="Organization age (years)">
          <div className="flex gap-2">
            <input
              type="number"
              min={0}
              placeholder="Min"
              value={filters.minAgeYears ?? ""}
              onChange={(e) =>
                onChange({
                  ...filters,
                  minAgeYears: e.target.value === "" ? null : Number(e.target.value),
                })
              }
              className="field"
            />
            <input
              type="number"
              min={0}
              placeholder="Max"
              value={filters.maxAgeYears ?? ""}
              onChange={(e) =>
                onChange({
                  ...filters,
                  maxAgeYears: e.target.value === "" ? null : Number(e.target.value),
                })
              }
              className="field"
            />
          </div>
        </FilterGroup>

        <FilterGroup title="Verification level">
          <ChipGroup
            options={VERIFICATION_LEVELS}
            selected={filters.verificationLevels}
            label={(v) => VERIFICATION_META[v as VerificationStatus].short}
            onToggle={(v) => toggle<VerificationStatus>("verificationLevels", v)}
          />
        </FilterGroup>

        <FilterGroup title="Ecosystem">
          <ChipGroup
            options={ALL_ECOSYSTEMS}
            selected={filters.ecosystems}
            onToggle={(v) => toggle<Ecosystem>("ecosystems", v)}
          />
        </FilterGroup>

        <FilterGroup title="Organization type">
          <ChipGroup
            options={ALL_ORG_TYPES}
            selected={filters.organizationTypes}
            onToggle={(v) => toggle<OrganizationType>("organizationTypes", v)}
          />
        </FilterGroup>

        <button
          type="button"
          className="btn-ghost w-full justify-start gap-2 text-xs"
          onClick={() => onChange({ ...emptyFilters, search: filters.search })}
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset filters
        </button>
      </div>
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="label-caps mb-2">{title}</p>
      {children}
    </div>
  );
}

function ChipGroup<T extends string>({
  options,
  selected,
  onToggle,
  label,
}: {
  options: readonly T[];
  selected: T[];
  onToggle: (v: T) => void;
  label?: (v: T) => string;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={cn(
              "border px-2 py-0.5 text-[11px] transition duration-150",
              active
                ? "border-canopy bg-canopy text-sand-bright"
                : "border-ink/15 text-ink-muted hover:border-canopy/40 hover:text-canopy"
            )}
          >
            {label ? label(opt) : opt}
          </button>
        );
      })}
    </div>
  );
}

export { emptyFilters };
