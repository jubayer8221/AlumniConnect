const PREFIX = "alumniconnect_";

export const localStorageService = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (raw === null) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {}
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch {
      // ignore
    }
  },

  clear(): void {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(PREFIX))
        .forEach((k) => localStorage.removeItem(k));
    } catch {
      // ignore
    }
  },

  async clearSiteData(): Promise<void> {
    this.clear();

    try {
      Object.keys(sessionStorage)
        .filter((k) => k.startsWith(PREFIX))
        .forEach((k) => sessionStorage.removeItem(k));
    } catch {
      // Ignore unavailable session storage.
    }

    if (typeof caches !== "undefined") {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames
            .filter((name) => name.startsWith(PREFIX))
            .map((name) => caches.delete(name)),
        );
      } catch {
        // Ignore unavailable Cache Storage.
      }
    }
  },

  has(key: string): boolean {
    try {
      return localStorage.getItem(PREFIX + key) !== null;
    } catch {
      return false;
    }
  },
};
