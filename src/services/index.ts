import axios from "axios";
import type { EventService } from "@/services/interfaces/EventService";
import type { NoticeService } from "@/services/interfaces/NoticeService";
import { mockEventService } from "@/services/mock/mockEventService";
import { mockNoticeService } from "@/services/mock/mockNoticeService";
// import { restEventService } from "@/services/api/eventApi";
import { restNoticeService } from "@/services/api/noticeApi";
import { restEventService } from "@/hooks/api/useEventApi";

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

export const eventService: EventService = useMock
  ? mockEventService
  : withFallback(restEventService, mockEventService);

export const noticeService: NoticeService = useMock
  ? mockNoticeService
  : withFallback(restNoticeService, mockNoticeService);
