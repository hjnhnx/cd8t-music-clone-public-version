import { $axios } from "@/utils/request";
import type { AxiosPromise } from "axios";
import type { ResponseData, StarPoint } from "@/types/models";
import type { PaginationRequest, PaginationResponse } from "@/types/pagination";

const url = "/api/v1/star-point";

class StarPointServiceClass {
  recharge = (data: StarPoint): AxiosPromise<ResponseData<boolean>> => $axios.post(`${url}/recharge`, data);
  donate = (data: any): AxiosPromise<ResponseData<boolean>> => $axios.post(`${url}/donate`, data);
  buyWithStarPoint = (data:any): AxiosPromise<ResponseData<boolean>> => $axios.post(`${url}/by-package`, data);
}

export const StarPointService = new StarPointServiceClass();
