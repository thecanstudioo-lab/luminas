"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { StatusDot } from "@/components/ui/StatusDot";
import { useUpcomingAvailability } from "@/lib/hooks/useUpcomingAvailability";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#catalogo", label: "Catálogo" },
  { href: "#sedes", label: "Sedes" },
  { href: "#experiencias", label: "Experiencias" },
];

export function Navbar() {
  const [pastHero, setPastHero] = useState(false);
  const [open, setOpen] = useState(false);
  const availability = useUpcomingAvailability();
  const hasSlots = availability === null || availability.free > 0;

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.82);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // El bar flota: glass blanco sobre el video; crema/tinta sobre la hoja de contenido.
  const barCls = pastHero
    ? "bg-cream/85 backdrop-blur-[14px] border border-stone-200"
    : "liquid-glass";
  const textMain = pastHero ? "text-ink-900" : "text-white";
  const textSoft = pastHero ? "text-ink-600 hover:text-ink-900" : "text-white/70 hover:text-white";

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-3 md:px-6 md:pt-4"
    >
      <nav
        className={cn(
          "mx-auto flex h-16 max-w-container items-center justify-between rounded-2xl px-4 transition-colors duration-300 ease-expo md:px-6",
          barCls,
        )}
      >
        <Link
          href="#top"
          onClick={() => setOpen(false)}
          className={cn("font-display text-xl font-black uppercase tracking-snug", textMain)}
          aria-label="LUMINAS — inicio"
        >
          LUMINAS<span>.</span>
        </Link>

        <ul className="hidden items-center gap-9 min-[880px]:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={cn("text-sm font-medium transition-colors duration-fast", textSoft)}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 min-[880px]:flex">
          <span className="flex items-center gap-2" title="Disponibilidad">
            <StatusDot variant={hasSlots ? "signal" : "busy"} pulse={hasSlots} />
            <span className={cn("eyebrow", pastHero ? "!text-ink-600" : "!text-white/70")}>
              {availability === null
                ? "Disponibilidad"
                : availability.free > 0
                  ? `${availability.free} ${availability.label}`
                  : "Consultar"}
            </span>
          </span>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <Link
              href="#reservar"
              className={cn(
                "inline-flex items-center rounded-xl px-5 py-2.5 text-sm font-medium transition-colors duration-fast",
                pastHero ? "bg-ink-900 text-white hover:bg-ink-600" : "liquid-glass text-white",
              )}
            >
              Reservar
            </Link>
          </motion.div>
        </div>

        <button
          className={cn("flex h-10 w-10 items-center justify-center min-[880px]:hidden", textMain)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Menú móvil — glass */}
      <motion.div
        initial={false}
        animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "liquid-glass mx-auto mt-3 max-w-container rounded-2xl px-5 py-4 min-[880px]:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <ul className="flex flex-col gap-1">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-3 font-display text-2xl tracking-snug text-white"
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="pt-3">
            <Link
              href="#reservar"
              onClick={() => setOpen(false)}
              className="liquid-glass block rounded-xl px-5 py-3 text-center text-sm font-medium text-white"
            >
              Reservar
            </Link>
          </li>
        </ul>
      </motion.div>
    </motion.header>
  );
}
