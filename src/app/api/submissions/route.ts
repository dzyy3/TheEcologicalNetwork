import { NextResponse } from "next/server";
import { submitOrganization } from "@/lib/data";
import type { SubmissionPayload } from "@/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SubmissionPayload & {
      logoFileName?: string;
    };

    if (!body.accuracyConfirmed) {
      return NextResponse.json(
        { error: "Accuracy confirmation is required." },
        { status: 400 }
      );
    }
    if (!body.name?.trim() || !body.mission?.trim() || !body.contactEmail?.trim()) {
      return NextResponse.json(
        { error: "Name, mission, and contact email are required." },
        { status: 400 }
      );
    }

    const age = new Date().getFullYear() - Number(body.foundedYear);
    if (Number.isNaN(age) || age < 2.5) {
      return NextResponse.json(
        { error: "Organization must be at least 2.5 years old to be eligible." },
        { status: 400 }
      );
    }

    const record = submitOrganization({
      name: body.name.trim(),
      website: body.website?.trim() ?? "",
      city: body.city?.trim() ?? "",
      state: body.state?.trim() ?? "",
      foundedYear: Number(body.foundedYear),
      organizationType: body.organizationType,
      mission: body.mission.trim(),
      primaryFocus: body.primaryFocus,
      secondaryFocus: body.secondaryFocus ?? [],
      ecosystems: body.ecosystems ?? [],
      geographicServiceArea: body.geographicServiceArea?.trim() ?? "",
      majorProjects: body.majorProjects?.trim() ?? "",
      impactMetrics: body.impactMetrics?.trim() ?? "",
      partnerOrganizations: body.partnerOrganizations?.trim() ?? "",
      contactEmail: body.contactEmail.trim(),
      supportingSources: body.supportingSources?.trim() ?? "",
      accuracyConfirmed: true,
    });

    return NextResponse.json({
      id: record.id,
      status: record.status,
      submittedAt: record.submittedAt,
      message:
        "Organization marked PENDING REVIEW. It will not appear as verified until reviewed.",
      logoFileName: body.logoFileName ?? null,
    });
  } catch {
    return NextResponse.json({ error: "Unable to process submission." }, { status: 500 });
  }
}
