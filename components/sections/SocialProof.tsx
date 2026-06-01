import { Star } from "lucide-react";
import { testimonials } from "@/lib/data/testimonials";
import { SectionTag } from "@/components/ui/SectionTag";
import { Reveal } from "@/components/anim/Reveal";

export function SocialProof() {
  return (
    <section id="experiencias" className="scroll-mt-20 py-20 md:py-28">
      <div className="container-editorial">
        <Reveal>
          <SectionTag index={3} label="Experiencias" />
        </Reveal>
        <Reveal>
          <h2 className="mt-7 max-w-xl font-display text-h1 font-bold text-balance text-ink-900">
            Lo que queda después del silencio.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-px border border-stone-200 bg-stone-200 sm:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 60} className="reveal bg-paper">
              <figure className="flex h-full flex-col p-8">
                <div className="flex items-center gap-0.5 text-busy" aria-label={`${t.rating} de 5`}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-5 flex-1 font-display text-h3 font-medium leading-snug tracking-snug text-ink-900 text-pretty">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 border-t border-stone-200 pt-5">
                  <p className="font-medium text-ink-900">{t.name}</p>
                  <p className="eyebrow mt-1">
                    {t.role} · {t.locationName}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
