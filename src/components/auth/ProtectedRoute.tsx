"use client";

import { Spinner } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  /** Path to redirect unauthenticated users to. Defaults to /login. */
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { user, loading, firebaseEnabled } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      const target = `${redirectTo}?redirect=${encodeURIComponent(
        typeof window !== "undefined" ? window.location.pathname : "/",
      )}`;
      router.replace(target);
    }
  }, [loading, user, router, redirectTo]);

  if (loading || !user) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <Spinner size="lg" />
          <p className="text-sm text-foreground/70">
            {loading
              ? "Checking your session…"
              : firebaseEnabled
                ? "Redirecting to login…"
                : "Authentication is not configured."}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
