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

                // Call reissue endpoint
                const response = await axios.post(`${BASE_URL}/login/reissue`, null, {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`,
                    },
                });

                // Extract new tokens from X-Solutio-Auth header (or body if applicable based on docs)
                // Docs say: Response Header: X-Solutio-Auth: {"accessToken":"...", "refreshToken":"..."}
                const authHeader = response.headers['x-solutio-auth'];
                if (authHeader) {
                    const tokens = typeof authHeader === 'string' ? JSON.parse(authHeader) : authHeader;

                    localStorage.setItem('accessToken', tokens.accessToken);
                    localStorage.setItem('refreshToken', tokens.refreshToken);

                    // Update authorization header with new access token
                    originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;

                    // Retry original request
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
