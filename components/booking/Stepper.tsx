import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { n: 1, label: "Servicio y sede" },
  { n: 2, label: "Fecha y hora" },
  { n: 3, label: "Tus datos" },
];

export function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex items-center">
      {steps.map((s, i) => {
        const done = current > s.n;
        const active = current === s.n;
        return (
          <li key={s.n} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-none border text-sm font-semibold transition-colors duration-fast ease-expo",
                  (done || active) && "border-ink-900 bg-ink-900 text-on-ink",
                  !done && !active && "border-stone-200 bg-paper text-stone-400",
                )}
              >
                {done ? <Check className="h-4 w-4" /> : <span className="mono-label">{s.n}</span>}
              </span>
              <span
                className={cn(
                  "hidden text-sm font-medium sm:block",
                  active ? "text-ink-900" : "text-stone-500",
                )}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span
                className={cn(
                  "mx-3 h-px flex-1 transition-colors duration-slow ease-expo sm:mx-4",
                  done ? "bg-ink-900" : "bg-stone-200",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
