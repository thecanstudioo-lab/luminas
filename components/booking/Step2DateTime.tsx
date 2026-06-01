"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import { useLocationById } from "@/context/DataContext";
import { StatusDot } from "@/components/ui/StatusDot";
import { Calendar } from "./Calendar";
import { fetchDaySlots, fetchFreeDays } from "@/lib/supabase/availability";
import { toISODate, cn } from "@/lib/utils";
import type { TimeSlot } from "@/lib/types";

export function Step2DateTime() {
  const { draft, setDate, setTime } = useBooking();
  const sede = useLocationById(draft.locationId);

  const selectedDate = draft.date ? new Date(draft.date + "T00:00:00") : null;
  const daysLabel = sede ? (sede.openDays.includes(0) ? "todos los días" : "lun–sáb") : "lun–sáb";

  // Cupos libres por día (rango hoy..+60) para habilitar/deshabilitar el calendario.
  const [freeDays, setFreeDays] = useState<Record<string, number>>({});
  // Franjas reales de la fecha seleccionada.
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (!draft.locationId) return;
    const from = new Date();
    const to = new Date();
    to.setDate(from.getDate() + 60);
    let alive = true;
    fetchFreeDays(draft.locationId, toISODate(from), toISODate(to)).then((m) => {
      if (alive) setFreeDays(m);
    });
    return () => {
      alive = false;
    };
  }, [draft.locationId]);

  useEffect(() => {
    if (!draft.locationId || !draft.date) {
      setSlots([]);
      return;
    }
    let alive = true;
    setLoadingSlots(true);
    fetchDaySlots(draft.locationId, draft.date).then((s) => {
      if (alive) {
        setSlots(s);
        setLoadingSlots(false);
      }
    });
    return () => {
      alive = false;
    };
  }, [draft.locationId, draft.date]);

  const freeCount = slots.filter((s) => s.available).length;

  // Día habilitado si la sede abre ese día y queda al menos un cupo (optimista fuera de rango).
  const isDayEnabled = (d: Date) => {
    if (sede && !sede.openDays.includes(d.getDay())) return false;
    const f = freeDays[toISODate(d)];
    return f === undefined ? true : f > 0;
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
      {/* Calendario de mes completo */}
      <div>
        <p className="eyebrow mb-4">Elige la fecha</p>
        <Calendar
          value={selectedDate}
          onChange={(d) => setDate(toISODate(d))}
          isDayEnabled={isDayEnabled}
        />
        <p className="mt-3 text-xs text-stone-500">
          {sede ? `${sede.name} atiende ${daysLabel}` : "Atención"} · 9:00 a.m.–7:00 p.m.
          {sede && !sede.openDays.includes(0) ? " Domingos cerrado." : ""}
        </p>
      </div>

      {/* Franjas horarias (reales) */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="eyebrow">{draft.date ? "Franjas disponibles" : "Primero elige una fecha"}</p>
          {draft.date && !loadingSlots && (
            <span className="flex items-center gap-2">
              <StatusDot variant={freeCount > 0 ? "signal" : "busy"} />
              <span className="eyebrow !text-ink-600">
                {freeCount > 0 ? `${freeCount} libres` : "Sin cupos"}
              </span>
            </span>
          )}
        </div>

        {!draft.date ? (
          <div className="flex h-48 items-center justify-center border border-dashed border-stone-200 bg-paper/50 px-6 text-center text-sm text-stone-500">
            Selecciona un día en el calendario para ver los horarios disponibles.
          </div>
        ) : loadingSlots ? (
          <div className="flex h-48 items-center justify-center border border-dashed border-stone-200 bg-paper/50 text-stone-400">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : freeCount === 0 ? (
          <div className="flex h-48 items-center justify-center border border-dashed border-stone-200 bg-paper-dim px-6 text-center text-sm text-ink-600">
            No quedan cupos para esta fecha. Elige otro día en el calendario.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {slots.map((slot) => {
              const selected = draft.time === slot.time;
              return (
                <button
                  key={slot.time}
                  disabled={!slot.available}
                  onClick={() => setTime(slot.time)}
                  aria-pressed={selected}
                  className={cn(
                    "mono-label flex items-center justify-center gap-1.5 border py-3 text-sm transition-colors duration-fast ease-expo",
                    selected && "border-ink-900 bg-ink-900 text-on-ink",
                    !selected && slot.available && "border-stone-200 bg-paper text-ink-900 hover:border-ink-900",
                    !slot.available && "cursor-not-allowed border-stone-200 bg-paper-dim text-stone-400 line-through",
                  )}
                >
                  {!selected && slot.available && <StatusDot variant="signal" />}
                  {slot.time}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
