import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '@/services/api';
import type { User } from '@/services/types';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing token on mount
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const decoded = jwtDecode<any>(token);
                // Check if expired? jwtDecode doesn't check exp automatically against current time, 
                // but usually interceptor handles valid expiry. 
                // We can check if exp is in past.
                if (decoded.exp * 1000 > Date.now()) {
                    const userData: User = {
                        ...decoded,
                        id: decoded.sub,
                        role: decoded.role || decoded.auth,
                        name: decoded.name || decoded.sub || '사용자',
                    };
                    setUser(userData);
                } else {
                    // Token expired, try reissue or logout?
                    // Interceptor handles reissue on request. 
                    // But here we are just setting initial state.
                    // If expired, maybe we should't set user, or try a dummy request?
                    // For now, if expired, we'll try to rely on interceptor logic if a request is made.
                    // Or let's just clear if obviously expired.
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                }
            } catch (error) {
                console.error("Invalid token found", error);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (id: string, password: string) => {
        setIsLoading(true);
        try {
            const tokens = await authService.login({ id, password });
            // Decode token to get user info
            const decoded = jwtDecode<any>(tokens.accessToken);
            const userData: User = {
                ...decoded,
                id: decoded.sub, // Map sub to id
                role: decoded.role || decoded.auth, // Map role (priority) or auth to role
                name: decoded.name || decoded.sub || '사용자', // Fallback to sub or default
                // If name is in token? If not, we might miss it. 
                // Assuming token has name or subject is name? 
                // Usually sub is ID. name might be 'name' claim.
            };
            setUser(userData);
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
