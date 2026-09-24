import type {
  Alumni,
  CreateAlumniRequest,
  UpdateAlumniRequest,
  AlumniQueryParams,
} from "@/types/alumni";
import type { PaginatedResponse, ApiResponse } from "@/types/common";

export interface AlumniService {
  getAll(params?: AlumniQueryParams): Promise<PaginatedResponse<Alumni>>;
  getById(id: string): Promise<ApiResponse<Alumni>>;
  getByAlumniId(alumniId: string): Promise<ApiResponse<Alumni>>;
  create(data: CreateAlumniRequest): Promise<ApiResponse<Alumni>>;
  update(id: string, data: UpdateAlumniRequest): Promise<ApiResponse<Alumni>>;
  delete(id: string): Promise<ApiResponse<null>>;
  verify(id: string): Promise<ApiResponse<Alumni>>;
  updateStatus(
    id: string,
    status: Alumni["status"],
  ): Promise<ApiResponse<Alumni>>;
  updatePrivacy(
    id: string,
    data: {
      privacy: Alumni["privacy"];
      sectionPrivacy: Alumni["sectionPrivacy"];
    },
  ): Promise<ApiResponse<Alumni>>;
  getDashboardData(): Promise<
    ApiResponse<import("@/types/dashboard").DashboardData>
  >;
}
