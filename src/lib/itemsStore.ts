"use client";

import { staticItems } from "@/data/items";
import type { Item } from "@/types/item";
import { useSyncExternalStore } from "react";

const STORAGE_KEY = "odyssey:user-items:v1";
const CHANGE_EVENT = "odyssey:user-items:change";

function isBrowser() {
  return typeof window !== "undefined";
}

function readUserItems(): Item[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Item[];
  } catch {
    return [];
  }
}

function writeUserItems(items: Item[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function getUserItems(): Item[] {
  return readUserItems();
}

export function getAllItems(): Item[] {
  return [...readUserItems(), ...staticItems];
}

export function findItemById(id: string): Item | undefined {
  return getAllItems().find((i) => i.id === id);
}

export type NewItemInput = Omit<Item, "id" | "createdAt"> & {
  id?: string;
  createdAt?: string;
};

export function addUserItem(input: NewItemInput, ownerId?: string): Item {
  const now = new Date().toISOString();
  const id =
    input.id ??
    (isBrowser() && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `user-${Date.now().toString(36)}`);
  const item: Item = {
    id,
    title: input.title,
    shortDescription: input.shortDescription,
    fullDescription: input.fullDescription,
    price: input.price,
    category: input.category,
    rating: input.rating,
    imageUrl: input.imageUrl || undefined,
    createdAt: input.createdAt ?? now,
    ownerId: ownerId ?? input.ownerId,
  };
  const next = [item, ...readUserItems()];
  writeUserItems(next);
  return item;
}

export function deleteUserItem(id: string): boolean {
  const current = readUserItems();
  const next = current.filter((i) => i.id !== id);
  if (next.length === current.length) return false;
  writeUserItems(next);
  return true;
}

export function isUserItem(id: string): boolean {
  return readUserItems().some((i) => i.id === id);
}

function subscribe(cb: () => void) {
  if (!isBrowser()) return () => {};
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) cb();
  };
  window.addEventListener(CHANGE_EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}

function getUserSnapshot(): Item[] {
  return readUserItems();
}

function getServerSnapshot(): Item[] {
  return [];
}

export function useUserItems(): Item[] {
  return useSyncExternalStore(subscribe, getUserSnapshot, getServerSnapshot);
}

/**
 * Returns the union of static items and locally-added user items.
 * Hydration-safe: returns staticItems on first render, then merges
 * after mount to avoid SSR/CSR mismatch.
 */
export function useAllItems(): Item[] {
  const userItems = useUserItems();
  // useSyncExternalStore already returns [] on the server snapshot, so this
  // is hydration-safe (server: just static; client first paint: just static;
  // then merges in user items in a layout effect).
  return [...userItems, ...staticItems];
}
