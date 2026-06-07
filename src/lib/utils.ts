import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}分钟前`;
    }
    return `${hours}小时前`;
  }
  if (days < 30) return `${days}天前`;
  return d.toLocaleDateString("zh-CN");
}

export function parsePhotos(photos: string): string[] {
  try {
    const parsed = JSON.parse(photos);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const speciesLabels: Record<string, string> = {
  DOG: "🐕 狗",
  CAT: "🐈 猫",
  OTHER: "🐾 其他",
};

export const sizeLabels: Record<string, string> = {
  SMALL: "小型",
  MEDIUM: "中型",
  LARGE: "大型",
};

export const statusLabels: Record<string, string> = {
  AVAILABLE: "可领养",
  PENDING: "领养中",
  ADOPTED: "已领养",
};

export const sourceLabels: Record<string, string> = {
  USER_POSTED: "用户发布",
  SCRAPED: "平台抓取",
};
