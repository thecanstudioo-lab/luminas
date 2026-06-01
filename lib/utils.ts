/** Formatea precios en pesos colombianos. */
export function formatCOP(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Formatea enteros con separador de miles (es-CO): 2418 → "2.418". */
export function formatThousands(value: number): string {
  return new Intl.NumberFormat("es-CO").format(value);
}

/** Formatea duración en minutos a texto legible. */
export function formatDuration(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

/** Une clases condicionales (mini clsx). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Fecha local (no-UTC) en formato ISO `YYYY-MM-DD`. Evita el corrimiento de día en Bogotá (UTC-5). */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** "10:30" → minutos desde medianoche (630). */
export function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Próximos N días a partir de hoy, como objetos de fecha. */
export function getUpcomingDays(
  count: number,
): { iso: string; weekday: string; day: string; month: string }[] {
  const days: { iso: string; weekday: string; day: string; month: string }[] = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      iso: toISODate(d),
      weekday: d.toLocaleDateString("es-CO", { weekday: "short" }),
      day: d.toLocaleDateString("es-CO", { day: "2-digit" }),
      month: d.toLocaleDateString("es-CO", { month: "short" }),
    });
  }
  return days;
}
