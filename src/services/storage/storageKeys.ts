export const STORAGE_KEYS = {
  AUTH_SESSION: "alumni_auth_session",
  CREDENTIALS: "alumni_credentials",
  ALUMNI: "alumni_data",
  EVENTS: "alumni_events",
  EVENT_REGISTRATIONS: "alumni_event_registrations",
  NOTICES: "alumni_notices",
  SETTINGS: "alumni_settings",
  SEEDED: "alumni_seeded",
} as const;

export type StorageKey = keyof typeof STORAGE_KEYS;
