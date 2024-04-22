import { $axios } from "@/utils/request";
import type { AxiosPromise } from "axios";
import type { ResponseData, User } from "@/types/models";
import type { PaginationRequest, PaginationResponse } from "@/types/pagination";

const url = "/api/v1/user";

class UserServiceClass {
  findAdmin = (params: PaginationRequest): AxiosPromise<ResponseData<PaginationResponse<User>>> =>
    $axios.get(`${url}`, { params });
  store = (data: Partial<User>): AxiosPromise<User> => $axios.post(`${url}/create`, data);
  detail = (id: number): AxiosPromise<ResponseData<User>> => $axios.get(`${url}/${id}`);
  update = (id: number, data: Partial<User>): AxiosPromise<User> => $axios.put(`${url}/update/${id}`, data);
  delete = (id: number): AxiosPromise<string> => $axios.delete(`${url}/delete/${id}`);
  getProfile = (): AxiosPromise<ResponseData<User>> => $axios.get(`${url}/profile`);
}

export const UserService = new UserServiceClass();
