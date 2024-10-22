import { get, onValue, push, ref, set, update } from "firebase/database";
import { rtDatabase } from "../firebase/config"  // La configuración que definimos en el paso anterior

export const writeData = (route: string, data: any) => {
  return set(ref(rtDatabase, route), data)
}

export const addData = (route: string, data: any) => {
  return push(ref(rtDatabase, route), data)
}

export const updateData = (data: any) => {
  return update(ref(rtDatabase), data)
}

export const getData = (route: string) => {
  return get(ref(rtDatabase, route));
}
export const readData = (route: string) => {
  return ref(rtDatabase, route);
}