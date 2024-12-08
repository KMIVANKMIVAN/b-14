export function convertirFechaHora(fechaHoraUtc: string): string {
  // Crear un objeto Date a partir del string de fecha y hora en UTC
  const utcDate = new Date(fechaHoraUtc);

  // Definir el offset de Bolivia en horas (UTC-4)
  const boliviaOffset = -4;

  // Convertir el offset a milisegundos
  const offsetMilliseconds = boliviaOffset * 60 * 60 * 1000;

  // Aplicar el offset a la fecha UTC para obtener la hora en Bolivia
  const boliviaDate = new Date(utcDate.getTime() + offsetMilliseconds);

  // Devolver la fecha y hora en formato ISO 8601 (con la zona horaria de Bolivia)
  // console.log(boliviaDate.toISOString().replace('Z', ''));

  return boliviaDate.toISOString().replace('Z', ''); // Eliminar 'Z' para representar la zona horaria local
}