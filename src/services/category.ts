import { $axios } from "@/utils/request";
import type { AxiosPromise } from "axios";
import type { Category, ResponseData } from "@/types/models";
import type { PageRequest, PaginationRequest, PaginationResponse } from "@/types/pagination";

const url = "/api/v1/categories";

class CategoryServiceClass {
  list = (params: PaginationRequest): AxiosPromise<ResponseData<PaginationResponse<Category>>> =>
    $axios.get(`${url}/list`, { params });
  listClient = (params: PageRequest): AxiosPromise<ResponseData<Category>> => $axios.get(`${url}/list`, { params });
  // eslint-disable-next-line @typescript-eslint/ban-types
  getAll = (): AxiosPromise<ResponseData<Category[]>> => $axios.get(`${url}`);
  random = (): AxiosPromise<Category[]> => $axios.get(`${url}/random`);
  store = (data: Partial<Category>): AxiosPromise<Category> => $axios.post(`${url}/create`, data);
  detail = (id: number): AxiosPromise<ResponseData<Category>> => $axios.get(`${url}/${id}`);
  update = (id: number, data: Partial<Category>): AxiosPromise<Category> => $axios.put(`${url}/update/${id}`, data);
  delete = (id: number): AxiosPromise<string> => $axios.delete(`${url}/delete/${id}`);
}

export const CategoryService = new CategoryServiceClass();
