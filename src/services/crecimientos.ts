import { baseApi } from "./api";

export async function all(page = 0, fromDate: string = ""): Promise<any> {
  return new Promise(async (resolve, reject) => {
    const { get } = baseApi();

    try {
      resolve(
        await get(`/crecimientos?page=${page}&last_sync=${fromDate}`, {
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
}

export const byLevel = async (nivelesID: string, fromDate: string = ""): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const { get } = baseApi();

    try {
      resolve(
        await get(`/crecimientos/by-nivel/${nivelesID}?last_sync=${fromDate}`, {
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
