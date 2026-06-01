"use client";

import { useEffect, useState } from "react";
import { fetchUpcomingAvailability, type Upcoming } from "@/lib/supabase/availability";

/**
 * Próxima disponibilidad real (hoy restante o el siguiente día con cupos), desde la DB.
 * Calcula en el RPC (Bogotá) y refresca cada minuto. null hasta la primera respuesta.
 */
export function useUpcomingAvailability(): Upcoming | null {
  const [data, setData] = useState<Upcoming | null>(null);

  useEffect(() => {
    let alive = true;
    const read = async () => {
      const r = await fetchUpcomingAvailability();
      if (alive) setData(r);
    };
    read();
    const id = setInterval(read, 60_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return data;
}
