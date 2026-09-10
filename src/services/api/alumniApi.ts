import type { AlumniService } from "@/services/interfaces/AlumniService";
import type { Alumni, CreateAlumniRequest, UpdateAlumniRequest, AlumniQueryParams } from "@/types/alumni";
import type { PaginatedResponse, ApiResponse } from "@/types/common";
import type { DashboardData } from "@/types/dashboard";
import { apiClient } from "./apiClient";

export const restAlumniService: AlumniService = {
  async getAll(params?: AlumniQueryParams): Promise<PaginatedResponse<Alumni>> {
    const res = await apiClient.get("/alumni", { params });
    return res.data;
  },
  async getById(id: string): Promise<ApiResponse<Alumni>> {
    const res = await apiClient.get(`/alumni/${id}`);
    return res.data;
  },
  async getByAlumniId(alumniId: string): Promise<ApiResponse<Alumni>> {
    const res = await apiClient.get(`/alumni/${alumniId}`);
    return res.data;
  },
  async create(data: CreateAlumniRequest): Promise<ApiResponse<Alumni>> {
    const res = await apiClient.post("/alumni", data);
    return res.data;
  },
  async update(id: string, data: UpdateAlumniRequest): Promise<ApiResponse<Alumni>> {
    const res = await apiClient.put(`/alumni/${id}`, data);
    return res.data;
  },
  async delete(id: string): Promise<ApiResponse<null>> {
    const res = await apiClient.delete(`/alumni/${id}`);
    return res.data;
  },
  async verify(id: string): Promise<ApiResponse<Alumni>> {
    const res = await apiClient.patch(`/alumni/${id}/verify`);
    return res.data;
  },
  async updateStatus(id: string, status: Alumni["status"]): Promise<ApiResponse<Alumni>> {
    const res = await apiClient.patch(`/alumni/${id}/status`, { status });
    return res.data;
  },
  async updatePrivacy(id: string, privacy: Alumni["privacy"]): Promise<ApiResponse<Alumni>> {
    const res = await apiClient.patch(`/alumni/${id}/privacy`, privacy);
    return res.data;
  },
  async getDashboardData(): Promise<ApiResponse<DashboardData>> {
    const res = await apiClient.get("/dashboard/summary");
    return res.data;
  },
};
