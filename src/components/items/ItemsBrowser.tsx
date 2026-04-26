"use client";

import { Badge, Button, Input } from "@/components/ui";
import { ALL_CATEGORIES, CATEGORY_LABELS } from "@/lib/items-utils";
import type { Item, ItemCategory } from "@/types/item";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ItemCard } from "./ItemCard";

type Sort = "featured" | "price-asc" | "price-desc" | "rating-desc";

const SORTS: { value: Sort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "rating-desc", label: "Top rated" },
];

export function ItemsBrowser({ items }: { items: Item[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ItemCategory | "all">("all");
  const [maxPrice, setMaxPrice] = useState<number>(() =>
    items.reduce((max, i) => Math.max(max, i.price), 200),
  );
  const [sort, setSort] = useState<Sort>("featured");

  const priceCeiling = useMemo(
    () => items.reduce((max, i) => Math.max(max, i.price), 200),
    [items],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = items.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (item.price > maxPrice) return false;
      if (
        q &&
        !item.title.toLowerCase().includes(q) &&
        !item.shortDescription.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });

    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating-desc":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return list;
  }, [items, query, category, maxPrice, sort]);

  const hasActiveFilters =
    query !== "" || category !== "all" || maxPrice < priceCeiling;

  function resetFilters() {
    setQuery("");
    setCategory("all");
    setMaxPrice(priceCeiling);
    setSort("featured");
  }

  return (
    <div>
      {/* Controls */}
      <div className="mb-8 rounded-[var(--radius-lg)] border border-border bg-background p-4 shadow-[var(--shadow-card)] sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
          <Input
            placeholder="Search products by name or description…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            aria-label="Search products"
          />

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="filter-category"
              className="text-xs font-medium text-foreground/70"
            >
              Category
            </label>
            <select
              id="filter-category"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as ItemCategory | "all")
              }
              className="h-11 min-w-[160px] rounded-[var(--radius-md)] border border-border bg-background px-3 text-sm text-foreground focus:border-brand-500 focus:outline-none"
            >
              <option value="all">All categories</option>
              {ALL_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="filter-sort"
              className="text-xs font-medium text-foreground/70"
            >
              Sort by
            </label>
            <select
              id="filter-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="h-11 min-w-[180px] rounded-[var(--radius-md)] border border-border bg-background px-3 text-sm text-foreground focus:border-brand-500 focus:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <label
              htmlFor="filter-price"
              className="mb-1.5 flex items-center justify-between text-xs font-medium text-foreground/70"
            >
              <span className="flex items-center gap-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Max price
              </span>
              <span className="text-foreground">${maxPrice}</span>
            </label>
            <input
              id="filter-price"
              type="range"
              min={0}
              max={priceCeiling}
              step={10}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-brand-600"
              aria-label="Max price"
            />
          </div>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <span className="text-xs text-foreground/60">
              {filtered.length} of {items.length} products
            </span>
            {hasActiveFilters && (
              <Button
                size="sm"
                variant="ghost"
                onClick={resetFilters}
                leftIcon={<X className="h-3.5 w-3.5" />}
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {query && (
              <Badge tone="brand">Search: &ldquo;{query}&rdquo;</Badge>
            )}
            {category !== "all" && (
              <Badge tone="brand">{CATEGORY_LABELS[category]}</Badge>
            )}
            {maxPrice < priceCeiling && (
              <Badge tone="brand">≤ ${maxPrice}</Badge>
            )}
          </div>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-border bg-surface p-12 text-center">
          <p className="text-base font-medium text-foreground">
            No products match your filters.
          </p>
          <p className="mt-1 text-sm text-foreground/60">
            Try adjusting your search or clearing filters.
          </p>
          <div className="mt-5">
            <Button onClick={resetFilters}>Reset filters</Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
