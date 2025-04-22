export const DB = {
  HOME: "home",
};

export const localDB = (key: string) => {
  const clear = () => {
    return localStorage.removeItem(key);
  };

  const set = (data: any) => {
    return localStorage.setItem(key, JSON.stringify(data));
  };

  const get = () => {
    return JSON.parse(localStorage.getItem(key) || "{}");
  };

  return {
    clear,
    set,
    get,
  };
};
