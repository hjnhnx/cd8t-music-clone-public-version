import { $axios } from "@/utils/request";
import type { AxiosPromise } from "axios";

const url = "/api/v1/like";

class LikeServiceClass {
  // eslint-disable-next-line @typescript-eslint/ban-types
  likeOrUnlike = (data: any): AxiosPromise<any> => $axios.post(`${url}`, data);
}

export const LikeService = new LikeServiceClass();
