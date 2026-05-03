"use client";

import { apiCreateItem, apiDeleteItem, apiGetItemById, apiListItems, apiListMyItems } from "@/lib/api-client";
import type { Item } from "@/types/item";
import { useEffect, useState } from "react";

const CHANGE_EVENT = "jikmunn-odyssey:user-items:change";

function isBrowser() {
  return typeof window !== "undefined";
}

function notifyItemsChanged() {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(cb: () => void) {
  if (!isBrowser()) return () => {};
  window.addEventListener(CHANGE_EVENT, cb);
  return () => window.removeEventListener(CHANGE_EVENT, cb);
}

export async function getUserItems(): Promise<Item[]> {
  return apiListMyItems();
}

export async function getAllItems(): Promise<Item[]> {
  return apiListItems();
}

export async function findItemById(id: string): Promise<Item | undefined> {
  try {
    return await apiGetItemById(id);
  } catch {
    return undefined;
  }
}

export type NewItemInput = Omit<Item, "id" | "createdAt" | "ownerId">;

export async function addUserItem(input: NewItemInput): Promise<Item> {
  const item = await apiCreateItem({
    title: input.title,
    shortDescription: input.shortDescription,
    fullDescription: input.fullDescription,
    price: input.price,
    category: input.category,
    rating: input.rating,
    imageUrl: input.imageUrl,
  });
  notifyItemsChanged();
  return item;
}

export async function deleteUserItem(id: string): Promise<boolean> {
  try {
    await apiDeleteItem(id);
    notifyItemsChanged();
    return true;
  } catch {
    return false;
  }
}

export async function isUserItem(id: string): Promise<boolean> {
  const items = await apiListMyItems();
  return items.some((item) => item.id === id);
}

export function useUserItems(): Item[] {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const next = await apiListMyItems();
        if (active) setItems(next);
      } catch {
        if (active) setItems([]);
      }
    };

    void load();
    const unsubscribe = subscribe(() => {
      void load();
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return items;
}

/**
 * Returns the union of static items and locally-added user items.
 * Both server and first-client snapshots return `staticItems` so hydration
 * matches; user items merge in after the first store change.
 */
export function useAllItems(): Item[] {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const next = await apiListItems();
        if (active) setItems(next);
      } catch {
        if (active) setItems([]);
      }
    };

    void load();
    const unsubscribe = subscribe(() => {
      void load();
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return items;
}
