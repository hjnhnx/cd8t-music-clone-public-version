import { $axios } from "@/utils/request";
import type { AxiosPromise } from "axios";

const url = "/api/v1";

class FollowServiceClass {
  // eslint-disable-next-line @typescript-eslint/ban-types
  follow = (data: any): AxiosPromise<any> => $axios.post(`${url}/follow`, data);
  unFollow = (data: any): AxiosPromise<any> => $axios.post(`${url}/unFollow`, data);
}

export const FollowService = new FollowServiceClass();
