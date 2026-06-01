"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import { useLocations } from "@/context/DataContext";
import { SectionTag } from "@/components/ui/SectionTag";
import { Reveal } from "@/components/anim/Reveal";

export function SedesGrid() {
  const locations = useLocations();
  return (
    <section id="sedes" className="scroll-mt-20 py-20 md:py-28">
      <div className="container-editorial">
        <Reveal>
          <SectionTag index={2} label="Sedes" />
        </Reveal>
        <Reveal>
          <h2 className="mt-7 max-w-xl font-display text-h1 font-bold text-balance text-ink-900">
            Tres direcciones. Una sola idea de lujo.
          </h2>
        </Reveal>

        {/* Grid con bordes hairline internos */}
        <Reveal delay={100}>
          <div className="mt-12 grid border border-stone-200 bg-paper md:grid-cols-3 md:divide-x md:divide-stone-200 max-md:divide-y max-md:divide-stone-200">
            {locations.map((loc, i) => (
              <article key={loc.id} className="flex flex-col p-7">
                <div className="flex items-center justify-between">
                  <span className="mono-label text-sm text-stone-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="eyebrow">{loc.neighborhood}</span>
                </div>

                <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-xs bg-ink-800">
                  <Image
                    src={loc.image}
                    alt={loc.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover opacity-85 grayscale transition-transform duration-slow ease-expo hover:scale-[1.03]"
                  />
                </div>

                <h3 className="mt-6 font-display text-h3 font-semibold tracking-snug text-ink-900">
                  {loc.name}
                </h3>
                <p className="mt-2 flex items-start gap-2 text-sm text-ink-600">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" />
                  <span>
                    {loc.address}, {loc.city}
                  </span>
                </p>
                <p className="mono-label mt-3 text-sm text-ink-600">{loc.hours}</p>
                <p className="mono-label mt-1 text-sm text-stone-500">{loc.phone}</p>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
