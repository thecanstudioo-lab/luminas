"use client";

import { useBooking } from "@/context/BookingContext";
import { useServices, useLocations } from "@/context/DataContext";
import { formatCOP, formatDuration, cn } from "@/lib/utils";

const inputCls =
  "w-full rounded-none border border-stone-200 bg-paper px-4 py-3 text-sm text-ink-900 outline-none " +
  "transition-colors duration-fast ease-expo placeholder:text-stone-400 focus:border-ink-900";

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="eyebrow mb-2 block">{label}</span>
      <input {...props} className={inputCls} />
    </label>
  );
}

export function Step3Confirm() {
  const { draft, setCustomer } = useBooking();
  const services = useServices();
  const locations = useLocations();

  const service = services.find((s) => s.id === draft.serviceId);
  const location = locations.find((l) => l.id === draft.locationId);
  const dateLabel = draft.date
    ? new Date(draft.date + "T00:00:00").toLocaleDateString("es-CO", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "—";

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr]">
      {/* Formulario */}
      <div>
        <p className="eyebrow mb-4">Tus datos</p>
        <div className="space-y-4">
          <Field
            label="Nombre completo"
            placeholder="Valentina Ortega"
            value={draft.customer.fullName}
            onChange={(e) => setCustomer({ fullName: e.target.value })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Correo"
              type="email"
              placeholder="tu@correo.com"
              value={draft.customer.email}
              onChange={(e) => setCustomer({ email: e.target.value })}
            />
            <Field
              label="Teléfono"
              type="tel"
              placeholder="+57 300 000 0000"
              value={draft.customer.phone}
              onChange={(e) => setCustomer({ phone: e.target.value })}
            />
          </div>
          <label className="block">
            <span className="eyebrow mb-2 block">Notas · opcional</span>
            <textarea
              rows={3}
              placeholder="Preferencias de presión, ocasión, alergias…"
              value={draft.customer.notes}
              onChange={(e) => setCustomer({ notes: e.target.value })}
              className={cn(inputCls, "resize-none")}
            />
          </label>
        </div>
      </div>

      {/* Resumen — divisores dasheados */}
      <aside className="h-fit border border-stone-200 bg-paper p-6">
        <p className="eyebrow mb-5">Resumen</p>
        <dl className="space-y-3 text-sm">
          <Row label="Servicio" value={service?.name ?? "—"} />
          <Row label="Duración" value={service ? formatDuration(service.durationMin) : "—"} mono />
          <Row label="Sede" value={location?.name ?? "—"} />
          <Row label="Fecha" value={dateLabel} className="capitalize" />
          <Row label="Hora" value={draft.time ?? "—"} mono />
        </dl>
        <div className="mt-5 flex items-center justify-between border-t border-ink-900 pt-5">
          <span className="eyebrow">Total</span>
          <span className="mono-label text-h3 text-ink-900">
            {service ? formatCOP(service.price) : "—"}
          </span>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-stone-500">
          El pago se realiza en la sede. Recibirás confirmación por correo.
        </p>
      </aside>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
  className,
}: {
  label: string;
  value: string;
  mono?: boolean;
  className?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-dashed border-stone-200 pb-3">
      <dt className="text-stone-500">{label}</dt>
      <dd className={cn("text-right text-ink-900", mono ? "mono-label" : "font-medium", className)}>
        {value}
      </dd>
    </div>
  );
}
