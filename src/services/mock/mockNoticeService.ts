import type { NoticeService } from "@/services/interfaces/NoticeService";
import type { Notice, CreateNoticeRequest, UpdateNoticeRequest, NoticeQueryParams, NoticeFilters } from "@/types/notice";
import type { PaginatedResponse, ApiResponse } from "@/types/common";
import { localStorageService } from "@/services/storage/localStorageService";
import { STORAGE_KEYS } from "@/services/storage/storageKeys";
import { seedNotices } from "@/data/seedData";
import { generateNoticeId, generateUUID } from "@/utils/generateId";

function delay(ms = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function ensureNotices(): Notice[] {
  let notices = localStorageService.get<Notice[]>(STORAGE_KEYS.NOTICES, []);
  if (notices.length === 0) {
    notices = [...seedNotices];
    localStorageService.set(STORAGE_KEYS.NOTICES, notices);
  }
  return notices;
}

function saveNotices(notices: Notice[]): void {
  localStorageService.set(STORAGE_KEYS.NOTICES, notices);
}

function matchesNoticeFilters(notice: Notice, filters?: NoticeFilters, search?: string): boolean {
  if (search) {
    const q = search.toLowerCase();
    if (!notice.title.toLowerCase().includes(q) && !notice.content.toLowerCase().includes(q)) return false;
  }
  if (filters) {
    if (filters.category && notice.category !== filters.category) return false;
    if (filters.status && notice.status !== filters.status) return false;
  }
  return true;
}

export const mockNoticeService: NoticeService = {
  async getAll(params?: NoticeQueryParams): Promise<PaginatedResponse<Notice>> {
    await delay();
    const all = ensureNotices();
    const filtered = all.filter((n) => matchesNoticeFilters(n, params?.filters, params?.search));
    const page = params?.pageNumber || 1;
    const size = params?.pageSize || 10;
    const start = (page - 1) * size;
    const items = filtered.slice(start, start + size);
    return {
      success: true,
      message: "Notices retrieved successfully",
      data: { items, totalCount: filtered.length, pageNumber: page, pageSize: size },
    };
  },

  async getById(id: string): Promise<ApiResponse<Notice>> {
    await delay();
    const all = ensureNotices();
    const found = all.find((n) => n.id === id);
    if (!found) return { success: false, message: "Notice not found", data: null as unknown as Notice };
    return { success: true, message: "Notice retrieved", data: found };
  },

  async create(data: CreateNoticeRequest): Promise<ApiResponse<Notice>> {
    await delay();
    const all = ensureNotices();
    const now = new Date().toISOString();
    const newNotice: Notice = {
      id: generateUUID(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    all.push(newNotice);
    saveNotices(all);
    return { success: true, message: "Notice created successfully", data: newNotice };
  },

  async update(id: string, data: UpdateNoticeRequest): Promise<ApiResponse<Notice>> {
    await delay();
    const all = ensureNotices();
    const idx = all.findIndex((n) => n.id === id);
    if (idx === -1) return { success: false, message: "Notice not found", data: null as unknown as Notice };
    all[idx] = { ...all[idx], ...data, updatedAt: new Date().toISOString() } as Notice;
    saveNotices(all);
    return { success: true, message: "Notice updated successfully", data: all[idx] };
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    await delay();
    const all = ensureNotices();
    const filtered = all.filter((n) => n.id !== id);
    if (filtered.length === all.length) return { success: false, message: "Notice not found", data: null };
    saveNotices(filtered);
    return { success: true, message: "Notice deleted successfully", data: null };
  },

  async publish(id: string): Promise<ApiResponse<Notice>> {
    await delay();
    const all = ensureNotices();
    const idx = all.findIndex((n) => n.id === id);
    if (idx === -1) return { success: false, message: "Notice not found", data: null as unknown as Notice };
    all[idx].status = "PUBLISHED";
    all[idx].updatedAt = new Date().toISOString();
    saveNotices(all);
    return { success: true, message: "Notice published", data: all[idx] };
  },

  async unpublish(id: string): Promise<ApiResponse<Notice>> {
    await delay();
    const all = ensureNotices();
    const idx = all.findIndex((n) => n.id === id);
    if (idx === -1) return { success: false, message: "Notice not found", data: null as unknown as Notice };
    all[idx].status = "DRAFT";
    all[idx].updatedAt = new Date().toISOString();
    saveNotices(all);
    return { success: true, message: "Notice unpublished", data: all[idx] };
  },
};
