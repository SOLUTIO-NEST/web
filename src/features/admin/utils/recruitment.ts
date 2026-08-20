import type { RecruitmentStatus } from "@/services/types";

export type RecruitmentStatusType = "UPCOMING" | "OPEN" | "CLOSED";

export interface RecruitmentStatusInfo {
  type: RecruitmentStatusType;
  label: string;
  badgeClass: string;
  dotClass: string;
}

/**
 * Returns recruitment status information considering both server-assigned status and current datetime range.
 */
export function getRecruitmentStatus(
  start: string,
  end: string,
  serverStatus?: RecruitmentStatus
): RecruitmentStatusInfo {
  // If server status is explicitly CLOSED
  if (serverStatus === "CLOSED") {
    return {
      type: "CLOSED",
      label: "모집 마감",
      badgeClass: "text-neutral-500 bg-neutral-100 border-neutral-200",
      dotClass: "bg-neutral-400",
    };
  }

  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);

  // If server status is explicitly OPEN
  if (serverStatus === "OPEN") {
    return {
      type: "OPEN",
      label: "모집 진행중",
      badgeClass: "text-purple-700 bg-purple-50 border-purple-300",
      dotClass: "bg-purple-600 animate-pulse",
    };
  }

  // If server status is explicitly UPCOMING
  if (serverStatus === "UPCOMING") {
    return {
      type: "UPCOMING",
      label: "모집 예정",
      badgeClass: "text-amber-700 bg-amber-50 border-amber-300",
      dotClass: "bg-amber-500",
    };
  }

  // Fallback to time-based calculation
  if (now < startDate) {
    return {
      type: "UPCOMING",
      label: "모집 예정",
      badgeClass: "text-amber-700 bg-amber-50 border-amber-300",
      dotClass: "bg-amber-500",
    };
  }
  if (now <= endDate) {
    return {
      type: "OPEN",
      label: "모집 진행중",
      badgeClass: "text-purple-700 bg-purple-50 border-purple-300",
      dotClass: "bg-purple-600 animate-pulse",
    };
  }
  return {
    type: "CLOSED",
    label: "모집 마감",
    badgeClass: "text-neutral-500 bg-neutral-100 border-neutral-200",
    dotClass: "bg-neutral-400",
  };
}

/**
 * Checks whether a recruitment is currently accepting applications.
 */
export function isRecruitmentOpen(item: {
  startDateTime: string;
  endDateTime: string;
  status?: RecruitmentStatus;
}): boolean {
  if (item.status === "CLOSED") return false;
  if (item.status === "OPEN") return true;

  const now = new Date();
  const start = new Date(item.startDateTime);
  const end = new Date(item.endDateTime);
  return now >= start && now <= end;
}

/**
 * Checks whether applicant data is eligible for purge (6 weeks after announcement date).
 */
export function isPurgeEligible(
  announcementDateTime?: string | null,
  isPurged?: boolean
): boolean {
  if (isPurged) return false;
  if (!announcementDateTime) return false;

  const announceDate = new Date(announcementDateTime);
  if (isNaN(announceDate.getTime())) return false;

  const sixWeeksAfter = new Date(announceDate.getTime() + 6 * 7 * 24 * 60 * 60 * 1000);
  return new Date() >= sixWeeksAfter;
}

/**
 * Format ISO or Date string for human-readable display (e.g. 2026.03.01 14:00).
 */
export function formatDateTimeDisplay(dateString?: string | null): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

/**
 * Convert ISO / Date string to YYYY-MM-DDTHH:mm format for datetime-local input.
 */
export function formatToDatetimeLocal(dateInput?: string | Date | null): string {
  if (!dateInput) return "";
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return "";

  const pad = (n: number) => String(n).padStart(2, "0");
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Convert datetime-local input value (YYYY-MM-DDTHH:mm) to API-compatible LocalDateTime string (YYYY-MM-DDTHH:mm:ss).
 */
export function formatToApiDateTime(localValue: string): string {
  if (!localValue) return "";
  if (localValue.length === 16) {
    return `${localValue}:00`;
  }
  return localValue;
}

/**
 * Calculates human-readable duration between start and end date.
 */
export function calculateDuration(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return "";

  const diffMs = endDate.getTime() - startDate.getTime();
  if (diffMs <= 0) return "당일";

  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  const remainHours = diffHours % 24;

  if (diffDays === 0) {
    return `${diffHours}시간`;
  }
  if (remainHours === 0) {
    return `${diffDays}일간`;
  }
  return `${diffDays}일 ${remainHours}시간`;
}
