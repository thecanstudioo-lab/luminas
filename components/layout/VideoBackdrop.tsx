"use client";

/**
 * Fondo de video fijo del ecosistema inmersivo. Vive detrás de todo (z-0).
 * La fuente es intercambiable: pásala por prop o reemplaza DEFAULT_VIDEO por un
 * asset propio/local en producción. Incluye velo (scrim) para legibilidad.
 */
// Video local auto-alojado en public/videos/ (intercambiable por prop).
const DEFAULT_VIDEO = "/videos/hero-bg.mp4";

export function VideoBackdrop({ src = DEFAULT_VIDEO }: { src?: string }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      {/* Color base bajo el video (por si tarda o falla la carga) */}
      <div className="absolute inset-0 bg-ink-900" />
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className="video-scrim absolute inset-0" />
    </div>
  );
}
