"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Service, Location } from "@/lib/types";

/**
 * Catálogo (servicios + sedes) cargado desde Supabase en el servidor y entregado
 * a los componentes cliente vía contexto. Sin parpadeo de carga: los datos vienen
 * sembrados desde el render de servidor.
 */
interface DataContextValue {
  services: Service[];
  locations: Location[];
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({
  services,
  locations,
  children,
}: DataContextValue & { children: ReactNode }) {
  return (
    <DataContext.Provider value={{ services, locations }}>{children}</DataContext.Provider>
  );
}

function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData debe usarse dentro de <DataProvider>");
  return ctx;
}

export function useServices(): Service[] {
  return useData().services;
}

export function useLocations(): Location[] {
  return useData().locations;
}

export function useFeaturedServices(): Service[] {
  return useData().services.filter((s) => s.featured);
}

export function useLocationById(id: string | null): Location | undefined {
  return useData().locations.find((l) => l.id === id) ?? undefined;
}
