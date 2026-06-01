import { cn } from "@/lib/utils";

/**
 * Punto de estado 8px. `signal` (salvia) = disponible/en vivo; `busy` (arcilla) = alta demanda.
 * Único uso permitido del color en el sistema. El anillo de pulso señala disponibilidad en tiempo real.
 */
export function StatusDot({
  variant = "signal",
  pulse = false,
  className,
}: {
  variant?: "signal" | "busy";
  pulse?: boolean;
  className?: string;
}) {
  const color = variant === "signal" ? "bg-signal" : "bg-busy";
  return (
    <span className={cn("relative inline-flex h-2 w-2 shrink-0", className)}>
      {pulse && (
        <span className={cn("absolute inset-0 rounded-pill animate-pulse-ring", color)} aria-hidden />
      )}
      <span className={cn("relative h-2 w-2 rounded-pill", color)} />
    </span>
  );
}
