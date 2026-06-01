import "server-only";
import type { Service, Location } from "@/lib/types";
import { services as mockServices } from "@/lib/data/services";
import { locations as mockLocations } from "@/lib/data/locations";
import { createServerSupabase } from "./server";

/**
 * Capa de lectura del catálogo. Mapea filas de la DB (snake_case) a los tipos del
 * frontend (camelCase) y CAE A MOCK (`lib/data/*`) si la DB falla o no hay env —
 * así la landing nunca queda vacía.
 */

type ServiceRow = {
  id: string; slug: string; name: string; category: Service["category"];
  tagline: string | null; description: string | null; duration_min: number;
  price_cop: number; image_url: string | null; benefits: string[] | null;
  ritual: Service["ritual"] | null; featured: boolean;
};

type LocationRow = {
  id: string; slug: string; name: string; neighborhood: string | null;
  address: string; city: string; image_url: string | null; hours: string | null;
  open_days: number[] | null; phone: string | null;
};

function mapService(r: ServiceRow): Service {
  return {
    id: r.id, slug: r.slug, name: r.name, category: r.category,
    tagline: r.tagline ?? "", description: r.description ?? "",
    durationMin: r.duration_min, price: r.price_cop, image: r.image_url ?? "",
    benefits: r.benefits ?? [], ritual: r.ritual ?? [], featured: r.featured,
  };
}

function mapLocation(r: LocationRow): Location {
  return {
    id: r.id, slug: r.slug, name: r.name, neighborhood: r.neighborhood ?? "",
    address: r.address, city: r.city, image: r.image_url ?? "", hours: r.hours ?? "",
    openDays: r.open_days ?? [], phone: r.phone ?? "",
  };
}

export async function fetchServices(): Promise<Service[]> {
  try {
    const { data, error } = await createServerSupabase()
      .from("services").select("*").eq("is_active", true).order("created_at");
    if (error || !data || data.length === 0) return mockServices;
    return (data as ServiceRow[]).map(mapService);
  } catch {
    return mockServices;
  }
}

export async function fetchLocations(): Promise<Location[]> {
  try {
    const { data, error } = await createServerSupabase()
      .from("locations").select("*").eq("is_active", true).order("created_at");
    if (error || !data || data.length === 0) return mockLocations;
    return (data as LocationRow[]).map(mapLocation);
  } catch {
    return mockLocations;
  }
}
