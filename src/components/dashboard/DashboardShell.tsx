"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button, Container } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import clsx from "clsx";
import { BarChart3, Inbox, LayoutDashboard, Package, Settings, User, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

interface DashboardShellProps {
  children: ReactNode;
}

const userLinks = [
  { href: "/dashboard/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/my-items", label: "My Items", icon: Package },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings }
] as const;

const adminLinks = [
  { href: "/dashboard/admin/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
  { href: "/dashboard/admin/items", label: "Manage Items", icon: Package },
  { href: "/dashboard/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/dashboard/admin/contact", label: "Contact Inbox", icon: Inbox },
  { href: "/dashboard/admin/settings", label: "Settings", icon: Settings }
] as const;

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const links = isAdmin ? adminLinks : userLinks;

  const adminRouteBlocked = pathname.startsWith("/dashboard/admin") && !isAdmin;

  return (
    <ProtectedRoute>
      <section className="bg-surface py-8 sm:py-10">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <aside className="rounded-[var(--radius-lg)] border border-border bg-background p-4 shadow-[var(--shadow-card)]">
              <p className="px-2 pb-3 text-xs font-semibold uppercase tracking-widest text-brand-600">
                {isAdmin ? "Admin Dashboard" : "User Dashboard"}
              </p>
              <nav className="space-y-1">
                {links.map((link) => {
                  const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={clsx(
                        "flex items-center gap-2 rounded-[var(--radius-md)] px-3 py-2.5 text-sm transition-colors",
                        active
                          ? "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-100"
                          : "text-foreground/80 hover:bg-surface-muted"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </aside>
            <div>
              {adminRouteBlocked ? (
                <div className="rounded-[var(--radius-lg)] border border-border bg-background p-8 shadow-[var(--shadow-card)]">
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground">Admin Access Required</h1>
                  <p className="mt-2 text-sm text-foreground/70">
                    Your account does not have permission to access admin dashboard routes.
                  </p>
                  <div className="mt-4">
                    <Button onClick={() => router.replace("/dashboard/overview")}>Back to user dashboard</Button>
                  </div>
                </div>
              ) : (
                children
              )}
            </div>
          </div>
        </Container>
      </section>
    </ProtectedRoute>
  );
}
