import { $axios } from "@/utils/request";
import type { AxiosPromise } from "axios";
import type { ResponseData, Singer } from "@/types/models";
import type { PageRequest, PaginationRequest, PaginationResponse } from "@/types/pagination";

const url = "/api/v1/singer";

class SingerServiceClass {
  list = (params: PaginationRequest): AxiosPromise<ResponseData<PaginationResponse<Singer>>> => {
    return $axios.get(`${url}?verify=1`, { params });
  };
  getAll = (): AxiosPromise<Singer[]> => $axios.get(`${url}/all`);
  singerRequest = (params: PaginationRequest): AxiosPromise<ResponseData<PaginationResponse<Singer>>> =>
    $axios.get(`${url}?verify=0`, { params });
  topFiveFollow = (): AxiosPromise<Singer[]> => $axios.get(`${url}/top-five-follow`);
  store = (data: Partial<Singer>): AxiosPromise<Singer> => $axios.post(`${url}/create`, data);
  detail = (id: number, params: PageRequest): AxiosPromise<ResponseData<Singer>> =>
    $axios.get(`${url}/${id}`, { params });
  detailRequest = (id: number): AxiosPromise<ResponseData<Singer>> => $axios.get(`${url}/${id}`);
  update = (id: number, data: Partial<Singer>): AxiosPromise<Singer> => $axios.put(`${url}/${id}`, data);
  verify = (id: number): AxiosPromise<Singer> => $axios.put(`${url}/verify/${id}`);
  delete = (id: number): AxiosPromise<string> => $axios.delete(`${url}/delete/${id}`);
}

export const SingerService = new SingerServiceClass();
