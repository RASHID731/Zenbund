import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api';

/**
 * User data returned from backend after authentication
 */
export interface User {
  userId: number;
  email: string;
  name: string;
  university: string;
  major: string;
}

/**
 * Authentication response from backend (login/register)
 */
interface AuthResponse {
  token: string;
  type: string;
  userId: number;
  email: string;
  name: string;
  university: string;
  major: string;
}

/**
 * Login request payload
 */
interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Registration request payload
 */
interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  university: string;
  major: string;
  year?: string;
}

/**
 * Auth Context value - available to all components via useAuth()
 */
interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterRequest) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// Create context with undefined default value
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Auth Provider Component
 * Wrap your app with this to provide authentication state everywhere
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Check if user is authenticated on app load.
   * Looks for JWT token in SecureStore.
   */
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Check if user has a valid JWT token.
   * Called on app startup and after login/logout.
   */
  const checkAuth = async () => {
    try {
      setIsLoading(true);

      // Check if token exists in SecureStore
      const token = await apiClient.getToken();

      if (token) {
        // Token exists! Fetch user details from backend
        // You can create a /api/auth/me endpoint to get current user
        // For now, we'll just consider them authenticated
        // In Phase 2, add: const response = await apiClient.get<User>('/auth/me');

        // For now, just mark as authenticated (token exists)
        // Real user data will be set during login/register
        setIsLoading(false);
      } else {
        // No token - user not authenticated
        setUser(null);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsLoading(false);
    }
  };

  /**
   * Login with email and password.
   *
   * Flow:
   * 1. Call backend /api/auth/login
   * 2. Save JWT token to SecureStore
   * 3. Set user state
   * 4. Return success
   */
  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', {
        email,
        password,
      });

      if (response.success && response.data) {
        // Save JWT token to SecureStore
        await apiClient.setToken(response.data.token);

        // Set user state (now all components know user is logged in)
        setUser({
          userId: response.data.userId,
          email: response.data.email,
          name: response.data.name,
          university: response.data.university,
          major: response.data.major,
        });

        return { success: true };
      } else {
        return {
          success: false,
          message: response.message || 'Login failed',
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid email or password',
      };
    }
  };

  /**
   * Register a new account.
   *
   * Flow:
   * 1. Call backend /api/auth/register
   * 2. Save JWT token to SecureStore
   * 3. Set user state
   * 4. Return success
   */
  const register = async (data: RegisterRequest) => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);

      if (response.success && response.data) {
        // Save JWT token
        await apiClient.setToken(response.data.token);

        // Set user state
        setUser({
          userId: response.data.userId,
          email: response.data.email,
          name: response.data.name,
          university: response.data.university,
          major: response.data.major,
        });

        return { success: true };
      } else {
        return {
          success: false,
          message: response.message || 'Registration failed',
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  /**
   * Logout current user.
   *
   * Flow:
   * 1. Clear JWT token from SecureStore
   * 2. Clear user state
   */
  const logout = async () => {
    try {
      // Clear JWT token
      await apiClient.clearToken();

      // Clear user state
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to use auth context.
 *
 * Usage in any component:
 * const { user, isAuthenticated, login, logout } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
