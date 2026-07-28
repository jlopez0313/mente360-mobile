export default interface Planes {
  key: string;
  valor: valorPlan[];
}

export interface valorPlan {
  key: string;
  precio: {
    COP: string;
    USD: string;
  };
  descripcion: string;
  periodo: string;
}
