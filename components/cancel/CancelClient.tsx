"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, Loader2, CalendarX2, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { StatusDot } from "@/components/ui/StatusDot";

interface Summary {
  confirmation_code: string;
  status: string;
  service: string;
  location: string;
  location_address: string;
  appointment_date: string;
  time_slot: string;
  guest_name: string;
}

type View = "loading" | "ready" | "invalid" | "cancelling" | "done" | "error";

const ERRORS: Record<string, string> = {
  CANCEL_TOO_LATE: "No se puede cancelar una cita pasada. Escríbenos para ayudarte.",
  CANNOT_CANCEL_COMPLETED: "Esta cita ya fue realizada.",
  INVALID_TOKEN: "Este enlace no es válido o ya venció.",
};

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function CancelClient() {
  const params = useSearchParams();
  const code = params.get("code");
  const token = params.get("token");

  const [view, setView] = useState<View>("loading");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!code || !token) {
      setView("invalid");
      setMessage("El enlace está incompleto.");
      return;
    }
    (async () => {
      const { data, error } = await supabase.rpc("get_booking_by_token", {
        p_confirmation_code: code,
        p_token: token,
      });
      if (error || !data) {
        setView("invalid");
        setMessage(ERRORS.INVALID_TOKEN);
        return;
      }
      setSummary(data as Summary);
      setView("ready");
    })();
  }, [code, token]);

  async function doCancel() {
    setView("cancelling");
    const { data, error } = await supabase.rpc("cancel_booking", {
      p_confirmation_code: code,
      p_token: token,
    });
    if (error) {
      setMessage(ERRORS[(error.message || "").trim()] ?? error.hint ?? "No pudimos cancelar la cita.");
      setView("error");
      return;
    }
    setSummary((s) => (s ? { ...s, status: "cancelled" } : s));
    void data;
    setView("done");
  }

  const card = "w-full max-w-md border border-stone-200 bg-paper p-8 md:p-10";

  if (view === "loading") {
    return (
      <div className={card}>
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-stone-400" />
        <p className="mt-4 text-center text-sm text-ink-600">Verificando tu reserva…</p>
      </div>
    );
  }

  if (view === "invalid" || view === "error") {
    return (
      <div className={card}>
        <span className="mx-auto flex h-12 w-12 items-center justify-center bg-busy-dim text-busy">
          <AlertTriangle className="h-6 w-6" />
        </span>
        <h1 className="mt-6 text-center font-display text-h3 font-bold text-ink-900">No fue posible</h1>
        <p className="mt-3 text-center text-sm text-ink-600">{message}</p>
        <Link
          href="/"
          className="mt-8 flex items-center justify-center rounded-none bg-ink-900 px-6 py-3 text-sm font-medium text-on-ink transition-colors hover:bg-ink-600"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  if (view === "done" || (summary && summary.status === "cancelled")) {
    return (
      <div className={card}>
        <span className="mx-auto flex h-12 w-12 items-center justify-center bg-ink-900 text-on-ink">
          <Check className="h-6 w-6" />
        </span>
        <h1 className="mt-6 text-center font-display text-h3 font-bold text-ink-900">Reserva cancelada</h1>
        <p className="mt-3 text-center text-sm text-ink-600">
          Tu cita {summary ? <span className="mono-label text-ink-900">{summary.confirmation_code}</span> : null} fue
          cancelada y el cupo quedó liberado. Gracias por avisarnos.
        </p>
        <Link
          href="/#reservar"
          className="mt-8 flex items-center justify-center rounded-none border border-ink-900 px-6 py-3 text-sm font-medium text-ink-900 transition-colors hover:bg-ink-900 hover:text-on-ink"
        >
          Agendar una nueva cita
        </Link>
      </div>
    );
  }

  // view === "ready" | "cancelling" with an active booking
  const completed = summary?.status === "completed";

  return (
    <div className={card}>
      <span className="mx-auto flex h-12 w-12 items-center justify-center bg-paper-dim text-ink-900">
        <CalendarX2 className="h-6 w-6" />
      </span>
      <h1 className="mt-6 text-center font-display text-h3 font-bold text-ink-900">¿Cancelar tu cita?</h1>
      <p className="mt-2 text-center text-sm text-ink-600">
        {completed ? "Esta cita ya fue realizada." : "Esta acción libera el cupo y no se puede deshacer."}
      </p>

      {summary && (
        <dl className="mt-6 space-y-3 border-y border-stone-200 py-5 text-sm">
          <Row label="Código" value={summary.confirmation_code} mono />
          <Row label="Tratamiento" value={summary.service} />
          <Row label="Sede" value={summary.location} />
          <Row label="Fecha" value={formatDate(summary.appointment_date)} className="capitalize" />
          <Row label="Hora" value={summary.time_slot} mono />
        </dl>
      )}

      {!completed && (
        <button
          onClick={doCancel}
          disabled={view === "cancelling"}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-none bg-ink-900 px-6 py-3.5 text-sm font-medium text-on-ink transition-colors hover:bg-busy disabled:opacity-50"
        >
          {view === "cancelling" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Cancelando…
            </>
          ) : (
            <>
              <StatusDot variant="busy" />
              Sí, cancelar mi cita
            </>
          )}
        </button>
      )}

      <Link
        href="/"
        className="mt-3 flex w-full items-center justify-center px-6 py-3 text-sm font-medium text-ink-600 transition-colors hover:text-ink-900"
      >
        No, mantener mi cita
      </Link>
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
    <div className="flex items-center justify-between gap-4">
      <dt className="text-stone-500">{label}</dt>
      <dd className={`text-right text-ink-900 ${mono ? "mono-label" : "font-medium"} ${className ?? ""}`}>
        {value}
      </dd>
    </div>
  );
}
