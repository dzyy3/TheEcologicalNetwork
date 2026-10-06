import { DEMO_ORGANIZATIONS } from "@/data/organizations";
import { DEMO_PARTNERSHIPS } from "@/data/partnerships";
import { DEMO_ENVIRONMENTAL_LAYERS } from "@/data/environmental-layers";
import type {
  EnvironmentalLayer,
  Organization,
  OrganizationFilters,
  Partnership,
  SubmissionPayload,
  VerificationStatus,
} from "@/types";

/**
 * Data access layer.
 * Currently backed by in-memory demo data.
 * Swap implementations here when connecting to Supabase/PostgreSQL —
 * page and component code should not need to change.
 */

const CURRENT_YEAR = new Date().getFullYear();

export function getOrganizations(): Organization[] {
  return DEMO_ORGANIZATIONS;
}

export function getOrganizationById(id: string): Organization | undefined {
  return DEMO_ORGANIZATIONS.find((o) => o.id === id);
}

export function getOrganizationBySlug(slug: string): Organization | undefined {
  return DEMO_ORGANIZATIONS.find((o) => o.slug === slug);
}

export function getPartnerships(): Partnership[] {
  return DEMO_PARTNERSHIPS;
}

export function getPartnershipsForOrg(orgId: string): Partnership[] {
  return DEMO_PARTNERSHIPS.filter(
    (p) => p.sourceOrgId === orgId || p.targetOrgId === orgId
  );
}

export function getEnvironmentalLayers(): EnvironmentalLayer[] {
  return DEMO_ENVIRONMENTAL_LAYERS;
}

export function getEnvironmentalLayerById(
  id: string
): EnvironmentalLayer | undefined {
  return DEMO_ENVIRONMENTAL_LAYERS.find((l) => l.id === id);
}

export function filterOrganizations(
  filters: Partial<OrganizationFilters>,
  organizations: Organization[] = DEMO_ORGANIZATIONS
): Organization[] {
  const search = filters.search?.trim().toLowerCase() ?? "";
  const minAge = filters.minAgeYears;
  const maxAge = filters.maxAgeYears;

  return organizations.filter((org) => {
    const age = CURRENT_YEAR - org.foundedYear;
    const primary = org.locations.find((l) => l.isPrimary) ?? org.locations[0];

    if (search) {
      const haystack = [
        org.name,
        org.mission,
        org.primaryFocus,
        primary?.city,
        primary?.state,
        org.geographicServiceArea,
        ...org.categories,
        ...org.ecosystems,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(search)) return false;
    }

    if (filters.categories?.length) {
      if (!filters.categories.some((c) => org.categories.includes(c))) return false;
    }

    if (filters.states?.length) {
      const orgStates = org.locations.map((l) => l.stateCode);
      if (!filters.states.some((s) => orgStates.includes(s))) return false;
    }

    if (filters.ecosystems?.length) {
      if (!filters.ecosystems.some((e) => org.ecosystems.includes(e))) return false;
    }

    if (filters.organizationTypes?.length) {
      if (!filters.organizationTypes.includes(org.organizationType)) return false;
    }

    if (filters.verificationLevels?.length) {
      if (!filters.verificationLevels.includes(org.verificationStatus)) return false;
    }

    if (minAge != null && age < minAge) return false;
    if (maxAge != null && age > maxAge) return false;

    return true;
  });
}

export function getRegistryStats(organizations: Organization[] = DEMO_ORGANIZATIONS) {
  const states = new Set(
    organizations.flatMap((o) => o.locations.map((l) => l.stateCode))
  );
  const ecosystems = new Set(organizations.flatMap((o) => o.ecosystems));
  const verified = organizations.filter((o) =>
    (["VERIFIED", "IMPACT_DOCUMENTED", "NETWORK_PARTNER"] as VerificationStatus[]).includes(
      o.verificationStatus
    )
  );
  const partnerships = getPartnerships().length;

  return {
    organizationsMapped: organizations.length,
    statesRepresented: states.size,
    ecosystemsRepresented: ecosystems.size,
    verifiedOrganizations: verified.length,
    documentedPartnerships: partnerships,
    isDemoData: organizations.every((o) => o.isDemoData),
  };
}

export function searchPlaces(
  query: string,
  organizations: Organization[] = DEMO_ORGANIZATIONS
): { type: "organization" | "place"; label: string; orgId?: string; lat?: number; lng?: number; stateCode?: string }[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: {
    type: "organization" | "place";
    label: string;
    orgId?: string;
    lat?: number;
    lng?: number;
    stateCode?: string;
  }[] = [];

  for (const org of organizations) {
    if (org.name.toLowerCase().includes(q)) {
      const loc = org.locations[0];
      results.push({
        type: "organization",
        label: org.name,
        orgId: org.id,
        lat: loc?.latitude,
        lng: loc?.longitude,
        stateCode: loc?.stateCode,
      });
    }
  }

  const places = new Map<string, { label: string; lat: number; lng: number; stateCode: string }>();
  for (const org of organizations) {
    for (const loc of org.locations) {
      const cityKey = `${loc.city}, ${loc.stateCode}`;
      if (loc.city.toLowerCase().includes(q) || loc.state.toLowerCase().includes(q) || loc.stateCode.toLowerCase() === q) {
        if (!places.has(cityKey)) {
          places.set(cityKey, {
            label: cityKey,
            lat: loc.latitude,
            lng: loc.longitude,
            stateCode: loc.stateCode,
          });
        }
      }
    }
  }
  for (const p of places.values()) {
    results.push({ type: "place", ...p });
  }

  return results.slice(0, 12);
}

/** In-memory submission store for demo (replace with DB insert) */
const submissions: { id: string; payload: SubmissionPayload; status: VerificationStatus; submittedAt: string }[] = [];

export function submitOrganization(payload: SubmissionPayload) {
  const record = {
    id: `sub-${Date.now()}`,
    payload,
    status: "PENDING_REVIEW" as VerificationStatus,
    submittedAt: new Date().toISOString(),
  };
  submissions.push(record);
  return record;
}

export function getSubmissions() {
  return submissions;
}
