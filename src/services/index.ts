import axios from "axios";
import { restNoticeService } from "@/services/api/noticeApi";
import { mockNoticeService } from "@/services/mock/mockNoticeService";
import type { NoticeService } from "@/services/interfaces/NoticeService";

const useMock = import.meta.env.VITE_DATA_SOURCE === "mock";

function shouldFallback(error: unknown): boolean {
  if (axios.isAxiosError(error)) {
    return !error.response || error.response.status >= 500;
  }
  return error instanceof Error && error.message.includes("not available from");
}

function withFallback<T extends object>(api: T, mock: T): T {
  return new Proxy(api, {
    get(target, property, receiver) {
      const apiMethod = Reflect.get(target, property, receiver);
      const mockMethod = Reflect.get(mock, property, mock);
      if (typeof apiMethod !== "function" || typeof mockMethod !== "function") {
        return apiMethod;
      }
      return async (...args: unknown[]) => {
        try {
          return await Reflect.apply(apiMethod, target, args);
        } catch (error) {
          if (!shouldFallback(error)) throw error;
          return Reflect.apply(mockMethod, mock, args);
        }
      };
    },
  });
}

export const noticeService: NoticeService = useMock
  ? mockNoticeService
  : withFallback(restNoticeService, mockNoticeService);
