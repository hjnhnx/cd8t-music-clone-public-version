import {$axios} from "@/utils/request";
import type {AxiosPromise} from "axios";
import type {ReportRequest, ReportStarPointRequest} from "@/types/models";


class DashboardServiceClass {
  staticSong = (): AxiosPromise<any> => $axios.get("api/v1/songs/dash-board");
  staticPackage = (params: ReportRequest): AxiosPromise<any> => $axios.get("api/v1/packages/dash-board",{ params });
  staticStarPoint = (params: ReportStarPointRequest): AxiosPromise<any> => $axios.get("api/v1/star-point/dash-board",{params} );
  staticPackageA = (params: ReportRequest): AxiosPromise<any> => $axios.get("api/v1/packages/dash-board", { params });
}

export const DashboardService = new DashboardServiceClass();
