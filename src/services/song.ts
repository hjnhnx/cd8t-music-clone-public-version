import { $axios } from "@/utils/request";
import type { AxiosPromise } from "axios";
import type { ResponseData, Song } from "@/types/models";
import type { PageRequest, PaginationRequest, PaginationResponse } from "@/types/pagination";

const url = "/api/v1/songs";
const urlDraft = "/api/v1/draftSong";
const urlComment = "/api/v1/comment";

export interface commentRes {
  data: string;
  message: string;
  code: number;
}

export interface NewComment {
  songId: number;
  message: string;
}

class SongServiceClass {
  list = (params: PaginationRequest): AxiosPromise<ResponseData<PaginationResponse<Song>>> =>
    $axios.get(`${url}`, { params });
  listLikeSong = (params: PageRequest): AxiosPromise<ResponseData<Song>> => $axios.get(`${url}/user`, { params });
  listNotAlbum = (): AxiosPromise<ResponseData<Song[]>> => $axios.get(`${url}/not-album`);
  listNewSong = (params: PageRequest): AxiosPromise<ResponseData<Song>> => $axios.get(`${url}`, { params });
  store = (data: Partial<Song>): AxiosPromise<Song> => $axios.post(`${urlDraft}/create`, data);
  detail = (id: number): AxiosPromise<ResponseData<Song>> => $axios.get(`${url}/${id}`);
  update = (id: number, data: Partial<Song>): AxiosPromise<Song> => $axios.put(`${urlDraft}/update/${id}`, data);
  delete = (id: number): AxiosPromise<string> => $axios.delete(`${url}/delete/${id}`);
  verify = (id: number): AxiosPromise<string> => $axios.put(`${url}/verify/${id}`);
  comment = (data: NewComment): AxiosPromise<commentRes> => $axios.post(`${urlComment}`, data);
  deleteComment = (id: number): AxiosPromise<commentRes> => $axios.delete(`${urlComment}/delete/${id}`);
  addview = (id: number): AxiosPromise<commentRes> => $axios.post("api/v1/view", { songId: id });
}

export const SongService = new SongServiceClass();
