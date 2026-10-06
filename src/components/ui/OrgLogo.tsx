import type { Organization } from "@/types";
import { cn } from "@/lib/utils";

export function OrgLogo({
  org,
  size = "md",
}: {
  org: Pick<Organization, "logoInitials" | "logoColor" | "name">;
  size?: "sm" | "md" | "lg";
}) {
  const dim =
    size === "sm" ? "h-8 w-8 text-[10px]" : size === "lg" ? "h-14 w-14 text-base" : "h-10 w-10 text-xs";
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-[2px] font-mono font-medium text-sand-bright",
        dim
      )}
      style={{ backgroundColor: org.logoColor }}
      aria-label={`${org.name} logo placeholder`}
      title="Demo logo placeholder — replace with verified mark when available"
    >
      {org.logoInitials}
    </div>
  );
}
