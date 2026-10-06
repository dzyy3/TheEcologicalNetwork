"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import type { Organization, Partnership } from "@/types";
import { OrgLogo } from "@/components/ui/OrgLogo";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { cn } from "@/lib/utils";

type SimNode = d3.SimulationNodeDatum & {
  id: string;
  org: Organization;
};

type SimLink = d3.SimulationLinkDatum<SimNode> & {
  partnership: Partnership;
};

export function NetworkGraph({
  organizations,
  partnerships,
}: {
  organizations: Organization[];
  partnerships: Partnership[];
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dims, setDims] = useState({ w: 800, h: 560 });
  const selectedIdRef = useRef<string | null>(null);
  selectedIdRef.current = selectedId;

  const orgMap = useMemo(
    () => new Map(organizations.map((o) => [o.id, o])),
    [organizations]
  );

  const selected = selectedId ? orgMap.get(selectedId) : undefined;

  const related = useMemo(() => {
    if (!selectedId) return { partners: [] as Organization[], edges: [] as Partnership[] };
    const edges = partnerships.filter(
      (p) => p.sourceOrgId === selectedId || p.targetOrgId === selectedId
    );
    const partnerIds = new Set(
      edges.map((e) => (e.sourceOrgId === selectedId ? e.targetOrgId : e.sourceOrgId))
    );
    return {
      edges,
      partners: organizations.filter((o) => partnerIds.has(o.id)),
    };
  }, [selectedId, partnerships, organizations]);

  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDims({ w: Math.max(320, width), h: Math.max(400, height) });
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const { w, h } = dims;
    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${w} ${h}`);

    const nodes: SimNode[] = organizations.map((org) => ({ id: org.id, org }));
    const nodeById = new Map(nodes.map((n) => [n.id, n]));
    const links: SimLink[] = partnerships
      .filter((p) => nodeById.has(p.sourceOrgId) && nodeById.has(p.targetOrgId))
      .map((p) => ({
        source: p.sourceOrgId,
        target: p.targetOrgId,
        partnership: p,
      }));

    const partnerLookup = (id: string) => {
      const set = new Set<string>();
      for (const p of partnerships) {
        if (p.sourceOrgId === id) set.add(p.targetOrgId);
        if (p.targetOrgId === id) set.add(p.sourceOrgId);
      }
      return set;
    };

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink<SimNode, SimLink>(links)
          .id((d) => d.id)
          .distance(110)
          .strength(0.55)
      )
      .force("charge", d3.forceManyBody().strength(-280))
      .force("center", d3.forceCenter(w / 2, h / 2))
      .force("collision", d3.forceCollide(36));

    const g = svg.append("g");

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 2.5])
      .on("zoom", (event) => g.attr("transform", event.transform));
    svg.call(zoom);

    const link = g
      .append("g")
      .attr("stroke-linecap", "round")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1.5)
      .attr("stroke", "rgba(49,91,82,0.28)");

    const node = g
      .append("g")
      .selectAll<SVGGElement, SimNode>("g")
      .data(nodes)
      .join("g")
      .style("cursor", "pointer")
      .call(
        d3
          .drag<SVGGElement, SimNode>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      )
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedId(d.id);
      });

    node
      .append("circle")
      .attr("r", 18)
      .attr("fill", (d) => d.org.logoColor)
      .attr("stroke", "#f3efe6")
      .attr("stroke-width", 2);

    node
      .append("text")
      .text((d) => d.org.logoInitials)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", "#f3efe6")
      .attr("font-size", 9)
      .attr("font-family", "ui-monospace, monospace")
      .attr("pointer-events", "none");

    node.append("title").text((d) => d.org.name);

    svg.on("click", () => setSelectedId(null));

    function isRelated(linkItem: SimLink, id: string | null) {
      if (!id) return false;
      const s = typeof linkItem.source === "object" ? linkItem.source.id : linkItem.source;
      const t = typeof linkItem.target === "object" ? linkItem.target.id : linkItem.target;
      return s === id || t === id;
    }

    function paintSelection() {
      const id = selectedIdRef.current;
      const partners = id ? partnerLookup(id) : new Set<string>();

      link
        .attr("stroke", (d) =>
          id ? (isRelated(d, id) ? "#315B52" : "rgba(23,43,41,0.08)") : "rgba(49,91,82,0.28)"
        )
        .attr("stroke-opacity", (d) => (id ? (isRelated(d, id) ? 1 : 0.35) : 0.85))
        .attr("stroke-width", (d) => (isRelated(d, id) ? 2.5 : 1.5));

      node.attr("opacity", (d) => {
        if (!id) return 1;
        if (d.id === id) return 1;
        return partners.has(d.id) ? 1 : 0.25;
      });

      node
        .select("circle")
        .attr("r", (d) => (d.id === id ? 22 : 18))
        .attr("stroke-width", (d) => (d.id === id ? 3 : 2));
    }

    // Expose painter for selection updates without rebuilding simulation
    (svgEl as SVGSVGElement & { __paintSelection?: () => void }).__paintSelection =
      paintSelection;

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as SimNode).x ?? 0)
        .attr("y1", (d) => (d.source as SimNode).y ?? 0)
        .attr("x2", (d) => (d.target as SimNode).x ?? 0)
        .attr("y2", (d) => (d.target as SimNode).y ?? 0);
      node.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    paintSelection();

    return () => {
      simulation.stop();
      delete (svgEl as SVGSVGElement & { __paintSelection?: () => void }).__paintSelection;
    };
  }, [organizations, partnerships, dims]);

  useEffect(() => {
    const svgEl = svgRef.current as
      | (SVGSVGElement & { __paintSelection?: () => void })
      | null;
    svgEl?.__paintSelection?.();
  }, [selectedId]);

  const relationshipTypes = Array.from(new Set(related.edges.map((e) => e.type)));
  const sharedEcosystems = Array.from(
    new Set(related.edges.flatMap((e) => e.sharedEcosystems ?? []))
  );

  return (
    <div className="atlas-frame flex min-h-[560px] flex-col overflow-hidden lg:flex-row">
      <div ref={wrapRef} className="relative min-h-[420px] flex-1 bg-sand">
        <svg
          ref={svgRef}
          className="h-full w-full"
          role="img"
          aria-label="Ecological organization network graph"
        />
        <div className="pointer-events-none absolute left-3 top-3 rounded-[2px] border border-ink/10 bg-sand-bright/95 px-2.5 py-1 font-mono text-[10px] uppercase tracking-label text-ink-muted">
          Drag nodes · scroll to zoom · click to select
        </div>
      </div>

      <aside className="custom-scroll w-full border-t border-ink/10 bg-sand-bright p-5 lg:w-[360px] lg:border-l lg:border-t-0 lg:overflow-y-auto">
        {!selected ? (
          <div className="space-y-3 text-sm text-ink-muted">
            <p className="label-caps text-canopy">The Network</p>
            <h2 className="font-display text-2xl text-ink">Select an organization</h2>
            <p className="leading-relaxed">
              Nodes are organizations. Edges represent demo partnerships, shared projects,
              funding, research collaborations, coalitions, and related ties.
            </p>
            <p className="rounded-[2px] border border-dashed border-signal/40 bg-signal/5 px-3 py-2 text-xs text-signal">
              All relationships in this view are DEMO DATA.
            </p>
            <dl className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <dt className="label-caps">Nodes</dt>
                <dd className="font-display text-2xl text-ink">{organizations.length}</dd>
              </div>
              <div>
                <dt className="label-caps">Edges</dt>
                <dd className="font-display text-2xl text-ink">{partnerships.length}</dd>
              </div>
            </dl>
          </div>
        ) : (
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <OrgLogo org={selected} size="lg" />
              <div>
                <p className="label-caps text-signal">Demo node</p>
                <h2 className="font-display text-xl text-ink">
                  {selected.name.replace(/^\[DEMO\]\s*/, "")}
                </h2>
                <div className="mt-1">
                  <VerificationBadge status={selected.verificationStatus} size="sm" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[2px] border border-ink/10 p-3">
                <p className="label-caps">Connections</p>
                <p className="font-display text-2xl text-ink">{related.edges.length}</p>
              </div>
              <div className="rounded-[2px] border border-ink/10 p-3">
                <p className="label-caps">Direct partners</p>
                <p className="font-display text-2xl text-ink">{related.partners.length}</p>
              </div>
            </div>

            <section>
              <p className="label-caps">Relationship types</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {relationshipTypes.map((t) => (
                  <span
                    key={t}
                    className="rounded-[2px] bg-ink/[0.04] px-2 py-0.5 text-xs text-ink"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <p className="label-caps">Shared ecosystems</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {sharedEcosystems.length === 0 ? (
                  <span className="text-ink-muted">None listed</span>
                ) : (
                  sharedEcosystems.map((e) => (
                    <span
                      key={e}
                      className="rounded-[2px] bg-sand-dim px-2 py-0.5 text-xs text-ink"
                    >
                      {e}
                    </span>
                  ))
                )}
              </div>
            </section>

            <section>
              <p className="label-caps">Geographic connections</p>
              <ul className="mt-2 space-y-1 text-ink-muted">
                {related.edges.map((e) => (
                  <li key={e.id}>{e.geographicConnection ?? "Multi-region (demo)"}</li>
                ))}
              </ul>
            </section>

            <section>
              <p className="label-caps">Connected organizations</p>
              <ul className="mt-2 space-y-2">
                {related.partners.map((p) => {
                  const edge = related.edges.find(
                    (e) => e.sourceOrgId === p.id || e.targetOrgId === p.id
                  );
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(p.id)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-[2px] border border-ink/10 px-2 py-2 text-left hover:border-ink/20"
                        )}
                      >
                        <OrgLogo org={p} size="sm" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium text-ink">
                            {p.name.replace(/^\[DEMO\]\s*/, "")}
                          </span>
                          <span className="block text-xs text-ink-muted">{edge?.type}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        )}
      </aside>
    </div>
  );
}
