import axios from "axios";
import type { AxiosPromise } from "axios";

const cloudName = import.meta.env.VITE_CLOUD_NAME;

class UploadServiceClass {
  upload = (data: FormData): AxiosPromise<{ url: string }> =>
    axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
}

export const UploadService = new UploadServiceClass();
