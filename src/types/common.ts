export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string>;
}

export interface PaginationState {
  pageNumber: number;
  pageSize: number;
}

export interface SortState {
  sortBy: string;
  sortDirection: "asc" | "desc";
}

export interface QueryParams {
  pageNumber: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

export type Status = "ACTIVE" | "INACTIVE" | "PENDING";

export type ViewMode = "table" | "grid";
