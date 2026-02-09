import {
  endAt,
  get,
  limitToFirst,
  limitToLast,
  onChildAdded,
  onChildChanged,
  onDisconnect,
  orderByChild,
  orderByKey,
  push,
  Query,
  query,
  QueryConstraint,
  ref,
  remove,
  set,
  startAfter,
  startAt,
  update,
} from "firebase/database";
import { rtDatabase } from "../firebase/config";

type QueryOptions = {
  orderBy?: string;
  limit?: number;
  direction?: "first" | "last";

  startAfter?: string;
  startAt?: string;
  endAt?: string;
};

export const childChanged = (querySent: string | Query, callback: any) => {
  const query = typeof querySent === "string" ? ref(rtDatabase, querySent) : queryTo(querySent);

  return onChildChanged(query, callback);
};

export const childAdded = (querySent: string | Query, callback: any) => {
  const query = typeof querySent === "string" ? ref(rtDatabase, querySent) : queryTo(querySent);

  return onChildAdded(query, callback);
};

export const queryTo = (route: string, options: QueryOptions = {}) => {
  const constraints: QueryConstraint[] = [];

  if (options.orderBy) {
    if (options.orderBy == "key") {
      constraints.push(orderByKey());
    } else {
      constraints.push(orderByChild(options.orderBy));
    }
  }

  if (options.startAt) {
    constraints.push(startAt(options.startAt));
  }

  if (options.startAfter) {
    constraints.push(startAfter(options.startAfter));
  }

  if (options.endAt) {
    constraints.push(endAt(options.endAt));
  }

  if (options.limit) {
    if (options.direction === "first") {
      constraints.push(limitToFirst(options.limit));
    } else {
      constraints.push(limitToLast(options.limit));
    }
  }

  return query(ref(rtDatabase, route), ...constraints);
};

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

export const getQuery = (query: Query) => {
  return get(query);
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

export const doDisconnect = (route: string, data: any) => {
  onDisconnect(ref(rtDatabase, route)).update(data);
};
