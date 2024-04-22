import { $axios } from "@/utils/request";
import type { AxiosPromise } from "axios";
import type { DraftSong, ResponseData } from "@/types/models";
import type { PaginationRequest, PaginationResponse } from "@/types/pagination";

const url = "/api/v1/draftSong";

class DraftSongServiceClass {
  list = (params: PaginationRequest): AxiosPromise<ResponseData<PaginationResponse<DraftSong>>> =>
    $axios.get(`${url}`, { params });
  detail = (id: number): AxiosPromise<ResponseData<DraftSong>> => $axios.get(`${url}/${id}`);
}

export const DraftSongService = new DraftSongServiceClass();
