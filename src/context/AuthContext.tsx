"use client";

import
    {
        ApiClientError,
        apiDemoLogin,
        apiHydrateSession,
        apiLogin,
        apiLogout,
        apiRegister,
        subscribeAuth,
    } from "@/lib/api-client";
import type { AppUser } from "@/types/auth";
import
    {
        createContext,
        useCallback,
        useContext,
        useEffect,
        useMemo,
        useState,
        type ReactNode,
    } from "react";

export interface AuthUser extends AppUser {
  uid: string;
  displayName: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  firebaseEnabled: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    displayName?: string,
  ) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function mapUser(user: AppUser): AuthUser {
  return {
    ...user,
    uid: user.id,
    displayName: user.name || user.email?.split("@")[0] || null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [backendAvailable, setBackendAvailable] = useState(true);

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const me = await apiHydrateSession();
        if (active) setBackendAvailable(true);
        if (active) setUser(me ? mapUser(me) : null);
      } catch (error) {
        if (active && !(error instanceof ApiClientError)) {
          setBackendAvailable(false);
          setUser(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    const unsubscribe = subscribeAuth(() => {
      void (async () => {
        try {
          const me = await apiHydrateSession();
          if (active) {
            setBackendAvailable(true);
            setUser(me ? mapUser(me) : null);
          }
        } catch (error) {
          if (active && !(error instanceof ApiClientError)) {
            setBackendAvailable(false);
            setUser(null);
          }
        }
      })();
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const me = await apiLogin(email, password);
    setUser(mapUser(me));
  }, []);

  const register = useCallback(
    async (email: string, password: string, displayName?: string) => {
      const me = await apiRegister(displayName?.trim() || "User", email, password);
      setUser(mapUser(me));
    },
    [],
  );

  const loginWithGoogle = useCallback(async () => {
    const me = await apiDemoLogin("user");
    setUser(mapUser(me));
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      firebaseEnabled: backendAvailable,
      login,
      register,
      loginWithGoogle,
      logout,
    }),
    [user, loading, backendAvailable, login, register, loginWithGoogle, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

