"use client";

import type { Organization } from "@/types";
import { OrgLogo } from "@/components/ui/OrgLogo";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { VERIFICATION_META, orgAgeYears } from "@/lib/utils";
import { ExternalLink, X } from "lucide-react";

export function OrgPanel({
  org,
  onClose,
  partners,
}: {
  org: Organization;
  onClose: () => void;
  partners: Organization[];
}) {
  const loc = org.locations.find((l) => l.isPrimary) ?? org.locations[0];
  const meta = VERIFICATION_META[org.verificationStatus];

  return (
    <aside className="panel absolute bottom-3 left-3 right-3 z-20 flex max-h-[70vh] flex-col overflow-hidden md:bottom-4 md:left-auto md:right-4 md:top-4 md:max-h-[calc(100%-2rem)] md:w-[380px]">
      <div className="flex items-start gap-3 border-b border-ink/10 p-4">
        <OrgLogo org={org} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              {org.isDemoData && (
                <span className="label-caps text-signal">Demo data</span>
              )}
              <h2 className="font-display text-xl font-medium leading-tight tracking-tight text-ink md:text-[1.35rem]">
                {org.name.replace(/^\[DEMO\]\s*/, "")}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                {loc?.city}, {loc?.state} · Est. {org.foundedYear} (
                {orgAgeYears(org.foundedYear)} yrs)
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost shrink-0 p-1"
              aria-label="Close panel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <VerificationBadge status={org.verificationStatus} />
            <span className="chip">{org.organizationType}</span>
          </div>
        </div>
      </div>

      <div className="custom-scroll flex-1 space-y-5 overflow-y-auto p-4 text-sm">
        <section>
          <p className="label-caps">Mission</p>
          <p className="mt-2 leading-[1.65] text-ink">{org.mission}</p>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <div>
            <p className="label-caps">Primary focus</p>
            <p className="mt-1.5 font-medium text-ink">{org.primaryFocus}</p>
          </div>
          <div>
            <p className="label-caps">Verification</p>
            <p className="mt-1.5 text-ink-muted">{meta.label}</p>
          </div>
        </section>

        <section>
          <p className="label-caps">Ecosystems served</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {org.ecosystems.map((e) => (
              <span key={e} className="chip">
                {e}
              </span>
            ))}
          </div>
        </section>

        <section>
          <p className="label-caps">Categories</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {org.categories.map((c) => (
              <span key={c} className="chip">
                {c}
              </span>
            ))}
          </div>
        </section>

        <section>
          <p className="label-caps">Geographic service area</p>
          <p className="mt-2 leading-[1.65] text-ink">{org.geographicServiceArea}</p>
        </section>

        <section>
          <p className="label-caps">Major projects</p>
          <ul className="mt-2 space-y-3">
            {org.projects.map((p) => (
              <li key={p.id} className="border-l border-ink/20 pl-3">
                <p className="font-medium text-ink">{p.name}</p>
                <p className="mt-0.5 leading-relaxed text-ink-muted">{p.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <p className="label-caps">Documented impact</p>
          <ul className="mt-2 space-y-2">
            {org.impactMetrics.map((m) => (
              <li
                key={m.id}
                className="rounded-[2px] border border-dashed border-signal/35 bg-signal/[0.04] px-3 py-2"
              >
                <p className="font-medium text-ink">{m.label}</p>
                <p className="mt-0.5 font-mono text-xs text-signal">
                  {m.value}
                  {m.unit ? ` ${m.unit}` : ""} — DEMO PLACEHOLDER
                </p>
              </li>
            ))}
          </ul>
        </section>

        {partners.length > 0 && (
          <section>
            <p className="label-caps">Partner organizations</p>
            <ul className="mt-2 space-y-2">
              {partners.map((p) => (
                <li key={p.id} className="flex items-center gap-2">
                  <OrgLogo org={p} size="sm" />
                  <span className="text-ink">
                    {p.name.replace(/^\[DEMO\]\s*/, "")}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <p className="label-caps">Sources / verification</p>
          <ul className="mt-2 space-y-2 text-ink-muted">
            {org.sources.map((s) => (
              <li key={s.id}>
                <span className="text-ink">{s.label}</span>
                {s.notes && <span className="block text-xs">{s.notes}</span>}
              </li>
            ))}
            {org.lastVerified && (
              <li className="font-mono text-xs">
                last_verified: {org.lastVerified}
              </li>
            )}
          </ul>
        </section>
      </div>

      <div className="border-t border-ink/10 p-4">
        {org.website ? (
          <a
            href={org.website}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full"
          >
            Visit website <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : (
          <p className="rounded-[2px] border border-ink/10 bg-sand px-3 py-2 text-center text-xs text-ink-muted">
            No verified website URL on file for this demo record
          </p>
        )}
      </div>
    </aside>
  );
}
