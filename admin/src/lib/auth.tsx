import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { apiRequest, getStoredToken, setStoredToken } from "@/lib/api";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  role: "user" | "admin" | "superadmin";
  status: "active" | "banned";
  createdAt?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getStoredToken()) {
      setLoading(false);
      return;
    }

    let active = true;

    apiRequest<AuthUser>("/api/auth/me")
      .then((response) => {
        if (active) setUser(response.data);
      })
      .catch(() => {
        if (active) {
          setStoredToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAdmin: user?.role === "admin" || user?.role === "superadmin",
      async login(email, password) {
        const response = await apiRequest<{ token: string; user: AuthUser }>("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        setStoredToken(response.data.token);
        setUser(response.data.user);
        return response.data.user;
      },
      async logout() {
        try {
          await apiRequest("/api/auth/logout", { method: "POST" });
        } finally {
          setStoredToken(null);
          setUser(null);
        }
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
