"use client";

import { ArrowDown, ArrowUpRight } from "lucide-react";
import { motion, type Variants } from "motion/react";
import { AvailabilityChip } from "@/components/ui/AvailabilityChip";
import { useBooking } from "@/context/BookingContext";
import { useFeaturedServices, useServices, useLocations } from "@/context/DataContext";
import { siteMetrics } from "@/lib/services/metrics";
import { formatThousands } from "@/lib/utils";

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export function Hero() {
  const { setService } = useBooking();
  const featured = useFeaturedServices().slice(0, 3);
  const servicesCount = useServices().length;
  const sedesCount = useLocations().length;

  // Cifras: agregados del backend + conteos derivados del catálogo (DB).
  const stats = [
    { k: `+${formatThousands(siteMetrics.completedExperiences)}`, v: "Experiencias" },
    { k: String(sedesCount).padStart(2, "0"), v: "Sedes" },
    { k: siteMetrics.averageRating.toFixed(1), v: `Sobre ${siteMetrics.reviewCount} reseñas` },
    { k: `${servicesCount} tratamientos`, v: "En catálogo" },
  ];

  function quickPick(id: string) {
    setService(id);
    document.getElementById("reservar")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col justify-center px-2 py-28 text-white"
    >
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}
        className="container-editorial w-full"
      >
        <motion.p variants={item} className="eyebrow mb-6 !text-white/70">
          Spa de alta gama · Bogotá
        </motion.p>

        <motion.h1
          variants={item}
          className="max-w-4xl font-display text-6xl font-bold leading-none tracking-[-0.04em] text-balance md:text-7xl lg:text-8xl"
        >
          El arte de la calma.
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-8 max-w-xl text-lg leading-relaxed text-white/75 text-pretty md:text-xl"
        >
          Masajes, faciales y rituales de bienestar en el corazón de Bogotá. Reserva tu
          momento de calma en tres pasos —treinta segundos, cero fricción.
        </motion.p>

        {/* Panel glass de reserva rápida (el "search box" del brief, en clave spa) */}
        <motion.div
          variants={item}
          className="liquid-glass mt-12 max-w-2xl rounded-3xl p-3"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-2">
            <AvailabilityChip bare className="px-2" />
            <div className="flex items-center gap-2">
              <motion.a
                href="#catalogo"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                Ver catálogo
                <ArrowDown className="h-4 w-4" />
              </motion.a>
              <motion.a
                href="#reservar"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-ink-900 transition-colors hover:bg-white/90"
              >
                Reservar
                <ArrowUpRight className="h-4 w-4" />
              </motion.a>
            </div>
          </div>

          {/* Pills de acceso rápido — preseleccionan servicio y saltan a la reserva */}
          <div className="mt-2 flex flex-wrap gap-2 px-1 pb-1 sm:px-2">
            {featured.map((s) => (
              <motion.button
                key={s.id}
                onClick={() => quickPick(s.id)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="rounded-pill border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:border-white/40 hover:text-white"
              >
                {s.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Cifras derivadas */}
        <motion.div
          variants={item}
          className="mt-14 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.v} className="px-5 py-5">
              <p className="mono-label text-2xl text-white">{stat.k}</p>
              <p className="eyebrow mt-1.5 !text-white/55">{stat.v}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
