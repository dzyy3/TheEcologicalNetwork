/** Core domain types for The Ecological Network */

export type VerificationStatus =
  | "PENDING_REVIEW"
  | "REGISTERED"
  | "VERIFIED"
  | "IMPACT_DOCUMENTED"
  | "NETWORK_PARTNER";

export type OrganizationType =
  | "Nonprofit"
  | "Research Institute"
  | "Land Trust"
  | "Community Organization"
  | "Tribal Organization"
  | "Coalition"
  | "University Program"
  | "Government Partner";

export type EcologicalCategory =
  | "Biodiversity"
  | "Conservation"
  | "Restoration"
  | "Wildlife"
  | "Forests"
  | "Wetlands"
  | "Water"
  | "Oceans"
  | "Pollution"
  | "Climate"
  | "Invasive species"
  | "Environmental justice"
  | "Urban ecology"
  | "Land conservation"
  | "Research"
  | "Education"
  | "Indigenous stewardship";

export type Ecosystem =
  | "Grasslands"
  | "Forests"
  | "Wetlands"
  | "Rivers & Streams"
  | "Lakes"
  | "Coastal"
  | "Marine"
  | "Desert"
  | "Alpine"
  | "Urban"
  | "Agricultural"
  | "Estuaries"
  | "Prairies"
  | "Chaparral";

export type RelationshipType =
  | "Partnership"
  | "Shared project"
  | "Funding"
  | "Research collaboration"
  | "Government partnership"
  | "University partnership"
  | "Shared conservation area"
  | "Coalition membership";

export type SourceType =
  | "Official website"
  | "IRS nonprofit information"
  | "State nonprofit registry"
  | "Annual report"
  | "Government database"
  | "Scientific publication"
  | "University research"
  | "Conservation database"
  | "Other";

export interface Source {
  id: string;
  label: string;
  type: SourceType;
  url?: string;
  accessedAt?: string;
  notes?: string;
}

export interface Location {
  id: string;
  label: string;
  city: string;
  state: string;
  stateCode: string;
  latitude: number;
  longitude: number;
  isPrimary: boolean;
  serviceAreaDescription?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Completed" | "Planned";
  yearStarted?: number;
  ecosystems?: Ecosystem[];
  sourceIds?: string[];
}

export interface ImpactMetric {
  id: string;
  label: string;
  /** Demo metrics are synthetic placeholders — never treat as real outcomes */
  value: string;
  unit?: string;
  year?: number;
  isDemoPlaceholder: boolean;
  sourceIds?: string[];
  notes?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  /** All seed records are demo/fictional — never present as real orgs */
  isDemoData: boolean;
  website?: string;
  logoInitials: string;
  logoColor: string;
  foundedYear: number;
  organizationType: OrganizationType;
  mission: string;
  primaryFocus: EcologicalCategory;
  secondaryFocus: EcologicalCategory[];
  categories: EcologicalCategory[];
  ecosystems: Ecosystem[];
  geographicServiceArea: string;
  locations: Location[];
  projects: Project[];
  impactMetrics: ImpactMetric[];
  partnerIds: string[];
  verificationStatus: VerificationStatus;
  lastVerified?: string;
  sources: Source[];
  contactEmail?: string;
}

export interface Partnership {
  id: string;
  sourceOrgId: string;
  targetOrgId: string;
  type: RelationshipType;
  description: string;
  sharedEcosystems?: Ecosystem[];
  geographicConnection?: string;
  isDemoData: boolean;
  sourceIds?: string[];
}

export interface EnvironmentalLayer {
  id: string;
  name: string;
  description: string;
  /** Placeholder intensity grid for demo visualization only */
  isDemoPlaceholder: boolean;
  datasetName: string;
  sourceOrganization: string;
  sourceUrl: string;
  date: string;
  geographicResolution: string;
  methodology: string;
  lastUpdated: string;
  color: string;
  /** State-level demo intensity 0–1 (synthetic for UI demo) */
  stateIntensities: Record<string, number>;
}

export interface OrganizationFilters {
  search: string;
  categories: EcologicalCategory[];
  states: string[];
  ecosystems: Ecosystem[];
  organizationTypes: OrganizationType[];
  verificationLevels: VerificationStatus[];
  minAgeYears: number | null;
  maxAgeYears: number | null;
}

export interface GapScore {
  stateCode: string;
  stateName: string;
  needScore: number;
  presenceScore: number;
  /** need - presence; higher = potential support gap */
  gapScore: number;
  classification:
    | "potential_support_gap"
    | "highly_supported"
    | "high_concentration"
    | "low_activity";
  organizationCount: number;
}

export interface SubmissionPayload {
  name: string;
  website: string;
  city: string;
  state: string;
  foundedYear: number;
  organizationType: OrganizationType;
  mission: string;
  primaryFocus: EcologicalCategory;
  secondaryFocus: EcologicalCategory[];
  ecosystems: Ecosystem[];
  geographicServiceArea: string;
  majorProjects: string;
  impactMetrics: string;
  partnerOrganizations: string;
  contactEmail: string;
  supportingSources: string;
  accuracyConfirmed: boolean;
}

export const US_STATES: { code: string; name: string }[] = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
  { code: "DC", name: "District of Columbia" },
];

export const ALL_CATEGORIES: EcologicalCategory[] = [
  "Biodiversity",
  "Conservation",
  "Restoration",
  "Wildlife",
  "Forests",
  "Wetlands",
  "Water",
  "Oceans",
  "Pollution",
  "Climate",
  "Invasive species",
  "Environmental justice",
  "Urban ecology",
  "Land conservation",
  "Research",
  "Education",
  "Indigenous stewardship",
];

export const ALL_ECOSYSTEMS: Ecosystem[] = [
  "Grasslands",
  "Forests",
  "Wetlands",
  "Rivers & Streams",
  "Lakes",
  "Coastal",
  "Marine",
  "Desert",
  "Alpine",
  "Urban",
  "Agricultural",
  "Estuaries",
  "Prairies",
  "Chaparral",
];

export const ALL_ORG_TYPES: OrganizationType[] = [
  "Nonprofit",
  "Research Institute",
  "Land Trust",
  "Community Organization",
  "Tribal Organization",
  "Coalition",
  "University Program",
  "Government Partner",
];

export const VERIFICATION_LEVELS: VerificationStatus[] = [
  "REGISTERED",
  "VERIFIED",
  "IMPACT_DOCUMENTED",
  "NETWORK_PARTNER",
];
