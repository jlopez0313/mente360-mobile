import { ref, set } from "firebase/database";
import { rtDatabase } from "../firebase/config"  // La configuración que definimos en el paso anterior

export const writeData = (route: string, data: any) => {
  set(ref(rtDatabase, route), data);
}