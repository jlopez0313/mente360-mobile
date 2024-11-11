import { update } from "../slices/notificationSlice";
import { semana } from "@/services/notificaciones";

export const getNotifications = () => {
  return async (dispatch) => {
    const {data: resp} = await semana();
    dispatch(update({ notificaciones: resp.data }));
  };
};
