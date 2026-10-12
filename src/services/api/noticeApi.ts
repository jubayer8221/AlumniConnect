import api from "@/services/api/apiClient";
import type { NoticeService } from "@/services/interfaces/NoticeService";
import type { ApiResponse, PagedResult } from "@/types/api";
import type {
  CreateNoticeRequest,
  Notice,
  NoticeQueryParams,
  UpdateNoticeRequest,
} from "@/types/notice";

export const restNoticeService: NoticeService = {
  async getAll(params: NoticeQueryParams) {
    const res = await api.get<PagedResult<Notice>>("/Notice/GetAllNotices", {
      params: {
        search: params.search,
        category: params.filters?.category,
        status: params.filters?.status,
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
      },
    });
    return { success: true, message: "OK", data: res.data };
  },

  async getById(id) {
    const res = await api.get<Notice>(`/Notice/GetNoticeByID/${id}`);
    return { success: true, message: "OK", data: res.data };
  },

  async create(payload: CreateNoticeRequest) {
    const res = await api.post<{
      success: boolean;
      id: string;
      message: string;
    }>("/Notice/CreateUpdateNotice", payload);
    // backend returns { id } — return the id so the caller can refetch
    return {
      success: res.data.success,
      message: res.data.message,
      data: { ...payload, id: res.data.id } as Notice,
    };
  },

  async update(id, payload: UpdateNoticeRequest) {
    const res = await api.post<{
      success: boolean;
      id: string;
      message: string;
    }>(`/Notice/CreateUpdateNotice?id=${encodeURIComponent(id)}`, payload);
    return {
      success: res.data.success,
      message: res.data.message,
      data: { ...payload, id } as Notice,
    };
  },

  async remove(id) {
    const res = await api.post<{ success: boolean; message: string }>(
      "/Notice/DeleteNotice",
      { id },
    );
    return { success: res.data.success, message: res.data.message, data: true };
  },

  async publish(id) {
    const res = await api.post<{ success: boolean; message: string }>(
      "/Notice/SetNoticeStatus",
      { id, status: "PUBLISHED" },
    );
    return {
      success: res.data.success,
      message: res.data.message,
      data: true as unknown as Notice,
    };
  },

  async unpublish(id) {
    const res = await api.post<{ success: boolean; message: string }>(
      "/Notice/SetNoticeStatus",
      { id, status: "DRAFT" },
    );
    return {
      success: res.data.success,
      message: res.data.message,
      data: true as unknown as Notice,
    };
  },
};
