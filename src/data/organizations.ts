import type {
  EcologicalCategory,
  Ecosystem,
  Organization,
  OrganizationType,
  VerificationStatus,
} from "@/types";

/**
 * DEMO DATA ONLY
 * All organizations below are fictional placeholders for interface demonstration.
 * They are not real organizations. Coordinates are approximate US city centers
 * used only to place demo markers. Impact values are synthetic placeholders.
 */

const currentYear = new Date().getFullYear();

function ageYears(founded: number) {
  return currentYear - founded;
}

function mustBeEligible(founded: number) {
  if (ageYears(founded) < 2.5) {
    throw new Error(`Demo org founded ${founded} fails 2.5-year eligibility`);
  }
}

type SeedInput = {
  id: string;
  name: string;
  slug: string;
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
  city: string;
  state: string;
  stateCode: string;
  lat: number;
  lng: number;
  projects: { name: string; description: string; yearStarted?: number }[];
  impactPlaceholders: { label: string; value: string; unit?: string }[];
  partnerIds: string[];
  verificationStatus: VerificationStatus;
  lastVerified?: string;
  sourceLabel: string;
};

function buildOrg(input: SeedInput): Organization {
  mustBeEligible(input.foundedYear);
  return {
    id: input.id,
    name: input.name,
    slug: input.slug,
    isDemoData: true,
    website: input.website,
    logoInitials: input.logoInitials,
    logoColor: input.logoColor,
    foundedYear: input.foundedYear,
    organizationType: input.organizationType,
    mission: input.mission,
    primaryFocus: input.primaryFocus,
    secondaryFocus: input.secondaryFocus,
    categories: input.categories,
    ecosystems: input.ecosystems,
    geographicServiceArea: input.geographicServiceArea,
    locations: [
      {
        id: `${input.id}-loc`,
        label: "Primary office (demo)",
        city: input.city,
        state: input.state,
        stateCode: input.stateCode,
        latitude: input.lat,
        longitude: input.lng,
        isPrimary: true,
        serviceAreaDescription: input.geographicServiceArea,
      },
    ],
    projects: input.projects.map((p, i) => ({
      id: `${input.id}-proj-${i}`,
      name: p.name,
      description: p.description,
      status: "Active" as const,
      yearStarted: p.yearStarted,
      ecosystems: input.ecosystems.slice(0, 2),
    })),
    impactMetrics: input.impactPlaceholders.map((m, i) => ({
      id: `${input.id}-impact-${i}`,
      label: m.label,
      value: m.value,
      unit: m.unit,
      year: currentYear - 1,
      isDemoPlaceholder: true,
      notes: "DEMO PLACEHOLDER — not a real measured outcome",
    })),
    partnerIds: input.partnerIds,
    verificationStatus: input.verificationStatus,
    lastVerified: input.lastVerified,
    sources: [
      {
        id: `${input.id}-src-1`,
        label: input.sourceLabel,
        type: "Other",
        notes: "Demo source record — replace with verified citations in production",
      },
    ],
  };
}

export const DEMO_ORGANIZATIONS: Organization[] = [
  buildOrg({
    id: "org-01",
    name: "[DEMO] Cascade Ridgeline Conservancy",
    slug: "demo-cascade-ridgeline",
    logoInitials: "CR",
    logoColor: "#667F86",
    foundedYear: 2008,
    organizationType: "Land Trust",
    mission:
      "Demo mission: protect ridgeline forest corridors and support community stewardship of Pacific Northwest habitats.",
    primaryFocus: "Land conservation",
    secondaryFocus: ["Forests", "Biodiversity"],
    categories: ["Land conservation", "Forests", "Biodiversity", "Conservation"],
    ecosystems: ["Forests", "Alpine"],
    geographicServiceArea: "Western Cascade foothills (demo service area)",
    city: "Portland",
    state: "Oregon",
    stateCode: "OR",
    lat: 45.5152,
    lng: -122.6784,
    projects: [
      {
        name: "Demo Corridor Protection Initiative",
        description: "Placeholder project describing ridgeline habitat connectivity planning.",
        yearStarted: 2019,
      },
    ],
    impactPlaceholders: [
      { label: "Demo acres under conservation planning", value: "—", unit: "placeholder" },
    ],
    partnerIds: ["org-02", "org-07"],
    verificationStatus: "NETWORK_PARTNER",
    lastVerified: "2025-11-12",
    sourceLabel: "Demo profile — no official website provided",
  }),
  buildOrg({
    id: "org-02",
    name: "[DEMO] Willamette Riparian Lab",
    slug: "demo-willamette-riparian",
    logoInitials: "WR",
    logoColor: "#172B29",
    foundedYear: 2012,
    organizationType: "Research Institute",
    mission:
      "Demo mission: study riverine restoration outcomes and share open methods for watershed recovery.",
    primaryFocus: "Research",
    secondaryFocus: ["Water", "Restoration"],
    categories: ["Research", "Water", "Restoration", "Wetlands"],
    ecosystems: ["Rivers & Streams", "Wetlands"],
    geographicServiceArea: "Willamette Basin (demo)",
    city: "Eugene",
    state: "Oregon",
    stateCode: "OR",
    lat: 44.0521,
    lng: -123.0868,
    projects: [
      {
        name: "Demo Riparian Monitoring Network",
        description: "Placeholder research network for streamside vegetation recovery indicators.",
        yearStarted: 2016,
      },
    ],
    impactPlaceholders: [
      { label: "Demo monitoring sites (synthetic)", value: "—", unit: "placeholder" },
    ],
    partnerIds: ["org-01", "org-08"],
    verificationStatus: "IMPACT_DOCUMENTED",
    lastVerified: "2025-09-03",
    sourceLabel: "Demo research profile",
  }),
  buildOrg({
    id: "org-03",
    name: "[DEMO] Bay Marsh Collective",
    slug: "demo-bay-marsh",
    logoInitials: "BM",
    logoColor: "#3A6B61",
    foundedYear: 2001,
    organizationType: "Nonprofit",
    mission:
      "Demo mission: restore tidal marsh function and engage coastal communities in wetland stewardship.",
    primaryFocus: "Wetlands",
    secondaryFocus: ["Oceans", "Climate"],
    categories: ["Wetlands", "Oceans", "Climate", "Restoration"],
    ecosystems: ["Wetlands", "Coastal", "Estuaries"],
    geographicServiceArea: "San Francisco Bay shoreline (demo)",
    city: "Oakland",
    state: "California",
    stateCode: "CA",
    lat: 37.8044,
    lng: -122.2712,
    projects: [
      {
        name: "Demo Tidal Marsh Reconnection",
        description: "Placeholder description of marsh hydrology reconnection work.",
        yearStarted: 2014,
      },
    ],
    impactPlaceholders: [
      { label: "Demo marsh acreage metric", value: "—", unit: "placeholder" },
    ],
    partnerIds: ["org-04", "org-12"],
    verificationStatus: "VERIFIED",
    lastVerified: "2026-01-20",
    sourceLabel: "Demo coastal profile",
  }),
  buildOrg({
    id: "org-04",
    name: "[DEMO] Sierra Pollinator Commons",
    slug: "demo-sierra-pollinator",
    logoInitials: "SP",
    logoColor: "#B08A52",
    foundedYear: 2015,
    organizationType: "Community Organization",
    mission:
      "Demo mission: expand native plant habitat for pollinators across foothill and valley landscapes.",
    primaryFocus: "Biodiversity",
    secondaryFocus: ["Education", "Restoration"],
    categories: ["Biodiversity", "Education", "Restoration", "Wildlife"],
    ecosystems: ["Chaparral", "Grasslands", "Agricultural"],
    geographicServiceArea: "Central Sierra foothills (demo)",
    city: "Sacramento",
    state: "California",
    stateCode: "CA",
    lat: 38.5816,
    lng: -121.4944,
    projects: [
      {
        name: "Demo Native Hedgerow Program",
        description: "Placeholder community planting and education program.",
        yearStarted: 2018,
      },
    ],
    impactPlaceholders: [
      { label: "Demo plantings recorded", value: "—", unit: "placeholder" },
    ],
    partnerIds: ["org-03", "org-05"],
    verificationStatus: "REGISTERED",
    lastVerified: "2025-06-01",
    sourceLabel: "Demo submission profile",
  }),
  buildOrg({
    id: "org-05",
    name: "[DEMO] Sonoran Drylands Alliance",
    slug: "demo-sonoran-drylands",
    logoInitials: "SD",
    logoColor: "#4A7A70",
    foundedYear: 2005,
    organizationType: "Nonprofit",
    mission:
      "Demo mission: conserve desert biodiversity and reduce invasive species pressure in arid ecosystems.",
    primaryFocus: "Invasive species",
    secondaryFocus: ["Biodiversity", "Conservation"],
    categories: ["Invasive species", "Biodiversity", "Conservation", "Wildlife"],
    ecosystems: ["Desert"],
    geographicServiceArea: "Sonoran Desert region (demo)",
    city: "Tucson",
    state: "Arizona",
    stateCode: "AZ",
    lat: 32.2226,
    lng: -110.9747,
    projects: [
      {
        name: "Demo Invasive Removal Crews",
        description: "Placeholder invasive plant removal and monitoring protocol.",
        yearStarted: 2011,
      },
    ],
    impactPlaceholders: [
      { label: "Demo treatment acres", value: "—", unit: "placeholder" },
    ],
    partnerIds: ["org-04", "org-06"],
    verificationStatus: "IMPACT_DOCUMENTED",
    lastVerified: "2025-10-18",
    sourceLabel: "Demo drylands profile",
  }),
  buildOrg({
    id: "org-06",
    name: "[DEMO] Rio Grande Bosque Trust",
    slug: "demo-rio-grande-bosque",
    logoInitials: "RG",
    logoColor: "#2A4F48",
    foundedYear: 1998,
    organizationType: "Land Trust",
    mission:
      "Demo mission: protect riparian bosque habitat and support community-led river stewardship.",
    primaryFocus: "Conservation",
    secondaryFocus: ["Water", "Land conservation"],
    categories: ["Conservation", "Water", "Land conservation", "Wildlife"],
    ecosystems: ["Rivers & Streams", "Forests"],
    geographicServiceArea: "Middle Rio Grande (demo)",
    city: "Albuquerque",
    state: "New Mexico",
    stateCode: "NM",
    lat: 35.0844,
    lng: -106.6504,
    projects: [
      {
        name: "Demo Bosque Restoration Reach",
        description: "Placeholder river corridor restoration planning.",
        yearStarted: 2009,
      },
    ],
    impactPlaceholders: [
      { label: "Demo corridor miles planned", value: "—", unit: "placeholder" },
    ],
    partnerIds: ["org-05", "org-15"],
    verificationStatus: "VERIFIED",
    lastVerified: "2025-12-02",
    sourceLabel: "Demo land trust profile",
  }),
  buildOrg({
    id: "org-07",
    name: "[DEMO] Olympic Kelp Observatory",
    slug: "demo-olympic-kelp",
    logoInitials: "OK",
    logoColor: "#315B52",
    foundedYear: 2010,
    organizationType: "Research Institute",
    mission:
      "Demo mission: monitor nearshore kelp forest health and inform coastal conservation practice.",
    primaryFocus: "Oceans",
    secondaryFocus: ["Research", "Climate"],
    categories: ["Oceans", "Research", "Climate", "Biodiversity"],
    ecosystems: ["Marine", "Coastal"],
    geographicServiceArea: "Olympic Peninsula coast (demo)",
    city: "Port Angeles",
    state: "Washington",
    stateCode: "WA",
    lat: 48.1181,
    lng: -123.4307,
    projects: [
      {
        name: "Demo Kelp Transect Survey",
        description: "Placeholder coastal monitoring methodology.",
        yearStarted: 2013,
      },
    ],
    impactPlaceholders: [
      { label: "Demo survey stations", value: "—", unit: "placeholder" },
    ],
    partnerIds: ["org-01", "org-16"],
    verificationStatus: "NETWORK_PARTNER",
    lastVerified: "2026-02-14",
    sourceLabel: "Demo marine profile",
  }),
  buildOrg({
    id: "org-08",
    name: "[DEMO] Great Lakes Urban Ecology Hub",
    slug: "demo-great-lakes-urban",
    logoInitials: "GL",
    logoColor: "#52756D",
    foundedYear: 2014,
    organizationType: "University Program",
    mission:
      "Demo mission: advance urban ecology research and green infrastructure in Great Lakes cities.",
    primaryFocus: "Urban ecology",
    secondaryFocus: ["Water", "Research"],
    categories: ["Urban ecology", "Water", "Research", "Education"],
    ecosystems: ["Urban", "Lakes", "Rivers & Streams"],
    geographicServiceArea: "Southern Lake Michigan metro (demo)",
    city: "Chicago",
    state: "Illinois",
    stateCode: "IL",
    lat: 41.8781,
    lng: -87.6298,
    projects: [
      {
        name: "Demo Green Corridor Studio",
        description: "Placeholder applied research on urban habitat networks.",
        yearStarted: 2017,
      },
    ],
    impactPlaceholders: [
      { label: "Demo study sites", value: "—", unit: "placeholder" },
    ],
    partnerIds: ["org-02", "org-09"],
    verificationStatus: "VERIFIED",
    lastVerified: "2025-08-22",
    sourceLabel: "Demo university program profile",
  }),
  buildOrg({
    id: "org-09",
    name: "[DEMO] Prairie Fire Ecology Circle",
    slug: "demo-prairie-fire",
    logoInitials: "PF",
    logoColor: "#667F86",
    foundedYear: 2003,
    organizationType: "Nonprofit",
    mission:
      "Demo mission: restore tallgrass prairie structure through prescribed fire and native seeding.",
    primaryFocus: "Restoration",
    secondaryFocus: ["Biodiversity", "Education"],
    categories: ["Restoration", "Biodiversity", "Education", "Land conservation"],
    ecosystems: ["Prairies", "Grasslands"],
    geographicServiceArea: "Eastern Kansas / western Missouri prairie belt (demo)",
    city: "Lawrence",
    state: "Kansas",
    stateCode: "KS",
    lat: 38.9717,
    lng: -95.2353,
    projects: [
      {
        name: "Demo Prescribed Fire Cooperative",
        description: "Placeholder cooperative burn planning and training.",
        yearStarted: 2007,
      },
    ],
    impactPlaceholders: [
      { label: "Demo burn units planned", value: "—", unit: "placeholder" },
    ],
    partnerIds: ["org-08", "org-10"],
    verificationStatus: "IMPACT_DOCUMENTED",
    lastVerified: "2025-07-09",
    sourceLabel: "Demo prairie profile",
  }),
  buildOrg({
    id: "org-10",
    name: "[DEMO] Mississippi Bottomlands Initiative",
    slug: "demo-mississippi-bottomlands",
    logoInitials: "MB",
    logoColor: "#172B29",
    foundedYear: 1995,
    organizationType: "Coalition",
    mission:
      "Demo mission: coordinate bottomland hardwood restoration and floodplain connectivity.",
    primaryFocus: "Forests",
    secondaryFocus: ["Wetlands", "Wildlife"],
    categories: ["Forests", "Wetlands", "Wildlife", "Conservation"],
    ecosystems: ["Forests", "Wetlands", "Rivers & Streams"],
    geographicServiceArea: "Lower Mississippi Alluvial Valley (demo)",
    city: "Memphis",
    state: "Tennessee",
    stateCode: "TN",
    lat: 35.1495,
    lng: -90.049,
    projects: [
      {
        name: "Demo Floodplain Reforestation",
        description: "Placeholder multi-partner reforestation planning.",
        yearStarted: 2004,
      },
    ],
    impactPlaceholders: [
      { label: "Demo reforestation planning units", value: "—", unit: "placeholder" },
    ],
    partnerIds: ["org-09", "org-11"],
    verificationStatus: "NETWORK_PARTNER",
    lastVerified: "2025-11-30",
    sourceLabel: "Demo coalition profile",
  }),
  buildOrg({
    id: "org-11",
    name: "[DEMO] Gulf Shoreline Justice Network",
    slug: "demo-gulf-shoreline-justice",
    logoInitials: "GJ",
    logoColor: "#3A6B61",
    foundedYear: 2011,
    organizationType: "Community Organization",
    mission:
      "Demo mission: connect pollution reduction, coastal protection, and community health along the Gulf.",
    primaryFocus: "Environmental justice",
    secondaryFocus: ["Pollution", "Oceans"],
    categories: ["Environmental justice", "Pollution", "Oceans", "Climate"],
    ecosystems: ["Coastal", "Estuaries", "Urban"],
    geographicServiceArea: "Northern Gulf Coast communities (demo)",
    city: "New Orleans",
    state: "Louisiana",
    stateCode: "LA",
    lat: 29.9511,
    lng: -90.0715,
    projects: [
      {
        name: "Demo Community Air & Water Watch",
        description: "Placeholder community monitoring and advocacy program.",
        yearStarted: 2015,
      },
    ],
    impactPlaceholders: [
      { label: "Demo community monitoring nodes", value: "—", unit: "placeholder" },
    ],
    partnerIds: ["org-10", "org-12"],
    verificationStatus: "VERIFIED",
    lastVerified: "2026-01-05",
    sourceLabel: "Demo EJ network profile",
  }),
  buildOrg({
    id: "org-12",
    name: "[DEMO] Atlantic Seabird Watch",
    slug: "demo-atlantic-seabird",
    logoInitials: "AS",
    logoColor: "#B08A52",
    foundedYear: 2007,
    organizationType: "Nonprofit",
    mission:
      "Demo mission: protect nesting seabird habitat and reduce coastal disturbance pressures.",
    primaryFocus: "Wildlife",
    secondaryFocus: ["Oceans", "Conservation"],
    categories: ["Wildlife", "Oceans", "Conservation", "Education"],
    ecosystems: ["Coastal", "Marine"],
    geographicServiceArea: "Mid-Atlantic barrier islands (demo)",
    city: "Virginia Beach",
    state: "Virginia",
    stateCode: "VA",
    lat: 36.8529,
    lng: -75.978,
    projects: [
      {
        name: "Demo Nesting Colony Stewardship",
        description: "Placeholder colony protection and visitor education.",
        yearStarted: 2010,
      },
    ],
    impactPlaceholders: [
      { label: "Demo colony sites monitored", value: "—", unit: "placeholder" },
    ],
    partnerIds: ["org-03", "org-11", "org-13"],
    verificationStatus: "REGISTERED",
    lastVerified: "2025-04-17",
    sourceLabel: "Demo wildlife profile",
  }),
  buildOrg({
    id: "org-13",
    name: "[DEMO] Appalachian Headwaters Collective",
    slug: "demo-appalachian-headwaters",
    logoInitials: "AH",
    logoColor: "#4A7A70",
    foundedYear: 2000,
    organizationType: "Nonprofit",
    mission:
      "Demo mission: restore headwater streams and forested watersheds across central Appalachia.",
    primaryFocus: "Water",
    secondaryFocus: ["Forests", "Pollution"],
    categories: ["Water", "Forests", "Pollution", "Restoration"],
    ecosystems: ["Rivers & Streams", "Forests"],
    geographicServiceArea: "Central Appalachian headwaters (demo)",
    city: "Charleston",
    state: "West Virginia",
    stateCode: "WV",
    lat: 38.3498,
    lng: -81.6326,
    projects: [
      {
        name: "Demo Acid Mine Drainage Mitigation",
        description: "Placeholder watershed remediation planning.",
        yearStarted: 2006,
      },
    ],
    impactPlaceholders: [
      { label: "Demo stream reaches assessed", value: "—", unit: "placeholder" },
    ],
    partnerIds: ["org-12", "org-14"],
    verificationStatus: "IMPACT_DOCUMENTED",
    lastVerified: "2025-09-28",
    sourceLabel: "Demo watershed profile",
  }),
  buildOrg({
    id: "org-14",
    name: "[DEMO] Northeast Urban Canopy Project",
    slug: "demo-northeast-canopy",
    logoInitials: "NC",
    logoColor: "#2A4F48",
    foundedYear: 2016,
    organizationType: "Nonprofit",
    mission:
      "Demo mission: expand equitable urban tree canopy and cool neighborhoods through green infrastructure.",
    primaryFocus: "Urban ecology",
    secondaryFocus: ["Climate", "Environmental justice"],
    categories: ["Urban ecology", "Climate", "Environmental justice", "Forests"],
    ecosystems: ["Urban", "Forests"],
    geographicServiceArea: "Greater Boston (demo)",
    city: "Boston",
    state: "Massachusetts",
    stateCode: "MA",
    lat: 42.3601,
    lng: -71.0589,
    projects: [
      {
        name: "Demo Neighborhood Canopy Equity",
        description: "Placeholder tree planting and heat-island education program.",
        yearStarted: 2018,
      },
    ],
    impactPlaceholders: [
      { label: "Demo canopy plantings tracked", value: "—", unit: "placeholder" },
    ],
    partnerIds: ["org-13", "org-16"],
    verificationStatus: "VERIFIED",
    lastVerified: "2025-05-11",
    sourceLabel: "Demo urban forestry profile",
  }),
  buildOrg({
    id: "org-15",
    name: "[DEMO] High Plains Watershed Stewards",
    slug: "demo-high-plains-watershed",
    logoInitials: "HP",
    logoColor: "#315B52",
    foundedYear: 2009,
    organizationType: "Tribal Organization",
    mission:
      "Demo mission: advance Indigenous ecological stewardship of grassland watersheds and cultural landscapes.",
    primaryFocus: "Indigenous stewardship",
    secondaryFocus: ["Water", "Land conservation"],
    categories: ["Indigenous stewardship", "Water", "Land conservation", "Biodiversity"],
    ecosystems: ["Grasslands", "Prairies", "Rivers & Streams"],
    geographicServiceArea: "Northern High Plains (demo)",
    city: "Billings",
    state: "Montana",
    stateCode: "MT",
    lat: 45.7833,
    lng: -108.5007,
    projects: [
      {
        name: "Demo Cultural Landscape Stewardship",
        description: "Placeholder Indigenous-led watershed stewardship program.",
        yearStarted: 2012,
      },
    ],
    impactPlaceholders: [
      { label: "Demo stewardship acres described", value: "—", unit: "placeholder" },
    ],
    partnerIds: ["org-06", "org-09"],
    verificationStatus: "NETWORK_PARTNER",
    lastVerified: "2026-02-01",
    sourceLabel: "Demo Indigenous stewardship profile",
  }),
  buildOrg({
    id: "org-16",
    name: "[DEMO] Pine Barrens Rewilding Lab",
    slug: "demo-pine-barrens-rewilding",
    logoInitials: "PB",
    logoColor: "#52756D",
    foundedYear: 2013,
    organizationType: "Research Institute",
    mission:
      "Demo mission: research rewilding pathways for fire-adapted pine barren ecosystems.",
    primaryFocus: "Research",
    secondaryFocus: ["Biodiversity", "Restoration"],
    categories: ["Research", "Biodiversity", "Restoration", "Forests"],
    ecosystems: ["Forests", "Wetlands"],
    geographicServiceArea: "New Jersey Pinelands (demo)",
    city: "Trenton",
    state: "New Jersey",
    stateCode: "NJ",
    lat: 40.2206,
    lng: -74.7597,
    projects: [
      {
        name: "Demo Rewilding Trial Plots",
        description: "Placeholder experimental restoration research.",
        yearStarted: 2017,
      },
    ],
    impactPlaceholders: [
      { label: "Demo research plots", value: "—", unit: "placeholder" },
    ],
    partnerIds: ["org-07", "org-14"],
    verificationStatus: "REGISTERED",
    lastVerified: "2025-03-19",
    sourceLabel: "Demo rewilding research profile",
  }),
  buildOrg({
    id: "org-17",
    name: "[DEMO] Everglades Edge Conservancy",
    slug: "demo-everglades-edge",
    logoInitials: "EE",
    logoColor: "#667F86",
    foundedYear: 1992,
    organizationType: "Land Trust",
    mission:
      "Demo mission: protect wetland edges and wildlife corridors adjoining subtropical wetlands.",
    primaryFocus: "Wetlands",
    secondaryFocus: ["Wildlife", "Land conservation"],
    categories: ["Wetlands", "Wildlife", "Land conservation", "Biodiversity"],
    ecosystems: ["Wetlands", "Estuaries"],
    geographicServiceArea: "South Florida wetland edge (demo)",
    city: "Miami",
    state: "Florida",
    stateCode: "FL",
    lat: 25.7617,
    lng: -80.1918,
    projects: [
      {
        name: "Demo Corridor Buffer Acquisition Planning",
        description: "Placeholder land protection planning near wetland edges.",
        yearStarted: 2001,
      },
    ],
    impactPlaceholders: [
      { label: "Demo buffer parcels under review", value: "—", unit: "placeholder" },
    ],
    partnerIds: ["org-11", "org-17"],
    verificationStatus: "VERIFIED",
    lastVerified: "2025-12-20",
    sourceLabel: "Demo wetlands land trust profile",
  }),
  buildOrg({
    id: "org-18",
    name: "[DEMO] Great Basin Sagebrush Guild",
    slug: "demo-great-basin-sagebrush",
    logoInitials: "GB",
    logoColor: "#172B29",
    foundedYear: 2006,
    organizationType: "Coalition",
    mission:
      "Demo mission: coordinate sagebrush habitat conservation and invasive annual grass response.",
    primaryFocus: "Conservation",
    secondaryFocus: ["Invasive species", "Wildlife"],
    categories: ["Conservation", "Invasive species", "Wildlife", "Land conservation"],
    ecosystems: ["Desert", "Grasslands"],
    geographicServiceArea: "Northern Great Basin (demo)",
    city: "Boise",
    state: "Idaho",
    stateCode: "ID",
    lat: 43.615,
    lng: -116.2023,
    projects: [
      {
        name: "Demo Sagebrush Connectivity Map",
        description: "Placeholder multi-partner habitat connectivity analysis.",
        yearStarted: 2014,
      },
    ],
    impactPlaceholders: [
      { label: "Demo habitat units mapped", value: "—", unit: "placeholder" },
    ],
    partnerIds: ["org-05", "org-15"],
    verificationStatus: "NETWORK_PARTNER",
    lastVerified: "2026-01-28",
    sourceLabel: "Demo sagebrush coalition profile",
  }),
];

/** Fix self-partner on org-17 */
DEMO_ORGANIZATIONS.find((o) => o.id === "org-17")!.partnerIds = ["org-11", "org-12"];
