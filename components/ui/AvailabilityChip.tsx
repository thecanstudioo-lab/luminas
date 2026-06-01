"use client";

import { StatusDot } from "./StatusDot";
import { useUpcomingAvailability } from "@/lib/hooks/useUpcomingAvailability";
import { cn } from "@/lib/utils";

/**
 * Chip de disponibilidad en vivo. La cifra proviene del servicio de disponibilidad
 * — nunca es texto fijo. `bare` lo embebe sin el envoltorio glass (p. ej. dentro de otro panel).
 */
export function AvailabilityChip({ className, bare = false }: { className?: string; bare?: boolean }) {
  const data = useUpcomingAvailability();
  const open = data === null || data.free > 0;

  const label = (() => {
    if (data === null) return "Disponibilidad en vivo";
    if (data.free === 0) return "Escríbenos por disponibilidad";
    const noun = data.free === 1 ? "cita libre" : "citas libres";
    return `${data.free} ${noun} ${data.label}`;
  })();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3",
        !bare && "liquid-glass rounded-pill px-4 py-2.5",
        className,
      )}
    >
      <StatusDot variant={open ? "signal" : "busy"} pulse={open} />
      <span key={label} className={cn("mono-label animate-count text-sm", data === null ? "text-white/60" : "text-white")}>
        {label}
      </span>
    </div>
  );
}
