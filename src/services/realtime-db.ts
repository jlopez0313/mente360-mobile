import { get, onValue, push, ref, set, update, remove } from "firebase/database";
import { rtDatabase } from "../firebase/config"  // La configuración que definimos en el paso anterior

export const writeData = (route: string, data: any) => {
  return set(ref(rtDatabase, route), data)
}

export const addData = (route: string, data: any) => {
  return push(ref(rtDatabase, route), data)
}

export const updateData = (route: string, data: any) => {
  return update(ref(rtDatabase, route), data)
}

export const getData = (route: string) => {
  return get(ref(rtDatabase, route));
}

export const readData = (route: string) => {
  return ref(rtDatabase, route);
}

export const removeData = (route: string) => {
  return remove( ref(rtDatabase, route) );
}