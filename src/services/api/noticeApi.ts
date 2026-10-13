import api from "@/services/api/apiClient";
import type { NoticeService } from "@/services/interfaces/NoticeService";
import type { ApiResponse, PagedResult } from "@/types/api";
import type {
  CreateNoticeRequest,
  Notice,
  NoticeQueryParams,
  UpdateNoticeRequest,
} from "@/types/notice";

function unwrap<T>(payload: unknown): T {
  if (payload && typeof payload === "object") {
    const response = payload as { success?: boolean; message?: string; data?: unknown };
    if (response.success === false) {
      throw new Error(response.message || "The notice request failed");
    }
    if ("data" in response && response.data !== undefined) {
      return response.data as T;
    }
  }
  return payload as T;
}

function normalizeNotice(input: unknown): Notice {
  const notice = input as Record<string, unknown>;
  const status = String(notice.status ?? notice.Status ?? "DRAFT").toUpperCase();
  return {
    id: String(notice.id ?? notice.noticeID ?? notice.noticeId ?? notice.NoticeID ?? ""),
    title: String(notice.title ?? notice.Title ?? ""),
    content: String(notice.content ?? notice.Content ?? ""),
    publishDate: String(notice.publishDate ?? notice.PublishDate ?? notice.publishedAt ?? notice.PublishedAt ?? ""),
    category: String(notice.category ?? notice.Category ?? "General") as Notice["category"],
    image: String(notice.image ?? notice.Image ?? "") || undefined,
    status: (status === "PUBLISHED" || status === "ARCHIVED" ? status : "DRAFT") as Notice["status"],
    author: String(notice.author ?? notice.Author ?? "") || undefined,
    createdAt: String(notice.createdAt ?? notice.CreatedAt ?? ""),
    updatedAt: String(notice.updatedAt ?? notice.UpdatedAt ?? ""),
  };
}

function normalizePagedNotices(payload: unknown): PagedResult<Notice> {
  const page = unwrap<Record<string, unknown>>(payload);
  const items = (page.items ?? page.Items ?? page.data ?? page.Data ?? []) as unknown[];
  return {
    items: items.map(normalizeNotice),
    pageNumber: Number(page.pageNumber ?? page.PageNumber ?? 1),
    pageSize: Number(page.pageSize ?? page.PageSize ?? items.length),
    totalRecords: Number(page.totalRecords ?? page.TotalRecords ?? page.totalCount ?? items.length),
    totalPages: Number(page.totalPages ?? page.TotalPages ?? 1),
  };
}

export const restNoticeService: NoticeService = {
  async getAll(params: NoticeQueryParams) {
    const res = await api.get<unknown>("/Notice/GetAllNotices", {
      params: {
        search: params.search,
        category: params.filters?.category,
        status: params.filters?.status,
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
      },
    });
    return { success: true, message: "OK", data: normalizePagedNotices(res.data) };
  },

  async getById(id) {
    const res = await api.get<unknown>(`/Notice/GetNoticeByID/${id}`);
    return { success: true, message: "OK", data: normalizeNotice(unwrap(res.data)) };
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
