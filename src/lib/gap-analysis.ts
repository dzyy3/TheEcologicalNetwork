import type { GapScore, EnvironmentalLayer, Organization } from "@/types";
import { US_STATES } from "@/types";

/**
 * Ecological Support Gaps — analytical indicator, not objective truth.
 *
 * Methodology (transparent):
 * 1. Need score = average intensity of currently active environmental layers
 *    for a state (0–1). When layers are demo placeholders, need is illustrative only.
 * 2. Presence score = organization count in that state, normalized by max count
 *    across states in the current filtered set (0–1).
 * 3. Gap score = need − presence.
 *    Higher gap ≈ higher relative need vs. mapped organizational presence.
 *
 * Classifications are heuristic labels for exploration, not funding recommendations.
 */

export function computeGapScores(
  organizations: Organization[],
  activeLayers: EnvironmentalLayer[]
): GapScore[] {
  const counts = new Map<string, number>();
  for (const org of organizations) {
    for (const loc of org.locations) {
      counts.set(loc.stateCode, (counts.get(loc.stateCode) ?? 0) + 1);
    }
  }
  const maxCount = Math.max(1, ...Array.from(counts.values()));

  return US_STATES.map((state) => {
    const organizationCount = counts.get(state.code) ?? 0;
    const presenceScore = organizationCount / maxCount;

    let needScore = 0;
    if (activeLayers.length > 0) {
      const sum = activeLayers.reduce(
        (acc, layer) => acc + (layer.stateIntensities[state.code] ?? 0),
        0
      );
      needScore = sum / activeLayers.length;
    }

    const gapScore = needScore - presenceScore;

    let classification: GapScore["classification"];
    if (needScore >= 0.55 && presenceScore <= 0.35) {
      classification = "potential_support_gap";
    } else if (needScore >= 0.55 && presenceScore >= 0.55) {
      classification = "highly_supported";
    } else if (needScore < 0.45 && presenceScore >= 0.55) {
      classification = "high_concentration";
    } else {
      classification = "low_activity";
    }

    return {
      stateCode: state.code,
      stateName: state.name,
      needScore,
      presenceScore,
      gapScore,
      classification,
      organizationCount,
    };
  });
}

export const GAP_CLASSIFICATION_LABELS: Record<
  GapScore["classification"],
  { label: string; description: string; color: string }
> = {
  potential_support_gap: {
    label: "Potential support gap",
    description: "Higher relative ecological need with lower mapped organizational presence.",
    color: "#8B5E4B",
  },
  highly_supported: {
    label: "Highly supported area",
    description: "Higher relative need with higher mapped organizational presence.",
    color: "#315B52",
  },
  high_concentration: {
    label: "High organizational concentration",
    description: "Lower relative need with higher mapped organizational presence.",
    color: "#667F86",
  },
  low_activity: {
    label: "Lower relative activity",
    description: "Neither need nor presence scores are elevated in this indicator.",
    color: "#C9C7BC",
  },
};
