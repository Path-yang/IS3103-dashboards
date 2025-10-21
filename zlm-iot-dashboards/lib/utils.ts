import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateISO: string): string {
  const date = new Date(dateISO);
  return new Intl.DateTimeFormat("en-SG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatShortDate(dateISO: string): string {
  const date = new Date(dateISO);
  return new Intl.DateTimeFormat("en-SG", {
    month: "short",
    day: "numeric",
  }).format(date);
}
