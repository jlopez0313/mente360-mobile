import { get, push, ref, remove, set, update } from "firebase/database";
import { rtDatabase } from "../firebase/config";

export const writeData = (route: string, data: any) => {
  return set(ref(rtDatabase, route), data);
};

export const addData = (route: string, data: any) => {
  return push(ref(rtDatabase, route), data);
};

export const updateData = (route: string, data: any) => {
  return update(ref(rtDatabase, route), data);
};

export const getData = (route: string) => {
  return get(ref(rtDatabase, route));
};

export const readData = (route: string) => {
  return ref(rtDatabase, route);
};

export const removeData = (route: string) => {
  return remove(ref(rtDatabase, route));
};

export const getArrayData = async (route: string) => {
  const snapshot = await getData(route);
  const val = snapshotToArray(snapshot.val());

  if (!val) return [];

  return Object.keys(val).map((key) => ({
    id: key,
    ...val[key],
  }));
};

export const snapshotToArray = (data: any) => {
  return data
    ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
    : [];
};
