/**
 * MÉTRICAS DEL SITIO — agregados que solo el backend conoce.
 * Los conteos derivables (nº de sedes / servicios) se calculan en el componente
 * a partir del catálogo cargado desde la DB (DataContext), no aquí.
 *
 * TODO(backend): reemplazar por GET /api/metrics.
 */
export const siteMetrics = {
  completedExperiences: 2418, // reservas completadas históricas
  averageRating: 4.9, // promedio sobre todas las reseñas
  reviewCount: 487, // reseñas verificadas
  avgBookingSeconds: 30, // tiempo medio para completar una reserva (analytics)
};
