export function diferenciaEnDias(fecha1: Date, fecha2: Date) {
  const unDia = 1000 * 60 * 60 * 24;
  const diferencia = Math.abs(fecha2.getTime() - fecha1.getTime());
  return Math.floor(diferencia / unDia);
}

export const getDisplayDate = (isoDate: string) => {
  const fecha = new Date(isoDate);
  const ahora = new Date();

  const esMismoDia = fecha.toDateString() === ahora.toDateString();

  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);
  const esAyer = fecha.toDateString() === ayer.toDateString();

  const diffMs = ahora.getTime() - fecha.getTime();
  const diffDias = diffMs / (1000 * 60 * 60 * 24);

  if (esMismoDia) {
    return fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (esAyer) {
    return "Ayer";
  } else if (diffDias < 7) {
    return fecha.toLocaleDateString("es-ES", { weekday: "long" });
  } else {
    return fecha.toLocaleDateString();
  }
};
