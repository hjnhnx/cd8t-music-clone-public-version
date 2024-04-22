import { $axios } from "@/utils/request";
import type { AxiosPromise } from "axios";
import type { ResponseData, Transaction } from "@/types/models";
import type { PageRequest, PaginationResponse } from "@/types/pagination";

const url = "/api/v1/star-point";

class StarPointServiceClass {
  listTransaction = (params: PageRequest): AxiosPromise<ResponseData<PaginationResponse<Transaction>>> =>
    $axios.get(`${url}/transaction`, { params });
}

export const StarPointService = new StarPointServiceClass();
