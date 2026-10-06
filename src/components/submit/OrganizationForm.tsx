"use client";

import { useState } from "react";
import type {
  EcologicalCategory,
  Ecosystem,
  OrganizationType,
  SubmissionPayload,
} from "@/types";
import { ALL_CATEGORIES, ALL_ECOSYSTEMS, ALL_ORG_TYPES, US_STATES } from "@/types";
import { CheckCircle2 } from "lucide-react";

const initial: SubmissionPayload = {
  name: "",
  website: "",
  city: "",
  state: "",
  foundedYear: new Date().getFullYear() - 3,
  organizationType: "Nonprofit",
  mission: "",
  primaryFocus: "Conservation",
  secondaryFocus: [],
  ecosystems: [],
  geographicServiceArea: "",
  majorProjects: "",
  impactMetrics: "",
  partnerOrganizations: "",
  contactEmail: "",
  supportingSources: "",
  accuracyConfirmed: false,
};

export function OrganizationForm() {
  const [form, setForm] = useState<SubmissionPayload>(initial);
  const [logoName, setLogoName] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  function update<K extends keyof SubmissionPayload>(key: K, value: SubmissionPayload[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleSecondary(cat: EcologicalCategory) {
    setForm((f) => ({
      ...f,
      secondaryFocus: f.secondaryFocus.includes(cat)
        ? f.secondaryFocus.filter((c) => c !== cat)
        : [...f.secondaryFocus, cat],
    }));
  }

  function toggleEcosystem(eco: Ecosystem) {
    setForm((f) => ({
      ...f,
      ecosystems: f.ecosystems.includes(eco)
        ? f.ecosystems.filter((e) => e !== eco)
        : [...f.ecosystems, eco],
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.accuracyConfirmed) {
      setError("Please confirm that the submitted information is accurate.");
      return;
    }
    if (!form.name.trim() || !form.mission.trim() || !form.contactEmail.trim()) {
      setError("Name, mission, and contact email are required.");
      return;
    }
    const age = new Date().getFullYear() - form.foundedYear;
    if (age < 2.5) {
      setError(
        "Eligibility requires the organization to have existed for at least 2.5 years."
      );
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          logoFileName: logoName,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setSubmissionId(data.id);
      setStatus("success");
      setForm(initial);
      setLogoName(null);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Submission failed");
    }
  }

  if (status === "success") {
    return (
      <div className="panel mx-auto max-w-xl p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-moss" />
        <h2 className="mt-4 font-display text-2xl text-ink">Submission received</h2>
        <p className="mt-2 text-sm text-ink-muted">
          Your organization has been marked{" "}
          <span className="font-mono text-xs uppercase tracking-wider text-ink">
            Pending Review
          </span>
          . It will not appear as verified until independently reviewed against inclusion
          criteria.
        </p>
        {submissionId && (
          <p className="mt-3 font-mono text-xs text-ink-faint">Reference: {submissionId}</p>
        )}
        <button
          type="button"
          className="btn-secondary mt-6"
          onClick={() => setStatus("idle")}
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="panel mx-auto max-w-3xl space-y-8 p-5 md:p-8">
      <div>
        <p className="label-caps text-moss">Inclusion criteria</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-ink-muted">
          <li>Existed for at least 2.5 years</li>
          <li>Documented environmental/ecological mission</li>
          <li>Documented projects, programs, research, advocacy, or related activity</li>
          <li>Verifiable website or public source</li>
          <li>Documented geographic location or service area</li>
          <li>At least one meaningful impact metric or body of evidence</li>
        </ul>
      </div>

      <fieldset className="grid gap-4 md:grid-cols-2">
        <Field label="Organization name" required>
          <input
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="field"
          />
        </Field>
        <Field label="Website">
          <input
            type="url"
            placeholder="https://"
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
            className="field"
          />
        </Field>
        <Field label="City" required>
          <input
            required
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            className="field"
          />
        </Field>
        <Field label="State" required>
          <select
            required
            value={form.state}
            onChange={(e) => update("state", e.target.value)}
            className="field"
          >
            <option value="">Select…</option>
            {US_STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Founded year" required>
          <input
            type="number"
            required
            min={1600}
            max={new Date().getFullYear()}
            value={form.foundedYear}
            onChange={(e) => update("foundedYear", Number(e.target.value))}
            className="field"
          />
        </Field>
        <Field label="Organization type" required>
          <select
            value={form.organizationType}
            onChange={(e) => update("organizationType", e.target.value as OrganizationType)}
            className="field"
          >
            {ALL_ORG_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
      </fieldset>

      <Field label="Mission" required>
        <textarea
          required
          rows={4}
          value={form.mission}
          onChange={(e) => update("mission", e.target.value)}
          className="field"
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Primary ecological focus" required>
          <select
            value={form.primaryFocus}
            onChange={(e) => update("primaryFocus", e.target.value as EcologicalCategory)}
            className="field"
          >
            {ALL_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Contact email" required>
          <input
            type="email"
            required
            value={form.contactEmail}
            onChange={(e) => update("contactEmail", e.target.value)}
            className="field"
          />
        </Field>
      </div>

      <Field label="Secondary ecological focus">
        <div className="flex flex-wrap gap-1.5">
          {ALL_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => toggleSecondary(c)}
              className={`rounded-[2px] border px-2 py-1 text-xs ${
                form.secondaryFocus.includes(c)
                  ? "border-canopy bg-canopy text-sand-bright"
                  : "border-ink/10 text-ink-muted"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Ecosystems served">
        <div className="flex flex-wrap gap-1.5">
          {ALL_ECOSYSTEMS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => toggleEcosystem(e)}
              className={`rounded-[2px] border px-2 py-1 text-xs ${
                form.ecosystems.includes(e)
                  ? "border-canopy bg-canopy text-sand-bright"
                  : "border-ink/10 text-ink-muted"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Geographic service area" required>
        <textarea
          required
          rows={2}
          value={form.geographicServiceArea}
          onChange={(e) => update("geographicServiceArea", e.target.value)}
          className="field"
        />
      </Field>

      <Field label="Major projects" required>
        <textarea
          required
          rows={3}
          placeholder="Describe documented projects or programs"
          value={form.majorProjects}
          onChange={(e) => update("majorProjects", e.target.value)}
          className="field"
        />
      </Field>

      <Field label="Impact metrics / evidence" required>
        <textarea
          required
          rows={3}
          placeholder="Describe measurable outcomes or evidence bodies (do not invent statistics)"
          value={form.impactMetrics}
          onChange={(e) => update("impactMetrics", e.target.value)}
          className="field"
        />
      </Field>

      <Field label="Partner organizations">
        <textarea
          rows={2}
          value={form.partnerOrganizations}
          onChange={(e) => update("partnerOrganizations", e.target.value)}
          className="field"
        />
      </Field>

      <Field label="Supporting sources" required>
        <textarea
          required
          rows={3}
          placeholder="Website, annual reports, registries, publications…"
          value={form.supportingSources}
          onChange={(e) => update("supportingSources", e.target.value)}
          className="field"
        />
      </Field>

      <Field label="Logo upload">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogoName(e.target.files?.[0]?.name ?? null)}
          className="block w-full text-sm text-ink-muted file:mr-3 file:rounded-[2px] file:border-0 file:bg-canopy file:px-3 file:py-1.5 file:text-sm file:text-sand-bright"
        />
        {logoName && (
          <p className="mt-1 font-mono text-[10px] text-ink-faint">
            Selected: {logoName} (stored as filename reference in demo mode)
          </p>
        )}
      </Field>

      <label className="flex items-start gap-3 rounded-[2px] border border-ink/10 bg-sand px-3 py-3 text-sm">
        <input
          type="checkbox"
          checked={form.accuracyConfirmed}
          onChange={(e) => update("accuracyConfirmed", e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-canopy"
        />
        <span>
          I confirm that the information submitted is accurate to the best of my knowledge
          and that I am authorized to submit it.
        </span>
      </label>

      {error && (
        <p className="rounded-[2px] border border-signal/40 bg-signal/10 px-3 py-2 text-sm text-signal">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary w-full md:w-auto"
      >
        {status === "submitting" ? "Submitting…" : "Submit for review"}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="label-caps">
        {label}
        {required ? " *" : ""}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
