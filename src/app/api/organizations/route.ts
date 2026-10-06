import { NextResponse } from "next/server";
import { getOrganizations, getRegistryStats, filterOrganizations } from "@/lib/data";
import type { OrganizationFilters } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";
  const categories = searchParams.getAll("category");
  const states = searchParams.getAll("state");

  const filters: Partial<OrganizationFilters> = {
    search,
    categories: categories as OrganizationFilters["categories"],
    states,
  };

  const organizations = filterOrganizations(filters, getOrganizations());
  return NextResponse.json({
    data: organizations,
    meta: {
      ...getRegistryStats(organizations),
      note: "Demo dataset — replace via Supabase data layer",
    },
  });
}
