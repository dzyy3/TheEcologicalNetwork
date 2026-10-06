import type { VerificationStatus } from "@/types";
import { VERIFICATION_META, cn } from "@/lib/utils";

export function VerificationBadge({
  status,
  size = "md",
}: {
  status: VerificationStatus;
  size?: "sm" | "md";
}) {
  const meta = VERIFICATION_META[status];
  return (
    <span
      title={meta.description}
      className={cn(
        "inline-flex items-center rounded-[2px] border font-mono uppercase tracking-label",
        meta.tone,
        size === "sm" ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-1 text-[10px]"
      )}
    >
      {meta.short}
    </span>
  );
}
