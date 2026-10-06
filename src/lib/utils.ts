import { clsx, type ClassValue } from "clsx";
import type { VerificationStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function orgAgeYears(foundedYear: number, now = new Date()) {
  return now.getFullYear() - foundedYear;
}

export const VERIFICATION_META: Record<
  VerificationStatus,
  { label: string; short: string; description: string; tone: string }
> = {
  PENDING_REVIEW: {
    label: "Pending Review",
    short: "Pending",
    description: "Submitted for review. Not yet evaluated against inclusion criteria.",
    tone: "bg-sand-dim text-ink-muted border-lichen",
  },
  REGISTERED: {
    label: "Registered",
    short: "Registered",
    description: "Meets basic eligibility requirements.",
    tone: "bg-transparent text-moss border-moss/35",
  },
  VERIFIED: {
    label: "Verified",
    short: "Verified",
    description:
      "Organization information, location, mission, and projects have been independently verified.",
    tone: "bg-canopy/[0.08] text-canopy border-canopy/35",
  },
  IMPACT_DOCUMENTED: {
    label: "Impact Documented",
    short: "Impact",
    description: "Publicly documented measurable ecological outcomes are on record.",
    tone: "bg-water/[0.1] text-water border-water/35",
  },
  NETWORK_PARTNER: {
    label: "Network Partner",
    short: "Network",
    description: "Documented relationships with other ecological organizations.",
    tone: "bg-signal/[0.1] text-signal border-signal/35",
  },
};

/** Approximate US state centroid lon/lat for choropleth fallback */
export const STATE_CENTROIDS: Record<string, [number, number]> = {
  AL: [-86.9023, 32.3182],
  AK: [-153.3691, 64.2008],
  AZ: [-111.0937, 34.0489],
  AR: [-92.3731, 34.9697],
  CA: [-119.4179, 36.7783],
  CO: [-105.7821, 39.5501],
  CT: [-72.7554, 41.6032],
  DE: [-75.5277, 38.9108],
  FL: [-81.5158, 27.6648],
  GA: [-83.5007, 32.1656],
  HI: [-155.5828, 19.8968],
  ID: [-114.742, 44.0682],
  IL: [-89.3985, 40.6331],
  IN: [-86.1349, 40.2672],
  IA: [-93.0977, 41.878],
  KS: [-98.4842, 39.0119],
  KY: [-84.27, 37.8393],
  LA: [-91.9623, 30.9843],
  ME: [-69.4455, 45.2538],
  MD: [-76.6413, 39.0458],
  MA: [-71.3824, 42.4072],
  MI: [-85.6024, 44.3148],
  MN: [-94.6859, 46.7296],
  MS: [-89.3985, 32.3547],
  MO: [-91.8318, 37.9643],
  MT: [-110.3626, 46.8797],
  NE: [-99.9018, 41.4925],
  NV: [-116.4194, 38.8026],
  NH: [-71.5724, 43.1939],
  NJ: [-74.4057, 40.0583],
  NM: [-105.8701, 34.5199],
  NY: [-74.2179, 43.2994],
  NC: [-79.0193, 35.7596],
  ND: [-101.002, 47.5515],
  OH: [-82.9071, 40.4173],
  OK: [-97.0929, 35.0078],
  OR: [-120.5542, 43.8041],
  PA: [-77.1945, 41.2033],
  RI: [-71.4774, 41.5801],
  SC: [-81.1637, 33.8361],
  SD: [-99.9018, 43.9695],
  TN: [-86.5804, 35.5175],
  TX: [-99.9018, 31.9686],
  UT: [-111.0937, 39.321],
  VT: [-72.5778, 44.5588],
  VA: [-78.6569, 37.4316],
  WA: [-120.7401, 47.7511],
  WV: [-80.4549, 38.5976],
  WI: [-89.6165, 43.7844],
  WY: [-107.2903, 43.076],
  DC: [-77.0369, 38.9072],
};
