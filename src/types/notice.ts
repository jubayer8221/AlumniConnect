export type NoticeCategory =
  | "Announcement"
  | "News"
  | "Event"
  | "Achievement"
  | "Career"
  | "General";

export type NoticeStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Notice {
  id: string;
  title: string;
  content: string;
  publishDate: string;
  category: NoticeCategory;
  image?: string;
  status: NoticeStatus;
  author?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoticeFilters {
  search?: string;
  category?: NoticeCategory;
  status?: NoticeStatus;
}

export interface CreateNoticeRequest {
  title: string;
  content: string;
  publishDate: string;
  category: NoticeCategory;
  image?: string;
  status: NoticeStatus;
}

export type UpdateNoticeRequest = Partial<CreateNoticeRequest> & { id: string };

export interface NoticeQueryParams {
  pageNumber: number;
  pageSize: number;
  search?: string;
  filters?: NoticeFilters;
}
