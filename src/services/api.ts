import { axiosInstance } from '../lib/axios';
import type {
    ApiResponse,
    ApplicantCreateRequestDto,
    ApplicantPassResponseDto,
    ApplicantResponseDto,
    LoginRequestDto,
    PageResponse,
    RecruitmentCreateRequestDto,
    RecruitmentResponseDto,
    RecruitmentUpdateRequestDto,
    TokenResponse,
} from './types';

export const authService = {
    login: async (data: LoginRequestDto): Promise<TokenResponse> => {
        const response = await axiosInstance.post<ApiResponse<any>>('/login', data); // data might be null in body but tokens in header
        // Tokens are in X-Solutio-Auth header
        const authHeader = response.headers['x-solutio-auth'];
        if (!authHeader) {
            throw new Error('Authentication failed: Missing tokens');
        }
        const tokens = typeof authHeader === 'string' ? JSON.parse(authHeader) : authHeader;

        // Store tokens
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
    getAll: async (): Promise<RecruitmentResponseDto[]> => {
        // The doc says Response Data: RecruitmentResponseDto. 
        // It's likely a list if it's "Retrieve Recruitment" (plural usually, but doc implies potentially single or list? 
        // "Retrieve Recruitment" usually means list or by ID. Doc says URL /api/v1/recruitments Method GET.
        // Usually list. Let's assume list based on typical patterns, explicitly typed as single in docs?
        // Wait, "Response Data: RecruitmentResponseDto" suggests one? But URL is plural. 
        // Let's assume it returns a generic wrapper with data.
        // Actually, if it's a list, it should be List<RecruitmentResponseDto>. 
        // I will assume it returns the data structure as is.
        // Let's assume arrays for now if plural URL.
        const response = await axiosInstance.get<ApiResponse<RecruitmentResponseDto[]>>('/recruitments');
        return response.data.data;
    },
    update: async (id: number, data: RecruitmentUpdateRequestDto): Promise<number> => {
        const response = await axiosInstance.patch<ApiResponse<number>>(`/recruitments/${id}`, data);
        return response.data.data;
    },
    delete: async (id: number): Promise<number> => {
        const response = await axiosInstance.delete<ApiResponse<number>>(`/recruitments/${id}`);
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
        const response = await axiosInstance.get<ApiResponse<PageResponse<ApplicantResponseDto>>>(`/applicants/${recruitmentId}`, {
            params: { page, size }
        });
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
    }
};

// Exporting a unified api object for backward compatibility if needed,
// strictly we should move to individual services.
// But for now, let's keep the module structure clean.
