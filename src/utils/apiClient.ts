/**
 * Auth-ready API Client
 * Centralized API wrapper with authentication support and error handling
 */

import { logger } from './logger';

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Auth token storage (can be replaced with more secure storage)
let authToken: string | null = null;

/**
 * Set the authentication token
 * Call this after successful login
 */
export function setAuthToken(token: string | null): void {
    authToken = token;
    if (token) {
        logger.log('🔐 Auth token set');
    } else {
        logger.log('🔓 Auth token cleared');
    }
}

/**
 * Get current auth token
 */
export function getAuthToken(): string | null {
    return authToken;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    return !!authToken;
}

interface RequestOptions extends RequestInit {
    skipAuth?: boolean;
    retries?: number;
    retryDelay?: number;
}

interface ApiError extends Error {
    status?: number;
    statusText?: string;
    data?: any;
}

/**
 * Make an authenticated API request
 */
export async function apiRequest<T = any>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const {
        skipAuth = false,
        retries = 3,
        retryDelay = 1000,
        headers = {},
        ...fetchOptions
    } = options;

    // Build headers
    const requestHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        // CORS headers
        'X-Requested-With': 'XMLHttpRequest',
        ...(headers as Record<string, string>),
    };

    // Add auth token if available and not skipped
    if (!skipAuth && authToken) {
        (requestHeaders as Record<string, string>)['Authorization'] = `Bearer ${authToken}`;
    }

    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

    let lastError: ApiError | null = null;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, {
                ...fetchOptions,
                headers: requestHeaders,
            });

            // Handle auth errors
            if (response.status === 401) {
                const error: ApiError = new Error('Authentication required');
                error.status = 401;
                error.statusText = 'Unauthorized';

                // Clear token on 401
                setAuthToken(null);

                // Could trigger auth flow here
                // Example: window.dispatchEvent(new CustomEvent('auth:required'));

                throw error;
            }

            if (response.status === 403) {
                const error: ApiError = new Error('Access forbidden');
                error.status = 403;
                error.statusText = 'Forbidden';
                throw error;
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const error: ApiError = new Error(errorData.message || `HTTP ${response.status}`);
                error.status = response.status;
                error.statusText = response.statusText;
                error.data = errorData;
                throw error;
            }

            // Parse response
            const contentType = response.headers.get('content-type');
            if (contentType?.includes('application/json')) {
                return await response.json();
            }

            return await response.text() as unknown as T;

        } catch (error) {
            lastError = error as ApiError;

            // Don't retry auth errors
            if (lastError.status === 401 || lastError.status === 403) {
                throw lastError;
            }

            // Retry on network errors or 5xx
            const shouldRetry =
                !lastError.status ||
                lastError.status >= 500;

            if (shouldRetry && attempt < retries) {
                logger.warn(`API request failed, retrying (${attempt}/${retries})...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
                continue;
            }

            throw lastError;
        }
    }

    throw lastError || new Error('Request failed');
}

/**
 * Convenience methods
 */
export const api = {
    get: <T = any>(endpoint: string, options?: RequestOptions) =>
        apiRequest<T>(endpoint, { ...options, method: 'GET' }),

    post: <T = any>(endpoint: string, data?: any, options?: RequestOptions) =>
        apiRequest<T>(endpoint, {
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        }),

    put: <T = any>(endpoint: string, data?: any, options?: RequestOptions) =>
        apiRequest<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        }),

    delete: <T = any>(endpoint: string, options?: RequestOptions) =>
        apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),

    patch: <T = any>(endpoint: string, data?: any, options?: RequestOptions) =>
        apiRequest<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        }),
};

export default api;
