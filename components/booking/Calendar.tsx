"use client";

// Calendario de mes completo, paginado por mes — sin límite de 14 días.
// Adaptado al sistema Luminas: monocromático cálido, esquinas rectas, motion calmo.
// Los días de cierre dependen de la sede (vía isDayEnabled); días pasados y sin cupos deshabilitados.

import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];
const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
const firstOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
// Índice de día con semana iniciando en lunes (0 = lun … 6 = dom).
const mondayIndex = (d: Date) => (d.getDay() + 6) % 7;

export function Calendar({
  value,
  onChange,
  minDate,
  isDayEnabled,
}: {
  value: Date | null;
  onChange: (d: Date) => void;
  minDate?: Date;
  /** Marca días no disponibles (p. ej. sin cupos / festivos). Domingo ya viene cerrado. */
  isDayEnabled?: (d: Date) => boolean;
}) {
  const reduce = useReducedMotion();
  const today = startOfDay(new Date());
  const min = startOfDay(minDate ?? today);
  const [view, setView] = useState<Date>(firstOfMonth(value ?? min));

  const canGoPrev = firstOfMonth(view) > firstOfMonth(min);

  const cells = useMemo<(Date | null)[]>(() => {
    const first = firstOfMonth(view);
    const lead = mondayIndex(first);
    const total = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    const arr: (Date | null)[] = Array.from({ length: lead }, () => null);
    for (let d = 1; d <= total; d++) arr.push(new Date(view.getFullYear(), view.getMonth(), d));
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [view]);

  function enabled(d: Date) {
    if (startOfDay(d) < min) return false; // días pasados
    // Los días de cierre dependen de la sede (vía isDayEnabled), no se hardcodean.
    return isDayEnabled ? isDayEnabled(d) : true;
  }

  return (
    <div className="w-full select-none border border-stone-200 bg-paper p-4">
      {/* Navegación de mes */}
      <div className="flex items-center justify-between pb-3">
        <button
          type="button"
          onClick={() => canGoPrev && setView((v) => addMonths(v, -1))}
          disabled={!canGoPrev}
          aria-label="Mes anterior"
          className="grid h-10 w-10 place-items-center rounded-none text-ink-900 transition-[background-color] duration-fast ease-expo hover:bg-stone-100 active:scale-95 disabled:opacity-20 disabled:hover:bg-transparent"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="font-display text-base font-semibold capitalize tracking-snug text-ink-900">
          {MESES[view.getMonth()]} {view.getFullYear()}
        </div>
        <button
          type="button"
          onClick={() => setView((v) => addMonths(v, 1))}
          aria-label="Mes siguiente"
          className="grid h-10 w-10 place-items-center rounded-none text-ink-900 transition-[background-color] duration-fast ease-expo hover:bg-stone-100 active:scale-95"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Encabezados de día */}
      <div className="mb-1 grid grid-cols-7">
        {WEEKDAYS.map((w, i) => (
          <div key={i} className="py-1 text-center text-[11px] font-semibold uppercase tracking-wide018 text-stone-400">
            {w}
          </div>
        ))}
      </div>

      {/* Grilla del mes (transición sobria al cambiar de mes) */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${view.getFullYear()}-${view.getMonth()}`}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-7 gap-1"
        >
          {cells.map((d, i) =>
            d === null ? (
              <div key={`b-${i}`} aria-hidden className="aspect-square" />
            ) : (
              (() => {
                const isSel = !!value && sameDay(d, value);
                const isToday = sameDay(d, today);
                const ok = enabled(d);
                return (
                  <button
                    key={d.toISOString()}
                    type="button"
                    disabled={!ok}
                    onClick={() => onChange(d)}
                    aria-pressed={isSel}
                    aria-label={d.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })}
                    className={cn(
                      "grid aspect-square min-h-[40px] w-full place-items-center rounded-none text-sm font-medium tabular-nums transition-[background-color,color] duration-fast ease-expo",
                      isSel
                        ? "bg-ink-900 text-on-ink"
                        : ok
                          ? "text-ink-900 hover:bg-stone-100"
                          : "cursor-not-allowed text-stone-300",
                      isToday && !isSel && ok && "ring-1 ring-inset ring-stone-300",
                    )}
                  >
                    {d.getDate()}
                  </button>
                );
              })()
            ),
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
