import { AuthResponse, User } from "@/core/types/auth";
import { AuthService } from "@/services/auth.service";
import { BehaviorSubject } from "rxjs";
import Cookies from "js-cookie";

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    tokenExpiresAt: number | null;
    refreshExpiresAt: number | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    tokenExpiresAt: null,
    refreshExpiresAt: null,
};

class AuthStore {
    private subject = new BehaviorSubject<AuthState>(initialState);
    readonly state$ = this.subject.asObservable();
    private refreshInterval: NodeJS.Timeout | null = null;

    constructor() {
        if (typeof window !== "undefined") {
            const token = Cookies.get("access_token");
            const tokenExpiresAt = Cookies.get("token_expires_at");
            const refreshExpiresAt = Cookies.get("refresh_expires_at");

            if (token) {
                this.setState({
                    isAuthenticated: true,
                    tokenExpiresAt: tokenExpiresAt ? parseInt(tokenExpiresAt) : null,
                    refreshExpiresAt: refreshExpiresAt ? parseInt(refreshExpiresAt) : null,
                });
                this.startAutoRefresh();
            }
        }
    }

    get snapshot(): AuthState {
        return this.subject.getValue();
    }

    private setState(partial: Partial<AuthState>) {
        this.subject.next({ ...this.snapshot, ...partial });
    }

    private startAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }

        this.refreshInterval = setInterval(() => {
            this.checkAndRefreshToken();
        }, 30000);
    }

    private stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    private async checkAndRefreshToken() {
        const { tokenExpiresAt, isAuthenticated } = this.snapshot;

        if (!isAuthenticated || !tokenExpiresAt) return;

        const now = Date.now();
        const timeUntilExpiry = tokenExpiresAt - now;

        if (timeUntilExpiry < 120000) {
            try {
                await this.refreshToken();
            } catch (error) {
                console.error('Auto refresh failed:', error);
            }
        }
    }

    async refreshToken(): Promise<AuthResponse | null> {
        const refreshToken = Cookies.get("refresh_token");
        if (!refreshToken) return null;

        try {
            const response = await AuthService.refresh(refreshToken);
            this.setTokenData(response);
            return response;
        } catch (error) {
            console.error('Refresh token error:', error);
            this.logout();
            throw error;
        }
    }

    private setTokenData(response: AuthResponse) {
        const now = Date.now();
        const tokenExpiresAt = now + (response.expires_in * 1000);
        const refreshExpiresAt = now + (response.refresh_expires_in * 1000);

        Cookies.set("token_expires_at", tokenExpiresAt.toString(), { expires: 7, sameSite: 'lax' });
        Cookies.set("refresh_expires_at", refreshExpiresAt.toString(), { expires: 7, sameSite: 'lax' });

        this.setState({
            tokenExpiresAt,
            refreshExpiresAt,
            isAuthenticated: true,
        });
    }

    getTimeRemaining(): { minutes: number; seconds: number } | null {
        const { tokenExpiresAt } = this.snapshot;
        if (!tokenExpiresAt) return null;

        const remaining = tokenExpiresAt - Date.now();
        if (remaining <= 0) return { minutes: 0, seconds: 0 };

        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        return { minutes, seconds };
    }

    async login(username: string, password: string) {
        this.setState({ loading: true, error: null });
        try {
            const response = await AuthService.login(username, password);
            const user: User = { username, roles: [] };

            this.setTokenData(response);
            this.setState({
                user,
                loading: false,
            });

            this.startAutoRefresh();
            return response;
        } catch (error: any) {
            this.setState({ loading: false, error: error.message || "Login failed" });
            throw error;
        }
    }

    async logout() {
        this.stopAutoRefresh();

        try {
            const refreshToken = Cookies.get("refresh_token");
            if (refreshToken) {
                await AuthService.logout(refreshToken);
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            Cookies.remove("access_token");
            Cookies.remove("refresh_token");
            Cookies.remove("token_expires_at");
            Cookies.remove("refresh_expires_at");
            this.setState(initialState);
        }
    }
}

export const authStore = new AuthStore();