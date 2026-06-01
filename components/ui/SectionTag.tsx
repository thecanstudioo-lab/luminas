/**
 * Etiqueta de sección numerada — dispositivo de índice editorial: `01 / CATÁLOGO`.
 * Numeral con cero a la izquierda, mono-tabular; nombre en eyebrow.
 */
export function SectionTag({ index, label }: { index: number; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="mono-label text-sm text-ink-900">{String(index).padStart(2, "0")}</span>
      <span className="h-px w-8 bg-stone-300" aria-hidden />
      <span className="eyebrow">{label}</span>
    </div>
  );
}
