# Lumina · Spa de alta gama en Bogotá

Frontend de **Lumina**, un spa de alta gama en Bogotá. Construido con **Next.js (App Router)** y **React**, bajo una arquitectura de **"Frontend Abierto"**: toda la lógica visual e interactiva funciona con estado local de React y datos simulados (mock data), completamente desacoplada y lista para conectar un Backend (APIs / Supabase) en fases posteriores.

## Stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript** (strict)
- **Tailwind CSS** — sistema de diseño editorial/minimalista
- **lucide-react** — iconografía
- Tipografía: **Archivo** (titulares) + **Inter** (cuerpo), auto-alojadas vía `next/font`

## Arranque

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
```

## Estructura

```
app/
  layout.tsx                 Fuentes, Navbar, Footer, BookingProvider
  page.tsx                   Landing
  globals.css                Tokens de diseño + base
  servicios/[slug]/page.tsx  Detalle de servicio
  reservar/page.tsx          Flujo de reserva (3 pasos)
components/
  layout/    Navbar · Footer
  sections/  Hero · ServicesCatalog · LocationsGrid · Testimonials · FinalCTA
  booking/   BookingWidget · Stepper · Step1Service · Step2DateTime · Step3Confirm
  ui/        Button · Badge · SectionHeading · ServiceCard · LocationCard
context/
  BookingContext.tsx         Estado global de reserva (punto de integración con backend)
lib/
  types.ts                   Contratos de dominio
  utils.ts                   Helpers (formato COP, slots, fechas)
  data/                      Mock data: services · locations · testimonials
```

## Sistema de diseño

Paleta cálida (crema + tinta) con un único acento de **arcilla** (`clay`) y soporte **salvia** (`sage`).
Tokens definidos en `tailwind.config.ts`. Escala tipográfica editorial en `fontSize` (`display-*`).

## Punto de integración con el Backend

Toda la lógica de reserva vive en [`context/BookingContext.tsx`](context/BookingContext.tsx).
El método `submitBooking()` está aislado y hoy simula una llamada de red; para conectar el
backend basta reemplazar su cuerpo por un `fetch('/api/bookings', …)` o una mutación de Supabase.
El contrato de entrada es el tipo `BookingDraft` (ver `lib/types.ts`).

## Imágenes

Las fotografías son **placeholders** (Unsplash) listos para reemplazar por assets reales.
Configurado en `next.config.mjs` → `images.remotePatterns`.
