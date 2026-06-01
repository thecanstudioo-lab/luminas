import type { Location } from "@/lib/types";

// Tres sedes del design system de Luminas (Bogotá).
export const locations: Location[] = [
  {
    id: "loc-norte",
    slug: "norte-usaquen",
    name: "Sede Norte",
    neighborhood: "Usaquén",
    address: "Carrera 6 # 119-30",
    city: "Bogotá",
    image:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1000&q=80",
    hours: "Lun–Sáb · 09:00–19:00",
    openDays: [1, 2, 3, 4, 5, 6], // lun–sáb
    phone: "+57 601 123 4567",
  },
  {
    id: "loc-poblado",
    slug: "poblado-chico",
    name: "Sede Poblado",
    neighborhood: "Chicó",
    address: "Calle 93 # 11-27",
    city: "Bogotá",
    image:
      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1000&q=80",
    hours: "Lun–Dom · 09:00–19:00",
    openDays: [0, 1, 2, 3, 4, 5, 6], // todos los días
    phone: "+57 601 234 5678",
  },
  {
    id: "loc-zonag",
    slug: "zona-g-quinta-camacho",
    name: "Sede Zona G",
    neighborhood: "Quinta Camacho",
    address: "Carrera 7 # 70-40",
    city: "Bogotá",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80",
    hours: "Lun–Sáb · 09:00–19:00",
    openDays: [1, 2, 3, 4, 5, 6], // lun–sáb
    phone: "+57 601 345 6789",
  },
];

export function getLocationBySlug(slug: string): Location | undefined {
  return locations.find((l) => l.slug === slug);
}
