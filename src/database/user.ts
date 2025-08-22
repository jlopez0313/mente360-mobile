import Crecimientos from "./crecimientos";

export default interface User {
  id: number;
  name: string;
  email: string;
  country: string;
  phone: string;
  is_admin: string;
  has_paid: string;
  fecha_nacimiento: string;
  eneatipo: string;
  eneatipo_label: string;
  genero: string;
  genero_label: string;
  crecimientos_id: string;
  photo: string;
  invitados: User[];
  fcm_token: string;
  device: string;
  ref_payco: string;
  ref_status: string;
  fecha_pago: string;
  fecha_vencimiento: string;
  crecimiento: Crecimientos;
  suscripciones: any[];
}
