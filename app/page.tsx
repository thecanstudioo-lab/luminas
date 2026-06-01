import { Hero } from "@/components/sections/Hero";
import { ServiceCatalog } from "@/components/sections/ServiceCatalog";
import { SedesGrid } from "@/components/sections/SedesGrid";
import { SocialProof } from "@/components/sections/SocialProof";
import { BookingSection } from "@/components/booking/BookingWidget";

export default function HomePage() {
  return (
    <>
      {/* Hero inmersivo: transparente sobre el video (texto blanco + glass) */}
      <Hero />

      {/*
        "Hoja de contenido": superficie sólida crema que se desliza sobre el video
        tras el hero. Mantiene legible y funcional el contenido del spa (catálogo,
        sedes, reseñas, reserva) mientras el video respira en el hero y el footer.
      */}
      <div className="relative z-10 overflow-hidden rounded-[2.5rem] bg-cream text-ink-900 shadow-[0_-32px_64px_-24px_rgba(0,0,0,0.5)]">
        <ServiceCatalog />
        <SedesGrid />
        <SocialProof />
        <BookingSection />
      </div>
    </>
  );
}
