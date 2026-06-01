import type { Service, ServiceCategoryMeta } from "@/lib/types";

export const serviceCategories: ServiceCategoryMeta[] = [
  { id: "masajes", label: "Masajes", description: "Técnicas manuales para liberar tensión y restaurar el cuerpo." },
  { id: "faciales", label: "Faciales", description: "Protocolos de luminosidad y cuidado profundo de la piel." },
  { id: "corporales", label: "Corporales", description: "Exfoliaciones y envolturas que renuevan de pies a cabeza." },
  { id: "rituales", label: "Rituales", description: "Experiencias completas que integran cuerpo, aroma y silencio." },
];

export const services: Service[] = [
  {
    id: "svc-deep-tissue",
    slug: "masaje-de-tejido-profundo",
    name: "Masaje de Tejido Profundo",
    category: "masajes",
    tagline: "Presión firme y sostenida para descontracturar la musculatura profunda.",
    description:
      "Una sesión enfocada en las capas más profundas del músculo y la fascia. Ideal para quienes acumulan tensión por estrés o postura. Nuestros terapeutas trabajan con presión progresiva y aceites tibios para devolver movilidad y aliviar el dolor crónico.",
    durationMin: 80,
    price: 290000,
    image:
      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1200&q=80",
    benefits: [
      "Alivia contracturas y dolor crónico",
      "Mejora la movilidad articular",
      "Reduce el estrés acumulado",
    ],
    ritual: [
      { title: "Recibimiento", detail: "Infusión cálida y diagnóstico corporal personalizado." },
      { title: "Terapia", detail: "Presión profunda progresiva con aceite de árnica tibio." },
      { title: "Cierre", detail: "Hidratación, reposo y recomendación post-sesión." },
    ],
    featured: true,
  },
  {
    id: "svc-piedras",
    slug: "masaje-con-piedras-calientes",
    name: "Masaje con Piedras Calientes",
    category: "masajes",
    tagline: "Calor mineral que funde la tensión y equilibra la energía.",
    description:
      "Piedras volcánicas a temperatura controlada se deslizan sobre los puntos de tensión, combinando calor envolvente con maniobras suaves. Una experiencia profundamente relajante que mejora la circulación.",
    durationMin: 90,
    price: 320000,
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
    benefits: [
      "Relajación profunda inmediata",
      "Estimula la circulación",
      "Equilibra el sistema nervioso",
    ],
    ritual: [
      { title: "Recibimiento", detail: "Aromaterapia de bienvenida y respiración guiada." },
      { title: "Terapia", detail: "Piedras volcánicas tibias sobre meridianos de tensión." },
      { title: "Cierre", detail: "Té de hierbas y espacio de descanso." },
    ],
  },
  {
    id: "svc-facial-luminosidad",
    slug: "facial-luminosidad-lumina",
    name: "Facial Luminosidad Lumina",
    category: "faciales",
    tagline: "Nuestro protocolo insignia para una piel radiante y descansada.",
    description:
      "Un facial completo con limpieza profunda, exfoliación enzimática, masaje de drenaje facial y mascarilla de vitamina C. Diseñado para revelar luminosidad inmediata y una piel visiblemente más firme.",
    durationMin: 70,
    price: 250000,
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80",
    benefits: [
      "Luminosidad visible inmediata",
      "Estimula la producción de colágeno",
      "Drena y desinflama el rostro",
    ],
    ritual: [
      { title: "Diagnóstico", detail: "Análisis de piel con luz cálida y limpieza profunda." },
      { title: "Tratamiento", detail: "Exfoliación enzimática + masaje de drenaje facial." },
      { title: "Sellado", detail: "Mascarilla de vitamina C y protección final." },
    ],
    featured: true,
  },
  {
    id: "svc-hidra-facial",
    slug: "hidratacion-facial-profunda",
    name: "Hidratación Facial Profunda",
    category: "faciales",
    tagline: "Reservorio de humedad para pieles deshidratadas y opacas.",
    description:
      "Un tratamiento de rescate con ácido hialurónico, sérum nutritivo y mascarilla de colágeno. Devuelve elasticidad, suaviza líneas finas y deja la piel sedosa.",
    durationMin: 60,
    price: 220000,
    image:
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1200&q=80",
    benefits: ["Hidratación intensa y duradera", "Suaviza líneas finas", "Restaura la elasticidad"],
    ritual: [
      { title: "Limpieza", detail: "Doble limpieza y tonificación equilibrante." },
      { title: "Infusión", detail: "Ácido hialurónico y sérum nutritivo en capas." },
      { title: "Mascarilla", detail: "Velo de colágeno y masaje relajante." },
    ],
  },
  {
    id: "svc-exfoliacion",
    slug: "exfoliacion-corporal-mineral",
    name: "Exfoliación Corporal Mineral",
    category: "corporales",
    tagline: "Sales del Pacífico que renuevan la piel de pies a cabeza.",
    description:
      "Una exfoliación corporal completa con sales minerales y aceites esenciales que elimina células muertas, activa la circulación y deja la piel suave, luminosa y profundamente hidratada.",
    durationMin: 60,
    price: 210000,
    image:
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=80",
    benefits: ["Renueva y suaviza la piel", "Activa la microcirculación", "Hidratación de cierre"],
    ritual: [
      { title: "Preparación", detail: "Ducha aromática y cepillado en seco." },
      { title: "Exfoliación", detail: "Sales minerales con aceites esenciales cítricos." },
      { title: "Nutrición", detail: "Manto hidratante de manteca de karité." },
    ],
  },
  {
    id: "svc-envoltura",
    slug: "envoltura-detox-de-arcilla",
    name: "Envoltura Detox de Arcilla",
    category: "corporales",
    tagline: "Arcilla termal que desintoxica y reafirma la silueta.",
    description:
      "Una envoltura corporal de arcilla termal rica en minerales que ayuda a eliminar toxinas, reducir la retención de líquidos y reafirmar la piel. Termina con una hidratación profunda.",
    durationMin: 75,
    price: 260000,
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    benefits: ["Efecto detox y reafirmante", "Reduce retención de líquidos", "Mineraliza la piel"],
    ritual: [
      { title: "Activación", detail: "Exfoliación ligera para abrir los poros." },
      { title: "Envoltura", detail: "Arcilla termal mineral y reposo envolvente." },
      { title: "Cierre", detail: "Drenaje suave e hidratación reafirmante." },
    ],
  },
  {
    id: "svc-ritual-lumina",
    slug: "ritual-lumina-completo",
    name: "Ritual Lumina Completo",
    category: "rituales",
    tagline: "Tres horas de desconexión total: cuerpo, rostro y sentidos.",
    description:
      "Nuestra experiencia más completa: comienza con un baño aromático, continúa con exfoliación corporal, masaje relajante de cuerpo entero y culmina con nuestro facial insignia. Una jornada diseñada para reiniciar por completo.",
    durationMin: 180,
    price: 580000,
    image:
      "https://images.unsplash.com/photo-1610501669174-f24ed00cb12?auto=format&fit=crop&w=1200&q=80",
    benefits: [
      "Experiencia integral de cuerpo y rostro",
      "Desconexión profunda de 3 horas",
      "Incluye baño aromático y refrigerio",
    ],
    ritual: [
      { title: "Inmersión", detail: "Baño aromático y respiración guiada." },
      { title: "Cuerpo", detail: "Exfoliación mineral + masaje relajante completo." },
      { title: "Rostro", detail: "Facial Luminosidad Lumina y reposo final." },
    ],
    featured: true,
  },
  {
    id: "svc-ritual-pareja",
    slug: "ritual-en-pareja",
    name: "Ritual en Pareja",
    category: "rituales",
    tagline: "Una experiencia compartida en una suite privada.",
    description:
      "Diseñado para dos, en una suite privada con masaje relajante simultáneo, aromaterapia y una copa de cortesía. El plan perfecto para celebrar o simplemente reconectar.",
    durationMin: 110,
    price: 520000,
    image:
      "https://images.unsplash.com/photo-1591343395082-e120087004b4?auto=format&fit=crop&w=1200&q=80",
    benefits: ["Suite privada para dos", "Masaje simultáneo", "Copa y refrigerio de cortesía"],
    ritual: [
      { title: "Bienvenida", detail: "Suite privada, aromaterapia y brindis de cortesía." },
      { title: "Masaje", detail: "Masaje relajante simultáneo para ambos." },
      { title: "Reposo", detail: "Espacio íntimo de descanso compartido." },
    ],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getFeaturedServices(): Service[] {
  return services.filter((s) => s.featured);
}
