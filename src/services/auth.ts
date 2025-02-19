import { baseApi } from "./api";
import { HttpHeaders } from "@capacitor/core";

export const login = async (formData: {}) => {
  return new Promise(async (resolve, reject) => {
    const { post } = baseApi();

    try {
      resolve(
        await post("/login", formData, { "Content-type": "application/json" })
      );
    } catch (error: any) {
      if (error.response) {
        reject(error.response);
      } else if (error.request) {
        reject(error.request);
      } else {
        reject(error);
      }
    }
  });
};

export const register = async (formData: {}) => {
  return new Promise(async (resolve, reject) => {
    const { post } = baseApi();

    try {
      resolve(
        await post("/register", formData, {
          "Content-type": "application/json",
        })
      );
    } catch (error: any) {
      if (error.response) {
        reject(error.response);
      } else if (error.request) {
        reject(error.request);
      } else {
        reject(error);
      }
    }
  });
};

export const reset = async (formData: {}) => {
  return new Promise(async (resolve, reject) => {
    const { post } = baseApi();

    try {
      resolve(
        await post("/reset", formData, {
          "Content-type": "application/json",
        })
      );
    } catch (error: any) {
      if (error.response) {
        reject(error.response);
      } else if (error.request) {
        reject(error.request);
      } else {
        reject(error);
      }
    }
  });
};
