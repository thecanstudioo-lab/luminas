"use client";

import { Check } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import { useServices, useLocations } from "@/context/DataContext";
import { formatCOP, formatDuration, cn } from "@/lib/utils";

export function Step1Service() {
  const { draft, setService, setLocation } = useBooking();
  const services = useServices();
  const locations = useLocations();

  return (
    <div className="space-y-10">
      {/* Servicio */}
      <div>
        <p className="eyebrow mb-4">Elige tu tratamiento</p>
        <div className="grid gap-px border border-stone-200 bg-stone-200 sm:grid-cols-2">
          {services.map((s) => {
            const selected = draft.serviceId === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setService(s.id)}
                aria-pressed={selected}
                className={cn(
                  "flex items-center justify-between gap-4 p-4 text-left transition-colors duration-fast ease-expo",
                  selected ? "bg-ink-900 text-on-ink" : "bg-paper text-ink-900 hover:bg-paper-dim",
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate font-display text-base font-semibold tracking-snug">
                    {s.name}
                  </span>
                  <span
                    className={cn(
                      "mono-label mt-1 block text-xs",
                      selected ? "text-on-ink-2" : "text-stone-500",
                    )}
                  >
                    {formatDuration(s.durationMin)} · {formatCOP(s.price)}
                  </span>
                </span>
                {selected && <Check className="h-4 w-4 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sede */}
      <div>
        <p className="eyebrow mb-4">Selecciona la sede</p>
        <div className="grid gap-px border border-stone-200 bg-stone-200 sm:grid-cols-3">
          {locations.map((l) => {
            const selected = draft.locationId === l.id;
            return (
              <button
                key={l.id}
                onClick={() => setLocation(l.id)}
                aria-pressed={selected}
                className={cn(
                  "p-4 text-left transition-colors duration-fast ease-expo",
                  selected ? "bg-ink-900 text-on-ink" : "bg-paper text-ink-900 hover:bg-paper-dim",
                )}
              >
                <span className="block font-display text-base font-semibold tracking-snug">
                  {l.name}
                </span>
                <span
                  className={cn(
                    "mt-1 block text-xs",
                    selected ? "text-on-ink-2" : "text-stone-500",
                  )}
                >
                  {l.neighborhood} · {l.address}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
