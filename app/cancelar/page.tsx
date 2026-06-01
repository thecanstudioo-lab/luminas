import { Suspense } from "react";
import type { Metadata } from "next";
import { Loader2 } from "lucide-react";
import { CancelClient } from "@/components/cancel/CancelClient";

export const metadata: Metadata = {
  title: "Cancelar reserva",
  robots: { index: false, follow: false },
};

export default function CancelarPage() {
  return (
    <section className="flex min-h-screen items-center justify-center px-4 pb-16 pt-[calc(var(--header-h)+24px)]">
      <Suspense
        fallback={
          <div className="flex items-center gap-2 text-white/70">
            <Loader2 className="h-5 w-5 animate-spin" /> Cargando…
          </div>
        }
      >
        <CancelClient />
      </Suspense>
    </section>
  );
}
