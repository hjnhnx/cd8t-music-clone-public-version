import { $axios } from "@/utils/request";
import type { AxiosPromise } from "axios";
import type { Package, ResponseData, UserPackage } from "@/types/models";
import type { PaginationRequest, PaginationResponse } from "@/types/pagination";

const url = "/api/v1/packages";

class PackageServiceClass {
  list = (params: PaginationRequest): AxiosPromise<ResponseData<PaginationResponse<Package>>> =>
    $axios.get(`${url}`, { params });
  store = (data: Partial<Package>): AxiosPromise<Package> => $axios.post(`${url}/create`, data);
  detail = (id: number): AxiosPromise<ResponseData<Package>> => $axios.get(`${url}/${id}`);
  update = (id: number, data: Partial<Package>): AxiosPromise<Package> => $axios.put(`${url}/update/${id}`, data);
  delete = (id: number): AxiosPromise<string> => $axios.delete(`${url}/delete/${id}`);

  access = (data: UserPackage): AxiosPromise<ResponseData<boolean>> => $axios.post(`${url}/access`, data);
}

export const PackageService = new PackageServiceClass();
