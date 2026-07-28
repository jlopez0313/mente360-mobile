export const formatCurrency = (amount: number, currency: "COP" | "USD" = "COP") => {
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  }

  const rounded = Math.floor(amount / 100) * 100;
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (valor: any, decimales: number = 0) => {
  if (valor === null || valor === undefined) return "";

  const limpio = String(valor).replace(/,/g, "").trim();

  if (!isNaN(limpio as any) && limpio !== "") {
    return Number(valor).toLocaleString("de-DE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimales,
    });
  }

  return valor;
};

export const formatPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return digits.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
  }

  if (digits.length === 12 && digits.startsWith("57")) {
    return `${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }

  return phone;
};

export const formatCount = (num) => {
  if (num < 1000) return num.toString();
  if (num < 1_000_000) return `${(num / 1000).toFixed(1).replace('.0', '')}k`;
  if (num < 1_000_000_000)
    return `${(num / 1_000_000).toFixed(1).replace('.0', '')}M`;
  return `${(num / 1_000_000_000).toFixed(1).replace('.0', '')}B`;
};