import { semana } from "@/services/notificaciones";
import { update } from "../slices/notificationSlice";

export const getNotifications = () => {
  return async (dispatch: any) => {
    const {data: resp} = await semana();
    dispatch(update({ notificaciones: resp.data }));
  };
};
