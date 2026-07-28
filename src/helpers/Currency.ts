export const getCurrencyForUser = (_user?: any): "COP" | "USD" => {
  return "USD";
};

// Tolerante a datos en caché (Dexie) desactualizados de una sincronización previa al cambio a precios por moneda.
export const getPlanPrecio = (plan: { precio?: { COP?: string; USD?: string } } | undefined, currency: "COP" | "USD"): number => {
  return Number(plan?.precio?.[currency] ?? 0);
};
