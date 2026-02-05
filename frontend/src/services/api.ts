import Cookies from "js-cookie";
import { authStore } from "@/state/auth/auth.store";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Function to handle logout and redirect
function handleUnauthorized() {
    // Clear all auth cookies
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");

    // Reset auth store
    authStore.logout();

    // Redirect to login
    if (typeof window !== 'undefined') {
        window.location.href = '/login';
    }
}

export const api = {
    async get<T>(path: string, params?: Record<string, any>): Promise<T> {
        const url = new URL(`${BASE_URL}${path}`);
        if (params) {
            Object.keys(params).forEach(key => {
                const value = params[key];
                if (value !== undefined && value !== null) {
                    if (Array.isArray(value)) {
                        value.forEach(v => url.searchParams.append(key, v));
                    } else {
                        url.searchParams.append(key, value);
                    }
                }
            });
        }

        const response = await fetch(url.toString(), {
            headers: this.getHeaders(),
        });
        return this.handleResponse<T>(response);
    },

    async post<T>(path: string, body: any, isMultipart = false): Promise<T> {
        const headers = this.getHeaders();
        if (isMultipart) {
            delete headers["Content-Type"];
        }

        const response = await fetch(`${BASE_URL}${path}`, {
            method: "POST",
            headers,
            body: isMultipart ? body : JSON.stringify(body),
        });
        return this.handleResponse<T>(response);
    },

    async put<T>(path: string, body: any, isMultipart = false): Promise<T> {
        const headers = this.getHeaders();
        if (isMultipart) {
            delete headers["Content-Type"];
        }

        const response = await fetch(`${BASE_URL}${path}`, {
            method: "PUT",
            headers,
            body: isMultipart ? body : JSON.stringify(body),
        });
        return this.handleResponse<T>(response);
    },

    async delete(path: string): Promise<void> {
        const response = await fetch(`${BASE_URL}${path}`, {
            method: "DELETE",
            headers: this.getHeaders(),
        });

        // Check for 401 before throwing
        if (response.status === 401) {
            handleUnauthorized();
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    },

    getHeaders(): Record<string, string> {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };
        const token = Cookies.get("access_token");
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        return headers;
    },

    async handleResponse<T>(response: Response): Promise<T> {
        // Handle 401 Unauthorized
        if (response.status === 401) {
            handleUnauthorized();
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }
        if (response.status === 204) return {} as T;
        return response.json();
    },
};
