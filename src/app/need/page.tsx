import { getEnvironmentalLayers, getOrganizations } from "@/lib/data";
import { NeedExplorer } from "@/components/need/NeedExplorer";
import { AtlasBackdrop } from "@/components/visuals/AtlasBackdrop";

export default function NeedPage() {
  const organizations = getOrganizations();
  const layers = getEnvironmentalLayers();

  return (
    <div className="relative">
      <AtlasBackdrop mark="GAP" coordinate="Need × presence · indicator" />
      <section className="relative mx-auto max-w-[1600px] px-4 pb-10 pt-14 md:px-6 md:pt-16">
        <div className="flex flex-wrap items-center gap-3">
          <p className="label-caps text-canopy">Plate 03</p>
          <span className="h-px w-8 bg-lichen" />
          <p className="index-mark">Need and capacity</p>
        </div>
        <h1 className="mt-4 max-w-[16ch] font-display text-[clamp(2.4rem,5.5vw,4rem)] font-medium leading-[1.04] tracking-tight text-ink">
          Where Is Support Needed?
        </h1>
        <div className="mt-6 h-px w-20 bg-canopy/45" />
        <p className="mt-6 max-w-2xl text-base leading-[1.7] text-ink-muted md:text-lg">
          Compare ecological need layers with organizational presence. Layers are structured
          for future connection to EPA, USGS, NOAA, USDA, USFWS, NASA, and related sources.
        </p>
      </section>
      <section className="relative mx-auto max-w-[1600px] px-4 pb-16 md:px-6">
        <NeedExplorer organizations={organizations} layers={layers} />
      </section>
    </div>
  );
}
