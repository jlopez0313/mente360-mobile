import { baseApi } from './api';

// Secuencia nocturna: lista de audios del eneatipo del usuario (tabla `audios`)
// + meta { current_day, total_days, current_audio_id }.
export const getAudios = async (): Promise<any> => {
    const { get } = await baseApi();
    return get('/audios');
};
