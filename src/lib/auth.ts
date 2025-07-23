import axios from "axios";

import { apiRequest } from "./queryClient";

export interface User {
  id: number;
  email: string;
  username: string;
  role: string;
}

export interface LoginResponse {
  sessionId: string;
  user: User;
}

class AuthService {
  private sessionId: string | null = null;

  constructor() {
    // Try to load session from localStorage
    this.sessionId = localStorage.getItem("sessionId");
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await axios.post("http://31.97.41.27:5000/api/auth/login", {
      email,
      password,
    });
    const data: LoginResponse = res.data;

    this.sessionId = data.sessionId;
    localStorage.setItem("sessionId", data.sessionId);

    return data;
  }

  async logout(): Promise<void> {
    if (this.sessionId) {
      try {
        await axios.post(
          "http://31.97.41.27:5000/api/auth/logout",
          {},
          {
            headers: { "X-Session-Id": this.sessionId },
          }
        );
      } catch (error) {
        // ignore
      }
    }

    this.sessionId = null;
    localStorage.removeItem("sessionId");
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.sessionId) {
      return null;
    }

    try {
      const res = await axios.get("http://31.97.41.27:5000/api/auth/me", {
        headers: { "X-Session-Id": this.sessionId },
      });

      return res.data;
    } catch {
      this.logout();
      return null;
    }
  }

  getSessionId(): string | null {
    return this.sessionId;
  }

  isAuthenticated(): boolean {
    return this.sessionId !== null;
  }
}

export const authService = new AuthService();

// Enhanced API request function that includes session ID
export async function authenticatedApiRequest(
  method: string,
  url: string,
  data?: unknown | undefined
): Promise<Response> {
  const sessionId = authService.getSessionId();

  const headers: Record<string, string> = {
    ...(data ? { "Content-Type": "application/json" } : {}),
    ...(sessionId ? { "X-Session-Id": sessionId } : {}),
  };

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  if (!res.ok) {
    if (res.status === 401) {
      // Session expired, logout user
      authService.logout();
      window.location.href = "/login";
    }
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }

  return res;
}
