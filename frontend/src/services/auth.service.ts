import { AuthResponse } from "@/core/types/auth";
import { api } from "./api";
import Cookies from "js-cookie";

export const AuthService = {
    login: async (username: string, password: string): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>("/api/v1/auth/login", { username, password });

        Cookies.set("access_token", response.access_token, { expires: 1, sameSite: 'lax' });
        Cookies.set("refresh_token", response.refresh_token, { expires: 7, sameSite: 'lax' });

        return response;
    },

    refresh: async (refreshToken: string): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>("/api/v1/auth/refresh", { refresh_token: refreshToken });

        Cookies.set("access_token", response.access_token, { expires: 1, sameSite: 'lax' });
        Cookies.set("refresh_token", response.refresh_token, { expires: 7, sameSite: 'lax' });

        return response;
    },

    logout: async (refreshToken: string): Promise<void> => {
        try {
            await api.post("/api/v1/auth/logout", { refresh_token: refreshToken });
        } finally {
            Cookies.remove("access_token");
            Cookies.remove("refresh_token");
        }
    },
};