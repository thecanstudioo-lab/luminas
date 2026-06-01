"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import { Stepper } from "./Stepper";
import { Step1Service } from "./Step1Service";
import { Step2DateTime } from "./Step2DateTime";
import { Step3Confirm } from "./Step3Confirm";
import { Button } from "@/components/ui/Button";
import { StatusDot } from "@/components/ui/StatusDot";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 3;

export function BookingWidget() {
  const { draft, submitBooking, isSubmitting, reset } = useBooking();
  const [step, setStep] = useState(1);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canContinue = (() => {
    if (step === 1) return Boolean(draft.serviceId && draft.locationId);
    if (step === 2) return Boolean(draft.date && draft.time);
    if (step === 3)
      return Boolean(
        draft.customer.fullName.trim() &&
          draft.customer.email.trim() &&
          draft.customer.phone.trim(),
      );
    return false;
  })();

  async function handleSubmit() {
    setError(null);
    const res = await submitBooking();
    if (res.ok && res.confirmationId) {
      setConfirmation(res.confirmationId);
    } else {
      setError(res.message ?? "No pudimos completar la reserva.");
    }
  }

  function handleReset() {
    reset();
    setConfirmation(null);
    setError(null);
    setStep(1);
  }

  /* ----- Confirmación ----- */
  if (confirmation) {
    return (
      <div className="border border-stone-200 bg-paper p-8 text-center md:p-14">
        <span className="mx-auto flex h-12 w-12 items-center justify-center bg-ink-900 text-on-ink">
          <Check className="h-6 w-6" />
        </span>
        <h3 className="mt-6 font-display text-h2 font-bold text-ink-900">Reserva confirmada.</h3>
        <p className="mx-auto mt-3 max-w-md text-ink-600 text-pretty">
          Enviamos los detalles a{" "}
          <span className="font-medium text-ink-900">{draft.customer.email}</span>.
        </p>
        <p className="mono-label mt-6 inline-block border border-stone-200 px-4 py-2 text-sm text-ink-900">
          Código · {confirmation}
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button onClick={handleReset} variant="secondary">
            Hacer otra reserva
          </Button>
        </div>
      </div>
    );
  }

  /* ----- Flujo 3 pasos ----- */
  return (
    <div className="border border-stone-200 bg-paper p-6 md:p-10">
      <Stepper current={step} />

      <div className="mt-10 min-h-[280px]">
        {step === 1 && <Step1Service />}
        {step === 2 && <Step2DateTime />}
        {step === 3 && <Step3Confirm />}
      </div>

      {/* Error del backend (cupo, horario, sede…) */}
      {error && step === TOTAL_STEPS && (
        <p className="mt-6 flex items-center gap-2 border border-busy/40 bg-busy-dim px-4 py-3 text-sm text-ink-900">
          <StatusDot variant="busy" />
          {error}
        </p>
      )}

      {/* Controles */}
      <div className="mt-10 flex items-center justify-between border-t border-stone-200 pt-6">
        <button
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          className={cn(
            "inline-flex items-center gap-2 text-sm font-medium text-ink-600 transition-colors duration-fast ease-expo hover:text-ink-900",
            step === 1 && "pointer-events-none opacity-0",
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          Atrás
        </button>

        <span className="mono-label text-xs text-stone-400">
          {String(step).padStart(2, "0")} / {String(TOTAL_STEPS).padStart(2, "0")}
        </span>

        {step < TOTAL_STEPS ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canContinue}>
            Continuar
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!canContinue || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Confirmando
              </>
            ) : (
              <>
                Confirmar reserva
                <Check className="h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

/** Sección de reserva — banda de arena (#EBE3D4), única área no-cream del flujo. */
export function BookingSection() {
  return (
    <section id="reservar" className="scroll-mt-20 bg-paper-dim py-20 md:py-28">
      <div className="container-editorial">
        <div className="flex items-center gap-3">
          <span className="mono-label text-sm text-ink-900">04</span>
          <span className="h-px w-8 bg-stone-300" aria-hidden />
          <span className="eyebrow">Reserva</span>
        </div>

        <div className="mt-7 flex flex-wrap items-end justify-between gap-6">
          <h2 className="max-w-xl font-display text-h1 font-bold text-balance text-ink-900">
            Tres pasos. Treinta segundos. Cero fricción.
          </h2>
          <span className="flex items-center gap-2">
            <StatusDot variant="signal" pulse />
            <span className="eyebrow !text-ink-600">Disponibilidad en vivo</span>
          </span>
        </div>

        <div className="mt-12">
          <BookingWidget />
        </div>
      </div>
    </section>
  );
}
