import type { ApiResponse, PagedResult } from "@/types/api";
import type {
  CreateNoticeRequest,
  Notice,
  NoticeQueryParams,
  UpdateNoticeRequest,
} from "@/types/notice";

export interface NoticeService {
  getAll(params: NoticeQueryParams): Promise<ApiResponse<PagedResult<Notice>>>;
  getById(id: string): Promise<ApiResponse<Notice>>;
  create(payload: CreateNoticeRequest): Promise<ApiResponse<Notice>>;
  update(
    id: string,
    payload: UpdateNoticeRequest,
  ): Promise<ApiResponse<Notice>>;
  remove(id: string): Promise<ApiResponse<boolean>>;
  publish(id: string): Promise<ApiResponse<Notice>>;
  unpublish(id: string): Promise<ApiResponse<Notice>>;
}
