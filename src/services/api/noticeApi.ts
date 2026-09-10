import type { NoticeService } from "@/services/interfaces/NoticeService";
import type { Notice, CreateNoticeRequest, UpdateNoticeRequest, NoticeQueryParams } from "@/types/notice";
import type { PaginatedResponse, ApiResponse } from "@/types/common";
import { apiClient } from "./apiClient";

export const restNoticeService: NoticeService = {
  async getAll(params?: NoticeQueryParams): Promise<PaginatedResponse<Notice>> {
    const res = await apiClient.get("/notices", { params });
    return res.data;
  },
  async getById(id: string): Promise<ApiResponse<Notice>> {
    const res = await apiClient.get(`/notices/${id}`);
    return res.data;
  },
  async create(data: CreateNoticeRequest): Promise<ApiResponse<Notice>> {
    const res = await apiClient.post("/notices", data);
    return res.data;
  },
  async update(id: string, data: UpdateNoticeRequest): Promise<ApiResponse<Notice>> {
    const res = await apiClient.put(`/notices/${id}`, data);
    return res.data;
  },
  async delete(id: string): Promise<ApiResponse<null>> {
    const res = await apiClient.delete(`/notices/${id}`);
    return res.data;
  },
  async publish(id: string): Promise<ApiResponse<Notice>> {
    const res = await apiClient.patch(`/notices/${id}/publish`);
    return res.data;
  },
  async unpublish(id: string): Promise<ApiResponse<Notice>> {
    const res = await apiClient.patch(`/notices/${id}/unpublish`);
    return res.data;
  },
};
