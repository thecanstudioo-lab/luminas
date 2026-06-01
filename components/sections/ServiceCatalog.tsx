"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Clock } from "lucide-react";
import { serviceCategories } from "@/lib/data/services";
import type { ServiceCategory } from "@/lib/types";
import { SectionTag } from "@/components/ui/SectionTag";
import { Reveal } from "@/components/anim/Reveal";
import { useBooking } from "@/context/BookingContext";
import { useServices } from "@/context/DataContext";
import { formatCOP, formatDuration, cn } from "@/lib/utils";

type Filter = "todos" | ServiceCategory;

const filters: { id: Filter; label: string }[] = [
  { id: "todos", label: "Todos" },
  ...serviceCategories.map((c) => ({ id: c.id as Filter, label: c.label })),
];

export function ServiceCatalog() {
  const [active, setActive] = useState<Filter>("todos");
  const { setService } = useBooking();
  const services = useServices();

  const visible = useMemo(
    () => (active === "todos" ? services : services.filter((s) => s.category === active)),
    [active, services],
  );

  function pick(id: string) {
    setService(id);
    document.getElementById("reservar")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section id="catalogo" className="scroll-mt-20 py-20 md:py-28">
      <div className="container-editorial">
        <Reveal>
          <SectionTag index={1} label="Catálogo" />
        </Reveal>

        <div className="mt-7 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <h2 className="max-w-xl font-display text-h1 font-bold text-balance text-ink-900">
              Cada servicio, una decisión de diseño.
            </h2>
          </Reveal>

          {/* Filtros */}
          <Reveal delay={80}>
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActive(f.id)}
                  aria-pressed={active === f.id}
                  className={cn(
                    "rounded-pill border px-4 py-2 text-sm font-medium transition-colors duration-fast ease-expo",
                    active === f.id
                      ? "border-ink-900 bg-ink-900 text-on-ink"
                      : "border-stone-200 bg-paper text-ink-600 hover:border-ink-900 hover:text-ink-900",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Tabla sin bordes, divisores hairline */}
        <Reveal delay={120}>
          <div className="mt-12 border-t border-stone-200">
            {visible.map((s, i) => {
              const cat = serviceCategories.find((c) => c.id === s.category);
              return (
                <button
                  key={s.id}
                  onClick={() => pick(s.id)}
                  className="group block w-full border-b border-stone-200 text-left transition-colors duration-fast ease-expo hover:bg-paper"
                >
                  <div className="flex items-center gap-4 px-0 py-6 transition-[padding] duration-fast ease-expo group-hover:px-5 md:gap-8">
                    <span className="mono-label hidden w-8 shrink-0 text-sm text-stone-400 sm:block">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-h3 font-semibold tracking-snug text-ink-900">
                        {s.name}
                      </span>
                      <span className="mt-1 block text-sm text-ink-600">{s.tagline}</span>
                    </span>

                    <span className="hidden w-28 shrink-0 md:block">
                      <span className="eyebrow">{cat?.label}</span>
                    </span>

                    <span className="hidden w-24 shrink-0 items-center gap-1.5 text-ink-600 lg:flex">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="mono-label text-sm">{formatDuration(s.durationMin)}</span>
                    </span>

                    <span className="mono-label w-24 shrink-0 text-right text-base text-ink-900 md:w-32">
                      {formatCOP(s.price)}
                    </span>

                    <span className="hidden shrink-0 text-ink-900 sm:block">
                      <ArrowUpRight className="h-5 w-5 transition-transform duration-fast ease-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
