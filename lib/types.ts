/**
 * Tipos de dominio de Lumina.
 * Esta capa modela el contrato que el Backend (APIs/Supabase) deberá cumplir
 * en fases posteriores. La UI consume únicamente estos tipos.
 */

export type ServiceCategory =
  | "masajes"
  | "faciales"
  | "corporales"
  | "rituales";

export interface ServiceCategoryMeta {
  id: ServiceCategory;
  label: string;
  description: string;
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  category: ServiceCategory;
  /** Resumen corto para tarjetas. */
  tagline: string;
  /** Descripción larga para la vista de detalle. */
  description: string;
  durationMin: number;
  /** Precio en pesos colombianos (COP). */
  price: number;
  image: string;
  /** Beneficios destacados (vista de detalle). */
  benefits: string[];
  /** Pasos del ritual / experiencia. */
  ritual: { title: string; detail: string }[];
  featured?: boolean;
}

export interface Location {
  id: string;
  slug: string;
  name: string;
  neighborhood: string;
  address: string;
  city: string;
  image: string;
  hours: string;
  /** Días que abre la sede. Convención Date.getDay(): 0=domingo … 6=sábado. */
  openDays: number[];
  phone: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number; // 1..5
  locationName: string;
}

/* ----------------------------- Reservas ----------------------------- */

export interface TimeSlot {
  time: string; // "10:30"
  available: boolean;
}

export interface BookingDraft {
  serviceId: string | null;
  locationId: string | null;
  date: string | null; // ISO "2026-06-04"
  time: string | null; // "10:30"
  customer: {
    fullName: string;
    email: string;
    phone: string;
    notes: string;
  };
}
