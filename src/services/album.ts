import { $axios } from "@/utils/request";
import type { AxiosPromise } from "axios";
import type { Album, AlbumSong, ResponseData } from "@/types/models";
import type { PageRequest, PaginationRequest, PaginationResponse } from "@/types/pagination";

const url = "/api/v1/albums";

class AlbumServiceClass {
  list = (params: PaginationRequest): AxiosPromise<ResponseData<PaginationResponse<Album>>> =>
    $axios.get(`${url}`, { params });
  // eslint-disable-next-line @typescript-eslint/ban-types
  getAll = (): AxiosPromise<Album[]> => $axios.get(`${url}`);
  getAllBySinger = (id: number): AxiosPromise<Album[]> => $axios.get(`${url}/singer/${id}`);
  random = (id: number): AxiosPromise<Album[]> => $axios.get(`${url}/random/${id}`);
  store = (data: Partial<Album>): AxiosPromise<Album> => $axios.post(`${url}/create`, data);
  addSongToAlbum = (data: Partial<AlbumSong>): AxiosPromise<AlbumSong> => $axios.post(`${url}/add/song-album`, data);
  detail = (id: number, params: PageRequest): AxiosPromise<ResponseData<Album>> =>
    $axios.get(`${url}/${id}`, { params });
  update = (id: number, data: Partial<Album>): AxiosPromise<Album> => $axios.put(`${url}/update/${id}`, data);
  delete = (id: number): AxiosPromise<string> => $axios.delete(`${url}/delete/${id}`);
}

export const AlbumService = new AlbumServiceClass();
