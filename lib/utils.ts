import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function usernameToEmail(username: string) {
  return `${username.trim().toLowerCase()}@devildon.local`;
}

export function cleanUsername(username: string) {
  return username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
}

export function planDays(plan: string) {
  if (plan === "7 Days Plan") return 7;
  if (plan === "30 Days Plan") return 30;
  return 3650;
}

export function formatDate(value?: Date | null) {
  if (!value) return "Not active";
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(value);
}

export function isFuture(date?: Date | null) {
  return Boolean(date && date.getTime() > Date.now());
}
