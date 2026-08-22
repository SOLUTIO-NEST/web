import { axiosInstance } from '../lib/axios';
import type {
    ApiResponse,
    ApplicantCreateRequestDto,
    ApplicantPassResponseDto,
    ApplicantResponseDto,
    BlacklistAddRequestDto,
    BlacklistDetailResponseDto,
    BlacklistResponseDto,
    BlacklistUpdateReasonRequestDto,
    LoginRequestDto,
    PageResponse,
    RecruitmentCreateRequestDto,
    RecruitmentResponseDto,
    RecruitmentUpdateRequestDto,
    TokenResponse,
} from './types';

export const authService = {
    login: async (data: LoginRequestDto): Promise<TokenResponse> => {
        const response = await axiosInstance.post<ApiResponse<TokenResponse>>('/login', data);
        const tokens = response.data.data;
        if (!tokens) {
            throw new Error('Authentication failed: Missing tokens');
        }

        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);

        return tokens;
    },
    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }
};

export const recruitmentService = {
    create: async (data: RecruitmentCreateRequestDto): Promise<number> => {
        const response = await axiosInstance.post<ApiResponse<number>>('/recruitments', data);
        return response.data.data;
    },
    getAll: async (page: number = 0, size: number = 50): Promise<RecruitmentResponseDto[]> => {
        const response = await axiosInstance.get<ApiResponse<PageResponse<RecruitmentResponseDto> | RecruitmentResponseDto[] | RecruitmentResponseDto>>('/recruitments', {
            params: { page, size }
        });
        const data = response.data.data;

        if (!data) {
            return [];
        }

        if (Array.isArray(data)) {
            return data;
        }

        // Check for PageResponse.contents or PageResponse.content
        const rawData = data as unknown as Record<string, unknown>;
        if (Array.isArray(rawData.contents)) {
            return rawData.contents as RecruitmentResponseDto[];
        }
        if (Array.isArray(rawData.content)) {
            return rawData.content as RecruitmentResponseDto[];
        }

        // If it's a single recruitment object
        return [data as RecruitmentResponseDto];
    },
    getPage: async (page: number = 0, size: number = 10): Promise<PageResponse<RecruitmentResponseDto>> => {
        const response = await axiosInstance.get<ApiResponse<PageResponse<RecruitmentResponseDto>>>('/recruitments', {
            params: { page, size }
        });
        const data = response.data.data;
        const rawData = data as unknown as Record<string, unknown>;
        const items = (Array.isArray(rawData?.contents)
            ? rawData.contents
            : Array.isArray(rawData?.content)
            ? rawData.content
            : []) as RecruitmentResponseDto[];
        return {
            contents: items,
            content: items,
            page: (rawData?.page as number) ?? page + 1,
            size: (rawData?.size as number) ?? size,
            totalElements: (rawData?.totalElements as number) ?? items.length,
            totalPages: (rawData?.totalPages as number) ?? 1,
            hasNext: (rawData?.hasNext as boolean) ?? false,
            hasPrevious: (rawData?.hasPrevious as boolean) ?? false,
            pageNumber: rawData?.page ? (rawData.page as number) - 1 : page,
            pageSize: (rawData?.size as number) ?? size,
            last: rawData?.hasNext === false,
        };
    },
    getById: async (id: number): Promise<RecruitmentResponseDto> => {
        const response = await axiosInstance.get<ApiResponse<RecruitmentResponseDto>>(`/recruitments/${id}`);
        return response.data.data;
    },
    update: async (id: number, data: RecruitmentUpdateRequestDto): Promise<number> => {
        const response = await axiosInstance.patch<ApiResponse<number>>(`/recruitments/${id}`, data);
        return response.data.data;
    },
    delete: async (id: number): Promise<number> => {
        const response = await axiosInstance.delete<ApiResponse<number>>(`/recruitments/${id}`);
        return response.data.data;
    },
    purgeApplicantData: async (recruitmentId: number): Promise<number> => {
        const response = await axiosInstance.post<ApiResponse<number>>(`/applicants/purge/${recruitmentId}`);
        return response.data.data;
    }
};

export const applicantService = {
    apply: async (data: ApplicantCreateRequestDto): Promise<string> => {
        const response = await axiosInstance.post<ApiResponse<string>>('/applicants', data);
        return response.data.data;
    },
    getMyStatus: async (): Promise<ApplicantPassResponseDto> => {
        const response = await axiosInstance.get<ApiResponse<ApplicantPassResponseDto>>('/applicants/my');
        return response.data.data;
    },
    getList: async (recruitmentId: number, page: number = 0, size: number = 10): Promise<PageResponse<ApplicantResponseDto>> => {
        const response = await axiosInstance.get<ApiResponse<PageResponse<ApplicantResponseDto> | ApplicantResponseDto[]>>(`/applicants/${recruitmentId}`, {
            params: { page, size }
        });
        const data = response.data.data;

        if (!data) {
            return {
                contents: [],
                content: [],
                page: 1,
                size,
                totalElements: 0,
                totalPages: 1,
                hasNext: false,
                hasPrevious: false,
                pageNumber: 0,
                pageSize: size,
                last: true
            };
        }

        if (Array.isArray(data)) {
            return {
                contents: data,
                content: data,
                page: 1,
                size: data.length,
                totalElements: data.length,
                totalPages: 1,
                hasNext: false,
                hasPrevious: false,
                pageNumber: 0,
                pageSize: data.length,
                last: true
            };
        }

        const rawData = data as unknown as Record<string, unknown>;
        const items = (Array.isArray(rawData.contents)
            ? rawData.contents
            : Array.isArray(rawData.content)
            ? rawData.content
            : []) as ApplicantResponseDto[];
        return {
            contents: items,
            content: items,
            page: (rawData.page as number) ?? 1,
            size: (rawData.size as number) ?? size,
            totalElements: (rawData.totalElements as number) ?? items.length,
            totalPages: (rawData.totalPages as number) ?? 1,
            hasNext: (rawData.hasNext as boolean) ?? false,
            hasPrevious: (rawData.hasPrevious as boolean) ?? false,
            pageNumber: rawData.page ? (rawData.page as number) - 1 : 0,
            pageSize: (rawData.size as number) ?? size,
            last: rawData.hasNext === false
        };
    },
    getDetail: async (studentId: string): Promise<ApplicantResponseDto> => {
        const response = await axiosInstance.get<ApiResponse<ApplicantResponseDto>>(`/applicants/detail/${studentId}`);
        return response.data.data;
    },
    updateClassLevel: async (studentId: string, classLevel: string | null): Promise<string> => {
        const response = await axiosInstance.patch<ApiResponse<string>>(`/applicants/level/${studentId}`, { classLevel });
        return response.data.data;
    },
    approve: async (studentId: string): Promise<string> => {
        const response = await axiosInstance.patch<ApiResponse<string>>(`/applicants/approve/${studentId}`);
        return response.data.data;
    },
    reject: async (studentId: string): Promise<string> => {
        const response = await axiosInstance.patch<ApiResponse<string>>(`/applicants/reject/${studentId}`);
        return response.data.data;
    },
    batchCreateMember: async (recruitmentId: number): Promise<string[]> => {
        const response = await axiosInstance.post<ApiResponse<string[]>>(`/applicants/batch/${recruitmentId}`);
        return response.data.data;
    },
    individualCreateMember: async (studentId: string): Promise<string> => {
        const response = await axiosInstance.post<ApiResponse<string>>(`/applicants/${studentId}`);
        return response.data.data;
    },
    purgeData: async (recruitmentId: number): Promise<number> => {
        const response = await axiosInstance.post<ApiResponse<number>>(`/applicants/purge/${recruitmentId}`);
        return response.data.data;
    }
};

export const blacklistService = {
    add: async (data: BlacklistAddRequestDto): Promise<number> => {
        const response = await axiosInstance.post<ApiResponse<number>>('/blacklists', data);
        return response.data.data;
    },
    updateReason: async (id: number, data: BlacklistUpdateReasonRequestDto): Promise<number> => {
        const response = await axiosInstance.patch<ApiResponse<number>>(`/blacklists/${id}`, data);
        return response.data.data;
    },
    delete: async (id: number): Promise<number> => {
        const response = await axiosInstance.delete<ApiResponse<number>>(`/blacklists/${id}`);
        return response.data.data;
    },
    getDetail: async (id: number): Promise<BlacklistDetailResponseDto> => {
        const response = await axiosInstance.get<ApiResponse<BlacklistDetailResponseDto>>(`/blacklists/${id}`);
        return response.data.data;
    },
    getList: async (page: number = 0, size: number = 10): Promise<PageResponse<BlacklistResponseDto>> => {
        const response = await axiosInstance.get<ApiResponse<PageResponse<BlacklistResponseDto> | BlacklistResponseDto[]>>('/blacklists', {
            params: { page, size }
        });
        const data = response.data.data;

        if (!data) {
            return {
                contents: [],
                content: [],
                page: 1,
                size,
                totalElements: 0,
                totalPages: 1,
                hasNext: false,
                hasPrevious: false,
                pageNumber: 0,
                pageSize: size,
                last: true
            };
        }

        if (Array.isArray(data)) {
            return {
                contents: data,
                content: data,
                page: 1,
                size: data.length,
                totalElements: data.length,
                totalPages: 1,
                hasNext: false,
                hasPrevious: false,
                pageNumber: 0,
                pageSize: data.length,
                last: true
            };
        }

        const rawData = data as unknown as Record<string, unknown>;
        const items = (Array.isArray(rawData.contents)
            ? rawData.contents
            : Array.isArray(rawData.content)
            ? rawData.content
            : []) as BlacklistResponseDto[];
        return {
            contents: items,
            content: items,
            page: (rawData.page as number) ?? 1,
            size: (rawData.size as number) ?? size,
            totalElements: (rawData.totalElements as number) ?? items.length,
            totalPages: (rawData.totalPages as number) ?? 1,
            hasNext: (rawData.hasNext as boolean) ?? false,
            hasPrevious: (rawData.hasPrevious as boolean) ?? false,
            pageNumber: rawData.page ? (rawData.page as number) - 1 : 0,
            pageSize: (rawData.size as number) ?? size,
            last: rawData.hasNext === false
        };
    }
};

// Exporting a unified api object for backward compatibility if needed,
// strictly we should move to individual services.
// But for now, let's keep the module structure clean.
