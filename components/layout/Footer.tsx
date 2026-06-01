"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Music2, Facebook, Twitter, Youtube, Instagram } from "lucide-react";

const linkGroups = [
  {
    title: "Descubre",
    links: ["Catálogo", "Sedes", "Experiencias", "Rituales", "Reservar"],
  },
  {
    title: "La marca",
    links: ["Nuestra historia", "El equipo", "Prensa", "Trabaja con nosotros"],
  },
  {
    title: "Contacto",
    links: ["Escríbenos", "Privacidad", "Términos de uso", "PQR"],
  },
];

const socials = [
  { Icon: Music2, label: "TikTok" },
  { Icon: Facebook, label: "Facebook" },
  { Icon: Twitter, label: "X" },
  { Icon: Youtube, label: "YouTube" },
  { Icon: Instagram, label: "Instagram" },
];

const year = new Date().getFullYear();

export function Footer() {
  return (
    <div className="relative z-10 px-4 pb-6 md:px-6">
      <motion.footer
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
        className="liquid-glass mx-auto mt-24 w-full max-w-container rounded-3xl p-6 text-white md:mt-40 md:p-10"
      >
        {/* Grid superior (12 columnas) */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Logo + descripción */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden
              >
                <path d="M 4.688 136 C 68.373 136 120 187.627 120 251.312 C 120 252.883 119.967 254.445 119.905 256 L 0 256 L 0 136.096 C 1.555 136.034 3.117 136 4.688 136 Z M 251.312 136 C 252.883 136 254.445 136.034 256 136.096 L 256 256 L 136.095 256 C 136.032 254.438 136.001 252.875 136 251.312 C 136 187.627 187.627 136 251.312 136 Z M 119.905 0 C 119.967 1.555 120 3.117 120 4.688 C 120 68.373 68.373 120 4.687 120 C 3.117 120 1.555 119.967 0 119.905 L 0 0 Z M 256 119.905 C 254.445 119.967 252.883 120 251.312 120 C 187.627 120 136 68.373 136 4.687 C 136 3.117 136.033 1.555 136.095 0 L 256 0 Z" />
              </svg>
              <span className="text-xl font-medium tracking-snug">LUMINAS</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed opacity-70">
              El silencio tiene arquitectura. Spa de alta gama en Bogotá —
              bienestar expresado en restricción y luz, con tres sedes en la ciudad.
            </p>
          </div>

          {/* Columnas de enlaces */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7">
            {linkGroups.map((group) => (
              <div key={group.title}>
                <h4 className="mb-4 text-sm font-medium uppercase tracking-wider">{group.title}</h4>
                <ul className="space-y-2">
                  {group.links.map((label) => (
                    <li key={label}>
                      <Link
                        href="#"
                        className="block text-xs opacity-70 transition-colors hover:text-white hover:opacity-100"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Barra inferior */}
        <div className="mt-10 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-6 md:flex-row md:gap-4">
          <p className="text-[10px] uppercase tracking-widest opacity-50">
            © {year} Luminas Spa · Hecho con calma en Bogotá
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-widest opacity-50">Síguenos:</span>
            <div className="flex items-center gap-3">
              {socials.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="opacity-70 transition-all hover:scale-110 hover:opacity-100"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
