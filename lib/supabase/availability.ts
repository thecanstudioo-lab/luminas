"use client";

import { supabase } from "./client";
import type { TimeSlot } from "@/lib/types";
import { toISODate } from "@/lib/utils";

/**
 * Disponibilidad REAL desde Supabase (RPCs SECURITY DEFINER, sin PII):
 * la grilla operativa menos las reservas no canceladas, con horario y zona Bogotá.
 * Nada de datos inventados — todo sale de la DB.
 */

export interface Upcoming {
  dateISO: string;
  free: number;
  label: string;
  isToday: boolean;
}

export async function fetchDaySlots(locationId: string, dateISO: string): Promise<TimeSlot[]> {
  const { data, error } = await supabase.rpc("get_day_slots", {
    p_location_id: locationId,
    p_date: dateISO,
  });
  if (error || !data) return [];
  return (data as { time_slot: string; available: boolean }[]).map((r) => ({
    time: r.time_slot,
    available: r.available,
  }));
}

export async function fetchFreeDays(
  locationId: string,
  fromISO: string,
  toISO: string,
): Promise<Record<string, number>> {
  const { data, error } = await supabase.rpc("get_free_days", {
    p_location_id: locationId,
    p_from: fromISO,
    p_to: toISO,
  });
  if (error || !data) return {};
  const map: Record<string, number> = {};
  for (const r of data as { d: string; free: number }[]) map[r.d] = r.free;
  return map;
}

export async function fetchUpcomingAvailability(): Promise<Upcoming | null> {
  const { data, error } = await supabase.rpc("get_upcoming_availability");
  if (error || !data) return null;
  const { dateISO, free } = data as { dateISO: string; free: number };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateISO + "T00:00:00");
  const days = Math.round((d.getTime() - today.getTime()) / 86_400_000);
  const label =
    days <= 0 ? "hoy" : days === 1 ? "mañana" : d.toLocaleDateString("es-CO", { weekday: "long" });

  return { dateISO, free, label, isToday: days <= 0 };
}

/** Helper local reutilizado por el calendario. */
export { toISODate };
