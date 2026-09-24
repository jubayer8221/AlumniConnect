import type {
  Notice,
  CreateNoticeRequest,
  UpdateNoticeRequest,
  NoticeQueryParams,
} from "@/types/notice";
import type { PaginatedResponse, ApiResponse } from "@/types/common";

export interface NoticeService {
  getAll(params?: NoticeQueryParams): Promise<PaginatedResponse<Notice>>;
  getById(id: string): Promise<ApiResponse<Notice>>;
  create(data: CreateNoticeRequest): Promise<ApiResponse<Notice>>;
  update(id: string, data: UpdateNoticeRequest): Promise<ApiResponse<Notice>>;
  delete(id: string): Promise<ApiResponse<null>>;
  publish(id: string): Promise<ApiResponse<Notice>>;
  unpublish(id: string): Promise<ApiResponse<Notice>>;
}
