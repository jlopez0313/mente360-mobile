import { baseApi } from './api';

export interface Rosario {
  id: number;
  user_id: number;
  nombre: string;
  intencion?: string;
  tipo_misterio: 'gozosos' | 'dolorosos' | 'gloriosos' | 'luminosos';
  modalidad: 'ahora' | 'programado';
  fecha_hora?: string;
  privacidad: 'publico' | 'comunidad';
  comunidad_ids?: number[];
  estado: 'en_vivo' | 'programado' | 'finalizado' | 'borrador';
  participantes_count?: number;
  mi_progreso?: {
    decena_actual: number;
    progreso_porcentaje: number;
  };
  creador?: {
    id: number;
    name: string;
    email: string;
  };
  participantes?: Array<{
    id: number;
    usuario?: {
      id: number;
      name: string;
      email: string;
    };
  }>;
}

export const getRosarios = async (tab: 'ahora' | 'programados' | 'intenciones' = 'ahora') => {
  const api = await baseApi();
  const response = await api.get(`/rosarios?tab=${tab}`);
  return response.data;
};

export const createRosario = async (data: Partial<Rosario>) => {
  const api = await baseApi();
  const response = await api.post('/rosarios', data);
  return response.data;
};

export const getRosario = async (id: number | string) => {
  const api = await baseApi();
  const response = await api.get(`/rosarios/${id}`);
  return response.data;
};

export const unirseRosario = async (id: number | string) => {
  const api = await baseApi();
  const response = await api.post(`/rosarios/${id}/unirse`, {});
  return response.data;
};

export const avanzarRosario = async (id: number | string) => {
  const api = await baseApi();
  const response = await api.post(`/rosarios/${id}/avanzar`, {});
  return response.data;
};

export const reiniciarRosario = async (id: number | string) => {
  const api = await baseApi();
  const response = await api.post(`/rosarios/${id}/reiniciar`, {});
  return response.data;
};

export const responderAmen = async (id: number | string) => {
  const api = await baseApi();
  const response = await api.post(`/rosarios/${id}/amen`, {});
  return response.data;
};

export const pedirOracion = async (id: number | string, mensaje?: string) => {
  const api = await baseApi();
  const response = await api.post(`/rosarios/${id}/peticion`, { mensaje });
  return response.data;
};
