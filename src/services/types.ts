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
export interface RecruitmentCreateRequestDto {
    title: string;
    startDateTime: string; // ISO 8601
    endDateTime: string;   // ISO 8601
}

export interface RecruitmentUpdateRequestDto extends RecruitmentCreateRequestDto { }

export interface RecruitmentResponseDto {
    id: number;
    title: string;
    startDateTime: string;
    endDateTime: string;
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

export interface ApplicantPassResponseDto {
    name: string;
    classLevel: string | null;
    groupAccountLink: string | null;
    groupAccountNumber: string | null;
    recruitmentId: number;
    passedMessage: string | null;
    isPassed: boolean | null;
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
    isApprove: boolean | null;
    classLevel?: string | null;
    createdAt: string;

    // Legacy/UI aliases (to be deprecated or mapped)
    phone?: string;
    baekjoonId?: string;
    language?: string;
    motivation?: string;
}

export interface PageResponse<T> {
    content: T[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}
