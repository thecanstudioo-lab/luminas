import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { VideoBackdrop } from "@/components/layout/VideoBackdrop";
import { BookingProvider } from "@/context/BookingContext";
import { DataProvider } from "@/context/DataContext";
import { fetchServices, fetchLocations } from "@/lib/supabase/queries";

// Archivo — fuente de marca AUTO-ALOJADA (archivos en app/fonts/, del handoff de Claude Design).
const archivo = localFont({
  src: [
    { path: "./fonts/Archivo-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Archivo-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Archivo-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/Archivo-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/Archivo-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "./fonts/Archivo-Black.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-archivo",
  display: "swap",
});

// Inter — cuerpo/UI, vía Google (no se subieron archivos locales de Inter).
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

// Revalida el catálogo (servicios/sedes) desde la DB cada 10 min sin redeploy.
export const revalidate = 600;

export const metadata: Metadata = {
  title: "LUMINAS · Spa de alta gama en Bogotá",
  description:
    "El silencio tiene arquitectura. Spa de alta gama en Bogotá: catálogo de servicios y reserva en tres pasos. Editorial, preciso, monocromático.",
  keywords: ["spa Bogotá", "masajes", "faciales", "bienestar", "Luminas"],
  openGraph: {
    title: "LUMINAS · Spa de alta gama en Bogotá",
    description: "El silencio tiene arquitectura.",
    type: "website",
    locale: "es_CO",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Catálogo desde Supabase (con fallback a mock). Se siembra en el contexto cliente.
  const [services, locations] = await Promise.all([fetchServices(), fetchLocations()]);

  return (
    <html lang="es" className={`${archivo.variable} ${inter.variable}`}>
      <body className="relative min-h-screen overflow-x-hidden bg-ink-900 text-white selection:bg-white/20 selection:text-white">
        <DataProvider services={services} locations={locations}>
          <BookingProvider>
            <VideoBackdrop />
            <Navbar />
            <main className="relative z-10">{children}</main>
            <Footer />
          </BookingProvider>
        </DataProvider>
      </body>
    </html>
  );
}
