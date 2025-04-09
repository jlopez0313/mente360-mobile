export function diferenciaEnDias(fecha1: Date, fecha2: Date) {
  const unDia = 1000 * 60 * 60 * 24;
  const diferencia = Math.abs(fecha2.getTime() - fecha1.getTime());
  return Math.floor(diferencia / unDia);
}

export function parse( format: string, date: Date) {
  switch( format ) {
    case 'YYYY-MM-DD': 
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
    
      const newDate = `${year}-${month}-${day}`;
      return newDate
    default:
      return date.toString()
  }
}
