import { format, parseISO, isValid } from "date-fns";

export function formatDate(date?: string | Date, formatStr = "MMM dd, yyyy"): string {
  if (!date) return "—";
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return "—";
  return format(d, formatStr);
}

export function formatDateTime(date?: string | Date): string {
  if (!date) return "—";
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return "—";
  return format(d, "MMM dd, yyyy 'at' h:mm a");
}

export function formatTime(time?: string): string {
  if (!time) return "—";
  return time;
}

export function toISODate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function fromNow(date?: string | Date): string {
  if (!date) return "—";
  const d = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(d)) return "—";
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 30) return format(d, "MMM dd, yyyy");
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return "Just now";
}

export function isUpcoming(date?: string | Date): boolean {
  if (!date) return false;
  const d = typeof date === "string" ? parseISO(date) : date;
  return d.getTime() > Date.now();
}
