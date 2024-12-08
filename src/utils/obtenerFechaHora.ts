export function obtenerFechaHora(): string {
  // Crear una instancia de la fecha actual en UTC
  const fechaActual = new Date();

  // Convertir la fecha a la zona horaria de La Paz, Bolivia (UTC-4)
  const opciones: Intl.DateTimeFormatOptions = {
    timeZone: 'America/La_Paz',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };

  // Formatear la fecha y hora según la zona horaria de La Paz
  const fechaHoraLaPaz = fechaActual.toLocaleString('es-BO', opciones);

  return fechaHoraLaPaz;
}