import { $axios } from "@/utils/request";
import type { AxiosPromise } from "axios";
import type { Country, ResponseData } from "@/types/models";
import type { PageRequest, PaginationRequest, PaginationResponse } from "@/types/pagination";

const url = "/api/v1/countries";

class CountryServiceClass {
  list = (params: PaginationRequest): AxiosPromise<ResponseData<PaginationResponse<Country>>> =>
    $axios.get(`${url}/list`, { params });
  listClient = (params: PageRequest): AxiosPromise<ResponseData<Country>> => $axios.get(`${url}/list`, { params });
  // eslint-disable-next-line @typescript-eslint/ban-types
  getAll = (): AxiosPromise<Object> => $axios.get(`${url}`);
  random = (): AxiosPromise<Country[]> => $axios.get(`${url}/random`);
  store = (data: Partial<Country>): AxiosPromise<Country> => $axios.post(`${url}/create`, data);
  detail = (id: number): AxiosPromise<ResponseData<Country>> => $axios.get(`${url}/${id}`);
  update = (id: number, data: Partial<Country>): AxiosPromise<Country> => $axios.put(`${url}/update/${id}`, data);
  delete = (id: number): AxiosPromise<string> => $axios.delete(`${url}/delete/${id}`);
}

export const CountryService = new CountryServiceClass();
