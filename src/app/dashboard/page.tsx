"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardIndexPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login?redirect=/dashboard");
      return;
    }
    router.replace(user.role === "admin" ? "/dashboard/admin/overview" : "/dashboard/overview");
  }, [loading, user, router]);

  return null;
}
