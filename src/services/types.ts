// Backend Role Enum (Stored in Token without ROLE_ prefix): GUEST, USER, STAFF, NEST, SUPER
export type UserRole = 'GUEST' | 'USER' | 'STAFF' | 'NEST' | 'SUPER' | 'ADMIN';

export interface User {
    sub: string; // usually ID
    auth: string; // roles
    exp: number;
    // Add other claims as needed
    id?: string; // Derived
    role?: UserRole; // Derived
    name?: string; // Optional, might be in token
}

// Common Response Wrapper
export interface ApiResponse<T> {
    success: boolean;
    status: number;
    message: string;
    data: T;
}

// Authentication
export interface LoginRequestDto {
    id: string;
    password: string;
}

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}

// Recruitment
export type RecruitmentStatus = 'UPCOMING' | 'OPEN' | 'CLOSED';

export const RecruitmentStatus = {
    UPCOMING: 'UPCOMING',
    OPEN: 'OPEN',
    CLOSED: 'CLOSED',
} as const;

export interface RecruitmentCreateRequestDto {
    title: string;
    startDateTime: string; // ISO 8601 / LocalDateTime (YYYY-MM-DDTHH:mm:ss)
    endDateTime: string;   // ISO 8601 / LocalDateTime (YYYY-MM-DDTHH:mm:ss)
    announcementDateTime?: string | null; // 최종 발표일
}

export interface RecruitmentUpdateRequestDto {
    title?: string;
    startDateTime?: string;
    endDateTime?: string;
    announcementDateTime?: string | null;
    status?: RecruitmentStatus;
    passedMessage?: string | null; // 합격 안내 메시지 (최대 1024자)
}

export interface RecruitmentResponseDto {
    id: number;
    title: string;
    startDateTime: string;
    endDateTime: string;
    announcementDateTime?: string | null;
    status: RecruitmentStatus;
    isApplicantDataPurged: boolean;
}

// Blacklist
export interface BlacklistAddRequestDto {
    studentId: string;
    reason: string;
}

export interface BlacklistUpdateReasonRequestDto {
    reason: string;
}

export interface BlacklistResponseDto {
    id: number;
    studentId: string;
    name: string;
    department: string;
    createdAt: string;
}

export interface BlacklistDetailResponseDto {
    id: number;
    studentId: string;
    name: string;
    email: string;
    department: string;
    phoneNumber: string;
    reason: string;
    createdAt: string;
}

// Applicants
export type MainLanguage = 'C' | 'CPP' | 'JAVA' | 'PYTHON' | 'JAVASCRIPT';

export const MainLanguage = {
    C: 'C',
    CPP: 'CPP',
    JAVA: 'JAVA',
    PYTHON: 'PYTHON',
    JAVASCRIPT: 'JAVASCRIPT',
} as const;

export interface ApplicantCreateRequestDto {
    studentId: string;
    recruitmentId: number;
    email: string;
    password: string;
    department: string;
    name: string;
    phoneNumber: string;
    bojId: string;
    mainLanguage: MainLanguage;
    applyReason: string;
}

export type PassStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ApplicantPassResponseDto {
    name: string;
    classLevel: string | null;
    groupAccountLink: string | null;
    groupAccountNumber: string | null;
    recruitmentId: number;
    passedMessage: string | null;
    passStatus: PassStatus;
}

export type ClassLevel = 'SEED' | 'BRANCH' | 'TREE';

export interface ApplicantResponseDto {
    studentId: string;
    name: string;
    department: string;
    phoneNumber: string;
    email?: string;
    bojId?: string; // Backend sends bojId
    mainLanguage?: MainLanguage;
    applyReason?: string; // Backend sends applyReason
    passStatus: PassStatus;
    classLevel?: string | null;
    createdAt: string;

    // Legacy/UI aliases (to be deprecated or mapped)
    phone?: string;
    baekjoonId?: string;
    language?: string;
    motivation?: string;
}

export interface PageResponse<T> {
    contents: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;

    // Backward compatibility aliases
    content?: T[];
    pageNumber?: number;
    pageSize?: number;
    last?: boolean;
}
