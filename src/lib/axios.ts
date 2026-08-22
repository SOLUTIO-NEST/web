import axios from 'axios';

const BASE_URL = '/api/v1';

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add access token to headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if error is 401 and request hasn't been retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await axios.post(`${BASE_URL}/login/reissue`, null, {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`,
                    },
                });

                const tokens = response.data?.data;
                if (tokens) {
                    localStorage.setItem('accessToken', tokens.accessToken);
                    localStorage.setItem('refreshToken', tokens.refreshToken);

                    originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;

                    return axiosInstance(originalRequest);
                }
            } catch (reissueError) {
                // If reissue fails, logout user
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                // Redirect to login page or handle logout
                // window.location.href = '/login'; // Optional: Use a more graceful way via a callback or event
                return Promise.reject(reissueError);
            }
        }
        return Promise.reject(error);
    }
);
