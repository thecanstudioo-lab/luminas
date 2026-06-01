import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Chip pill con hairline — único radio redondeado permitido (badges/estado). */
export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill border border-stone-200 bg-paper px-3 py-1 text-xs font-medium text-ink-600",
        className,
      )}
    >
      {children}
    </span>
  );
}
