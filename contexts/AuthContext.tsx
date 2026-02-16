import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUser, User } from '../services/api';

export interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
    children: ReactNode;
}

/**
 * AuthProvider manages authentication state and provides auth methods
 *
 * @example
 * ```typescript
 * // In App.tsx
 * <AuthProvider>
 *   <NavigationContainer>
 *     <App />
 *   </NavigationContainer>
 * </AuthProvider>
 *
 * // In a component
 * const { isAuthenticated, user, login, logout } = useAuth();
 * ```
 */
export const AuthProvider = React.memo<AuthProviderProps>(({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = useCallback(async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            const loggedIn = await AsyncStorage.getItem('haaze_logged_in');

            if (token && loggedIn === 'true') {
                // Fetch user data
                const userData = await getUser();
                setUser(userData);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('[AuthContext] Error checking auth:', error);
            // On error, logout
            await logout();
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = useCallback(async (token: string) => {
        try {
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('haaze_logged_in', 'true');
            await checkAuth();
        } catch (error) {
            console.error('[AuthContext] Error during login:', error);
            throw error;
        }
    }, [checkAuth]);

    const logout = useCallback(async () => {
        try {
            await AsyncStorage.multiRemove(['token', 'haaze_logged_in']);
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('[AuthContext] Error during logout:', error);
            // Force logout even if AsyncStorage fails
            setUser(null);
            setIsAuthenticated(false);
        }
    }, []);

    const refreshUser = useCallback(async () => {
        try {
            const userData = await getUser();
            setUser(userData);
        } catch (error) {
            console.error('[AuthContext] Error refreshing user:', error);
        }
    }, []);

    const value = React.useMemo(
        () => ({
            isAuthenticated,
            user,
            loading,
            login,
            logout,
            refreshUser,
        }),
        [isAuthenticated, user, loading, login, logout, refreshUser]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
});

AuthProvider.displayName = 'AuthProvider';

/**
 * Hook to access authentication context
 * Must be used within AuthProvider
 *
 * @throws Error if used outside AuthProvider
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
