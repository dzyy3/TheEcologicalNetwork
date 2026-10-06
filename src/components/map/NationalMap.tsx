"use client";

import { useEffect, useRef } from "react";
import maplibregl, { type Map, type Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Organization } from "@/types";

type Props = {
  organizations: Organization[];
  selectedId: string | null;
  densityMode: boolean;
  onSelect: (id: string) => void;
  flyTo?: { lat: number; lng: number; zoom?: number } | null;
};

const TEAL = "#315B52";
const TEAL_SOFT = "rgba(49, 91, 82, 0.22)";
const OCHRE = "#B08A52";
const IVORY = "#F8F6EF";
const INK = "#14201F";

function densityByState(orgs: Organization[]) {
  const counts: Record<string, number> = {};
  for (const o of orgs) {
    for (const l of o.locations) {
      counts[l.stateCode] = (counts[l.stateCode] ?? 0) + 1;
    }
  }
  return counts;
}

function verificationHue(status: Organization["verificationStatus"]) {
  switch (status) {
    case "NETWORK_PARTNER":
      return OCHRE;
    case "IMPACT_DOCUMENTED":
      return "#667F86";
    case "VERIFIED":
      return TEAL;
    default:
      return "#52756D";
  }
}

export function NationalMap({
  organizations,
  selectedId,
  densityMode,
  onSelect,
  flyTo,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

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
              "https://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}@2x.png",
              "https://b.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}@2x.png",
              "https://c.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}@2x.png",
            ],
            tileSize: 256,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
          },
        ],
      },
      center: [-98.5, 39.5],
      zoom: 3.45,
      minZoom: 2.5,
      maxZoom: 12,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 100 }), "bottom-left");

    mapRef.current = map;

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (densityMode) {
      const counts = densityByState(organizations);
      const max = Math.max(1, ...Object.values(counts));

      for (const org of organizations) {
        const loc = org.locations[0];
        if (!loc) continue;
        const intensity = (counts[loc.stateCode] ?? 1) / max;
        const el = document.createElement("button");
        el.type = "button";
        el.setAttribute("aria-label", org.name);
        el.className = "relative flex items-center justify-center border-0 bg-transparent p-0";
        const size = 20 + intensity * 34;
        el.innerHTML = `<span style="width:${size}px;height:${size}px;background:rgba(49,91,82,${0.12 + intensity * 0.35});border:1px solid rgba(49,91,82,0.45);border-radius:999px;display:block;box-shadow:inset 0 0 0 1px rgba(248,246,239,0.35);"></span>`;
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          onSelectRef.current(org.id);
        });
        const marker = new maplibregl.Marker({ element: el, anchor: "center" })
          .setLngLat([loc.longitude, loc.latitude])
          .addTo(map);
        markersRef.current.push(marker);
      }
      return;
    }

    for (const org of organizations) {
      const loc = org.locations[0];
      if (!loc) continue;
      const selected = org.id === selectedId;
      const ring = verificationHue(org.verificationStatus);
      const el = document.createElement("button");
      el.type = "button";
      el.setAttribute("aria-label", org.name);
      el.className = "relative flex items-center justify-center border-0 bg-transparent p-0";
      const size = selected ? 38 : 30;
      el.innerHTML = `
        <span style="
          position:relative;
          width:${size}px;height:${size}px;
          display:flex;align-items:center;justify-content:center;
        ">
          <span style="
            position:absolute;inset:-5px;
            border:1px solid ${selected ? ring : TEAL_SOFT};
            border-radius:1px;
            opacity:${selected ? 1 : 0.7};
          "></span>
          <span style="
            width:${size}px;height:${size}px;
            background:${selected ? TEAL : org.logoColor};
            color:${IVORY};
            border-radius:1px;
            display:flex;align-items:center;justify-content:center;
            font-family:ui-monospace,monospace;
            font-size:${selected ? 11 : 10}px;font-weight:500;
            letter-spacing:0.04em;
            box-shadow:0 3px 10px rgba(23,43,41,0.22);
            border:1px solid ${selected ? INK : "rgba(248,246,239,0.85)"};
            transition: transform 0.15s ease, background 0.15s ease;
          ">${org.logoInitials}</span>
          <span style="
            position:absolute;right:-2px;top:-2px;
            width:7px;height:7px;border-radius:999px;
            background:${ring};
            border:1px solid ${IVORY};
          "></span>
        </span>
      `;
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelectRef.current(org.id);
      });
      const marker = new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat([loc.longitude, loc.latitude])
        .addTo(map);
      markersRef.current.push(marker);
    }
  }, [organizations, selectedId, densityMode]);

  useEffect(() => {
    if (!flyTo || !mapRef.current) return;
    mapRef.current.flyTo({
      center: [flyTo.lng, flyTo.lat],
      zoom: flyTo.zoom ?? 7,
      essential: true,
    });
  }, [flyTo]);

  useEffect(() => {
    if (!selectedId || !mapRef.current) return;
    const org = organizations.find((o) => o.id === selectedId);
    const loc = org?.locations[0];
    if (!loc) return;
    mapRef.current.flyTo({
      center: [loc.longitude, loc.latitude],
      zoom: Math.max(mapRef.current.getZoom(), 5.5),
      essential: true,
    });
  }, [selectedId, organizations]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div ref={containerRef} className="map-atlas-tone h-full w-full" />
      <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1">
        <div className="rounded-[1px] border border-ink/15 bg-sand-bright/95 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-label text-ink-muted">
          Atlas layer · contiguous U.S.
        </div>
        {densityMode && (
          <div className="rounded-[1px] border border-canopy/25 bg-sand-bright/95 px-2.5 py-1 font-mono text-[10px] uppercase tracking-label text-canopy">
            Density mode · demo aggregation
          </div>
        )}
      </div>
      <div className="pointer-events-none absolute bottom-10 left-3 hidden rounded-[1px] border border-ink/10 bg-sand-bright/90 px-2 py-1.5 md:block">
        <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-label text-ink-muted">
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-[1px] bg-[#315B52]" /> Verified
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#B08A52]" /> Network
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#667F86]" /> Impact
          </span>
        </div>
      </div>
    </div>
  );
}
