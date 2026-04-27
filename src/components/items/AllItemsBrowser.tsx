"use client";

import { useAllItems } from "@/lib/itemsStore";
import { ItemsBrowser } from "./ItemsBrowser";

export function AllItemsBrowser() {
  const items = useAllItems();
  return <ItemsBrowser items={items} />;
}
