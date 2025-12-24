// API client and utilities
import axios, { AxiosInstance, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080/api';

// Key for storing JWT token in SecureStore
const JWT_TOKEN_KEY = 'jwt_token';

export interface ApiResponse<T> {
  data: T | null;
  message?: string;
  success: boolean;
}

export class ApiClient {
  private axiosInstance: AxiosInstance;
  private authErrorListeners: Array<() => void> = [];

  constructor(baseURL: string = API_BASE_URL) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds
    });

    // Setup interceptors for JWT authentication
    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors for JWT authentication.
   * Request interceptor: Adds JWT token to Authorization header
   * Response interceptor: Handles 401 errors (token expired)
   */
  private setupInterceptors() {
    // Request interceptor - Add JWT token to every request
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        // Get JWT token from secure storage
        const token = await SecureStore.getItemAsync(JWT_TOKEN_KEY);

        if (token) {
          // Add Authorization header: "Bearer <token>"
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle token expiration
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        // If 401 Unauthorized, token is expired or invalid
        if (error.response?.status === 401) {
          // Clear the invalid/expired token
          await SecureStore.deleteItemAsync(JWT_TOKEN_KEY);

          // Emit event to AuthContext to clear user state and redirect to login
          this.emitAuthError();
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Set JWT token in secure storage.
   * Called after successful login/registration.
   */
  async setToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(JWT_TOKEN_KEY, token);
  }

  /**
   * Get JWT token from secure storage.
   */
  async getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(JWT_TOKEN_KEY);
  }

  /**
   * Clear JWT token from secure storage.
   * Called on logout.
   */
  async clearToken(): Promise<void> {
    await SecureStore.deleteItemAsync(JWT_TOKEN_KEY);
  }

  /**
   * Subscribe to authentication errors (token expired, invalid, etc.)
   * Returns an unsubscribe function.
   */
  public onAuthError(callback: () => void): () => void {
    this.authErrorListeners.push(callback);

    // Return unsubscribe function
    return () => {
      this.authErrorListeners = this.authErrorListeners.filter(
        listener => listener !== callback
      );
    };
  }

  /**
   * Emit authentication error to all listeners.
   * Called when 401 Unauthorized response is received.
   */
  private emitAuthError(): void {
    this.authErrorListeners.forEach(listener => listener());
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get<T>(endpoint);
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post<T>(endpoint, data);
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  async postFormData<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post<T>(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.put<T>(endpoint, data);
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  async delete<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete<T>(endpoint, {
        data: data, // Axios sends DELETE request body via config.data
      });
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      return this.handleError<T>(error);
    }
  }

  private handleError<T>(error: unknown): ApiResponse<T> {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return {
        data: null as T,
        message: axiosError.response?.data?.message || axiosError.message || 'An error occurred',
        success: false,
      };
    }
    return {
      data: null as T,
      message: 'An unexpected error occurred',
      success: false,
    };
  }
}

export const apiClient = new ApiClient();
