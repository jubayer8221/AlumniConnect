import type { AuthService } from "@/services/interfaces/AuthService";
import type { AlumniService } from "@/services/interfaces/AlumniService";
import type { EventService } from "@/services/interfaces/EventService";
import type { NoticeService } from "@/services/interfaces/NoticeService";
import { mockAuthService } from "@/services/mock/mockAuthService";
import { mockAlumniService } from "@/services/mock/mockAlumniService";
import { mockEventService } from "@/services/mock/mockEventService";
import { mockNoticeService } from "@/services/mock/mockNoticeService";
import { restAuthService } from "@/services/api/authApi";
import { restAlumniService } from "@/services/api/alumniApi";
import { restEventService } from "@/services/api/eventApi";
import { restNoticeService } from "@/services/api/noticeApi";

const useMock = import.meta.env.VITE_DATA_SOURCE !== "api";

export const authService: AuthService = useMock ? mockAuthService : restAuthService;
export const alumniService: AlumniService = useMock ? mockAlumniService : restAlumniService;
export const eventService: EventService = useMock ? mockEventService : restEventService;
export const noticeService: NoticeService = useMock ? mockNoticeService : restNoticeService;
