import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '@/services/api';
import type { User, UserRole } from '@/services/types';
import { jwtDecode, type JwtPayload } from 'jwt-decode';

interface DecodedToken extends JwtPayload {
    auth?: string;
    role?: UserRole;
    name?: string;
}

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
                const decoded = jwtDecode<DecodedToken>(token);
                if (decoded.exp && decoded.exp * 1000 > Date.now()) {
                    const userData: User = {
                        sub: decoded.sub || '',
                        auth: decoded.auth || '',
                        exp: decoded.exp,
                        id: decoded.sub,
                        role: (decoded.role || decoded.auth) as UserRole,
                        name: decoded.name || decoded.sub || '사용자',
                    };
                    setUser(userData);
                } else {
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
            const decoded = jwtDecode<DecodedToken>(tokens.accessToken);
            const userData: User = {
                sub: decoded.sub || '',
                auth: decoded.auth || '',
                exp: decoded.exp || 0,
                id: decoded.sub,
                role: (decoded.role || decoded.auth) as UserRole,
                name: decoded.name || decoded.sub || '사용자',
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

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
