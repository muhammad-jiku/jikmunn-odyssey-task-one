import { Badge, Button } from "@/components/ui";
import
  {
    CATEGORY_LABELS,
    formatPrice,
    shouldUnoptimizeImage,
  } from "@/lib/items-utils";
import type { Item } from "@/types/item";
import { ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23eef0f5'/><text x='50%25' y='50%25' fill='%2394a3b8' font-family='sans-serif' font-size='18' text-anchor='middle' dominant-baseline='middle'>No image</text></svg>";

export function ItemCard({ item }: { item: Item }) {
  const href = `/items/${item.id}` as const;
  const src = item.imageUrl || PLACEHOLDER_IMAGE;
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-background shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-[var(--shadow-elevated)] focus-within:-translate-y-0.5 focus-within:border-brand-300 focus-within:shadow-[var(--shadow-elevated)]">
      <Link
        href={href}
        className="relative block aspect-[4/3] overflow-hidden bg-surface-muted"
        aria-label={`View ${item.title}`}
      >
        <Image
          src={src}
          alt={item.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized={shouldUnoptimizeImage(src)}
        />
        <div className="absolute left-3 top-3">
          <Badge tone="brand">{CATEGORY_LABELS[item.category]}</Badge>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-base font-semibold text-foreground">
            <Link
              href={href}
              className="transition-colors hover:text-brand-600"
            >
              {item.title}
            </Link>
          </h3>
          <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-amber-600">
            <Star className="h-3.5 w-3.5 fill-current" />
            {item.rating.toFixed(1)}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-foreground/70">
          {item.shortDescription}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground">
            {formatPrice(item.price)}
          </span>
          <Link href={href}>
            <Button
              size="sm"
              variant="outline"
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
