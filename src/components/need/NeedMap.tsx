"use client";

import { useEffect, useRef } from "react";
import maplibregl, { type Map, type Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { EnvironmentalLayer, GapScore, Organization } from "@/types";
import { STATE_CENTROIDS } from "@/lib/utils";
import { GAP_CLASSIFICATION_LABELS } from "@/lib/gap-analysis";

export function NeedMap({
  organizations,
  activeLayers,
  gaps,
  showGaps,
}: {
  organizations: Organization[];
  activeLayers: EnvironmentalLayer[];
  gaps: GapScore[];
  showGaps: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: [
              "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
              "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png",
            ],
            tileSize: 256,
            attribution:
              '&copy; OpenStreetMap &copy; <a href="https://carto.com/">CARTO</a>',
          },
        },
        layers: [{ id: "osm", type: "raster", source: "osm" }],
      },
      center: [-98.5, 39.5],
      zoom: 3.3,
      minZoom: 2.5,
      maxZoom: 10,
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
    mapRef.current = map;
    return () => {
      markersRef.current.forEach((m) => m.remove());
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Layer intensity markers at state centroids
    if (activeLayers.length > 0) {
      for (const [code, coords] of Object.entries(STATE_CENTROIDS)) {
        const intensity =
          activeLayers.reduce((acc, l) => acc + (l.stateIntensities[code] ?? 0), 0) /
          activeLayers.length;
        if (intensity < 0.08) continue;
        const el = document.createElement("div");
        const size = 10 + intensity * 34;
        const color = activeLayers[0].color;
        el.style.cssText = `
          width:${size}px;height:${size}px;border-radius:999px;
          background:${color};opacity:${0.18 + intensity * 0.45};
          border:1px solid ${color};pointer-events:none;
        `;
        const marker = new maplibregl.Marker({ element: el, anchor: "center" })
          .setLngLat(coords)
          .addTo(map);
        markersRef.current.push(marker);
      }
    }

    // Gap classification rings
    if (showGaps) {
      for (const gap of gaps) {
        const coords = STATE_CENTROIDS[gap.stateCode];
        if (!coords) continue;
        if (gap.classification === "low_activity" && gap.organizationCount === 0) continue;
        const meta = GAP_CLASSIFICATION_LABELS[gap.classification];
        const el = document.createElement("div");
        el.title = `${gap.stateName}: ${meta.label} (gap ${gap.gapScore.toFixed(2)})`;
        el.style.cssText = `
          width:14px;height:14px;border-radius:2px;
          background:${meta.color};opacity:0.85;
          box-shadow:0 0 0 3px rgba(243,239,230,0.9);
          cursor:help;
        `;
        const marker = new maplibregl.Marker({ element: el, anchor: "center" })
          .setLngLat([coords[0] + 0.4, coords[1] - 0.35])
          .addTo(map);
        markersRef.current.push(marker);
      }
    }

    // Organization presence dots
    for (const org of organizations) {
      const loc = org.locations[0];
      if (!loc) continue;
      const el = document.createElement("div");
      el.title = org.name;
      el.style.cssText = `
        width:8px;height:8px;border-radius:999px;
        background:#12151a;border:1px solid #faf9f6;
      `;
      const marker = new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat([loc.longitude, loc.latitude])
        .addTo(map);
      markersRef.current.push(marker);
    }
  }, [organizations, activeLayers, gaps, showGaps]);

  return (
    <div className="relative h-[min(64vh,580px)] min-h-[380px] overflow-hidden rounded-[2px] border border-ink/10 bg-sand-bright shadow-map">
      <div ref={containerRef} className="h-full w-full" />
      <div className="absolute bottom-3 left-3 max-w-xs rounded-[2px] border border-ink/10 bg-sand-bright/95 px-3 py-2 text-[11px] leading-relaxed text-ink-muted">
        Circles = demo layer intensity · Squares = gap class · Dark dots = demo organizations
      </div>
    </div>
  );
}
