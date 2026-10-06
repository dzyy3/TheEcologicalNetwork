import { OrganizationForm } from "@/components/submit/OrganizationForm";
import { AtlasBackdrop } from "@/components/visuals/AtlasBackdrop";

export default function AddOrganizationPage() {
  return (
    <div className="relative">
      <AtlasBackdrop mark="ADD" coordinate="Submission · pending review" />
      <section className="relative mx-auto max-w-[1600px] px-4 pb-10 pt-14 md:px-6 md:pt-16">
        <div className="flex flex-wrap items-center gap-3">
          <p className="label-caps text-canopy">Plate 04</p>
          <span className="h-px w-8 bg-lichen" />
          <p className="index-mark">Contribution</p>
        </div>
        <h1 className="mt-4 max-w-[14ch] font-display text-[clamp(2.4rem,5.5vw,4rem)] font-medium leading-[1.04] tracking-tight text-ink">
          Add Your Organization
        </h1>
        <div className="mt-6 h-px w-20 bg-canopy/45" />
        <p className="mt-6 max-w-2xl text-base leading-[1.7] text-ink-muted md:text-lg">
          Submit a profile for review. New submissions are marked Pending Review and are not
          automatically verified.
        </p>
      </section>
      <section className="relative mx-auto max-w-[1600px] px-4 pb-16 md:px-6">
        <OrganizationForm />
      </section>
    </div>
  );
}
