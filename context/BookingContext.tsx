"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { BookingDraft } from "@/lib/types";
import { supabase } from "@/lib/supabase/client";

/**
 * Estado global de reserva — "Frontend Abierto".
 * `submitBooking` llama a la RPC `create_booking` de Supabase (ruta de invitado),
 * que valida cupo/horario/sede y devuelve el código de confirmación.
 */

export interface SubmitResult {
  ok: boolean;
  confirmationId?: string;
  /** Mensaje amigable en caso de error (hint del backend). */
  message?: string;
}

const emptyDraft: BookingDraft = {
  serviceId: null,
  locationId: null,
  date: null,
  time: null,
  customer: { fullName: "", email: "", phone: "", notes: "" },
};

interface BookingContextValue {
  draft: BookingDraft;
  setService: (id: string) => void;
  setLocation: (id: string) => void;
  setDate: (iso: string) => void;
  setTime: (time: string) => void;
  setCustomer: (patch: Partial<BookingDraft["customer"]>) => void;
  reset: () => void;
  /** Crea la reserva vía RPC `create_booking` en Supabase. */
  submitBooking: () => Promise<SubmitResult>;
  isSubmitting: boolean;
}

/** Mapea errores del backend a mensajes legibles en español. */
const ERROR_MESSAGES: Record<string, string> = {
  SLOT_TAKEN: "Esa franja ya fue reservada. Elige otra hora.",
  INVALID_SLOT: "La hora está fuera del horario de atención (9:00 a.m.–7:00 p.m.).",
  LOCATION_CLOSED: "La sede no atiende ese día. Elige otra fecha.",
  PAST_DATE: "No se puede reservar en una fecha pasada.",
  INVALID_LOCATION: "Sede no disponible. Elige otra.",
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<BookingDraft>(emptyDraft);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setService = useCallback((serviceId: string) => {
    setDraft((d) => ({ ...d, serviceId }));
  }, []);

  const setLocation = useCallback((locationId: string) => {
    setDraft((d) => ({ ...d, locationId }));
  }, []);

  const setDate = useCallback((date: string) => {
    setDraft((d) => ({ ...d, date, time: null }));
  }, []);

  const setTime = useCallback((time: string) => {
    setDraft((d) => ({ ...d, time }));
  }, []);

  const setCustomer = useCallback((patch: Partial<BookingDraft["customer"]>) => {
    setDraft((d) => ({ ...d, customer: { ...d.customer, ...patch } }));
  }, []);

  const reset = useCallback(() => setDraft(emptyDraft), []);

  const submitBooking = useCallback(async (): Promise<SubmitResult> => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.rpc("create_booking", {
        p_service_id: draft.serviceId,
        p_location_id: draft.locationId,
        p_date: draft.date,
        p_time_slot: draft.time,
        p_name: draft.customer.fullName,
        p_email: draft.customer.email,
        p_phone: draft.customer.phone,
        p_notes: draft.customer.notes || null,
      });

      if (error) {
        // El backend lanza un código (SLOT_TAKEN, INVALID_SLOT…) como message.
        const code = (error.message || "").trim();
        return { ok: false, message: ERROR_MESSAGES[code] ?? error.hint ?? "No pudimos completar la reserva. Inténtalo de nuevo." };
      }

      const booking = Array.isArray(data) ? data[0] : data;
      return { ok: true, confirmationId: booking?.confirmation_code };
    } catch {
      return { ok: false, message: "Error de conexión. Revisa tu internet e inténtalo de nuevo." };
    } finally {
      setIsSubmitting(false);
    }
  }, [draft]);

  const value = useMemo<BookingContextValue>(
    () => ({
      draft,
      setService,
      setLocation,
      setDate,
      setTime,
      setCustomer,
      reset,
      submitBooking,
      isSubmitting,
    }),
    [draft, setService, setLocation, setDate, setTime, setCustomer, reset, submitBooking, isSubmitting],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking debe usarse dentro de <BookingProvider>");
  return ctx;
}
