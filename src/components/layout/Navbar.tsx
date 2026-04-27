"use client";

import { Button, Container } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";
import clsx from "clsx";
import
  {
    ChevronDown,
    LogIn,
    LogOut,
    Menu,
    Moon,
    PackagePlus,
    Settings2,
    ShoppingBag,
    ShoppingCart,
    Sun,
    UserPlus,
    X,
  } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { NAV_LINKS } from "./nav-links";

function getInitials(name?: string | null, email?: string | null) {
  const source = (name?.trim() || email?.split("@")[0] || "U").trim();
  const parts = source.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("") || "U";
}

export function Navbar() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const { resolved: themeResolved, toggle: toggleTheme } = useTheme();
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  const handleLogout = async () => {
    setMenuOpen(false);
    try {
      await logout();
      toast.success("Signed out");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to sign out.";
      toast.error(msg.replace("Firebase: ", ""));
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <Container className="flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <span className="grid h-8 w-8 place-items-center rounded-[var(--radius-md)] bg-brand-600 text-white">
            <ShoppingBag className="h-4 w-4" />
          </span>
          <span className="text-base sm:text-lg">Jikmunn&apos;s Odyssey</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-surface-muted text-foreground"
                    : "text-foreground/70 hover:bg-surface-muted hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth area (desktop) */}
        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              themeResolved === "dark"
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
            title={
              themeResolved === "dark"
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
            className="grid h-9 w-9 place-items-center rounded-[var(--radius-md)] text-foreground/70 transition-colors hover:bg-surface-muted hover:text-foreground"
          >
            {themeResolved === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
          <Link
            href="/cart"
            aria-label={`Cart (${itemCount} item${itemCount === 1 ? "" : "s"})`}
            className="relative grid h-9 w-9 place-items-center rounded-[var(--radius-md)] text-foreground/70 transition-colors hover:bg-surface-muted hover:text-foreground"
          >
            <ShoppingCart className="h-4 w-4" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-semibold leading-none text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
          {loading ? (
            <div className="h-9 w-24 animate-pulse rounded-[var(--radius-md)] bg-surface-muted" />
          ) : user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-[var(--radius-md)] px-2 py-1.5 transition-colors hover:bg-surface-muted"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-xs font-semibold text-white">
                  {getInitials(user.displayName, user.email)}
                </span>
                <span className="max-w-[140px] truncate text-sm font-medium">
                  {user.displayName || user.email?.split("@")[0]}
                </span>
                <ChevronDown
                  className={clsx(
                    "h-4 w-4 text-foreground/60 transition-transform",
                    menuOpen && "rotate-180",
                  )}
                />
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-64 overflow-hidden rounded-[var(--radius-lg)] border border-border bg-background shadow-[var(--shadow-elevated)]"
                >
                  <div className="border-b border-border px-4 py-3">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {user.displayName || "Account"}
                    </p>
                    <p className="truncate text-xs text-foreground/60">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href="/items/add"
                    role="menuitem"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-surface-muted"
                  >
                    <PackagePlus className="h-4 w-4" /> Add Product
                  </Link>
                  <Link
                    href="/items/manage"
                    role="menuitem"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-surface-muted"
                  >
                    <Settings2 className="h-4 w-4" /> Manage Products
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 border-t border-border px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" leftIcon={<LogIn className="h-4 w-4" />}>
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" leftIcon={<UserPlus className="h-4 w-4" />}>
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-1 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              themeResolved === "dark"
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
            className="grid h-10 w-10 place-items-center rounded-[var(--radius-md)] text-foreground/70 hover:bg-surface-muted hover:text-foreground"
          >
            {themeResolved === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
          <Link
            href="/cart"
            aria-label={`Cart (${itemCount} item${itemCount === 1 ? "" : "s"})`}
            className="relative grid h-10 w-10 place-items-center rounded-[var(--radius-md)] text-foreground/70 hover:bg-surface-muted hover:text-foreground"
          >
            <ShoppingCart className="h-4 w-4" />
            {itemCount > 0 && (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-semibold leading-none text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] text-foreground hover:bg-surface-muted"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </Container>

      {/* Mobile sheet */}
      {mobileOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium",
                    active
                      ? "bg-surface-muted text-foreground"
                      : "text-foreground/80 hover:bg-surface-muted",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="my-2 h-px bg-border" />
            {loading ? (
              <div className="h-10 w-full animate-pulse rounded-[var(--radius-md)] bg-surface-muted" />
            ) : user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-600 text-sm font-semibold text-white">
                    {getInitials(user.displayName, user.email)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {user.displayName || "Account"}
                    </p>
                    <p className="truncate text-xs text-foreground/60">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Link
                  href="/items/add"
                  className="flex items-center gap-2 rounded-[var(--radius-md)] px-3 py-2.5 text-sm hover:bg-surface-muted"
                >
                  <PackagePlus className="h-4 w-4" /> Add Product
                </Link>
                <Link
                  href="/items/manage"
                  className="flex items-center gap-2 rounded-[var(--radius-md)] px-3 py-2.5 text-sm hover:bg-surface-muted"
                >
                  <Settings2 className="h-4 w-4" /> Manage Products
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-[var(--radius-md)] px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link href="/login">
                  <Button variant="outline" fullWidth leftIcon={<LogIn className="h-4 w-4" />}>
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button fullWidth leftIcon={<UserPlus className="h-4 w-4" />}>
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </Container>
        </div>
      )}
    </header>
  );
}
