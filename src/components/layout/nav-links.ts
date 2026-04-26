import type { Route } from "next";

export interface NavLink {
  label: string;
  href: Route;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/items" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
