"use client";

import { ItemCard } from "@/components/items/ItemCard";
import { Badge, Button, Container, Section } from "@/components/ui";
import { CATEGORY_LABELS, formatDate, formatPrice } from "@/lib/items-utils";
import { useAllItems } from "@/lib/itemsStore";
import { ArrowLeft, CalendarDays, PackageOpen, Star, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

interface Props {
  id: string;
}

export function UserItemDetailsClient({ id }: Props) {
  const all = useAllItems();
  const item = useMemo(() => all.find((i) => i.id === id), [all, id]);
  const related = useMemo(
    () =>
      item
        ? all.filter((i) => i.id !== item.id && i.category === item.category).slice(0, 4)
        : [],
    [all, item],
  );

  if (!item) {
    return (
      <Section className="py-16 sm:py-20" bg="surface">
        <Container>
          <div className="mx-auto max-w-md rounded-[var(--radius-lg)] border border-dashed border-border bg-background p-10 text-center shadow-[var(--shadow-card)]">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-200">
              <PackageOpen className="h-6 w-6" />
            </div>
            <h1 className="mt-4 text-xl font-semibold text-foreground">
              Product not found
            </h1>
            <p className="mt-1.5 text-sm text-foreground/70">
              The product you&apos;re looking for doesn&apos;t exist or was
              removed.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/items">
                <Button leftIcon={<ArrowLeft className="h-4 w-4" />}>
                  Back to all products
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <>
      <Section className="pt-10 sm:pt-12">
        <Container>
          <Link
            href="/items"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 transition-colors hover:text-brand-600"
          >
            <ArrowLeft className="h-4 w-4" /> Back to all products
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface-muted shadow-[var(--shadow-card)]">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="grid h-full place-items-center text-foreground/50">
                  No image
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="brand">{CATEGORY_LABELS[item.category]}</Badge>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-600">
                  <Star className="h-4 w-4 fill-current" />
                  {item.rating.toFixed(1)} rating
                </span>
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {item.title}
              </h1>
              <p className="mt-3 text-base text-foreground/70">
                {item.shortDescription}
              </p>

              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-3xl font-semibold text-foreground">
                  {formatPrice(item.price)}
                </span>
                <span className="text-sm text-foreground/60">incl. taxes</span>
              </div>

              <div className="mt-8 rounded-[var(--radius-lg)] border border-border bg-background p-5">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
                  About this product
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                  {item.fullDescription}
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[var(--radius-md)] border border-border bg-surface p-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-foreground/60">
                    <Tag className="h-3.5 w-3.5" /> Category
                  </div>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {CATEGORY_LABELS[item.category]}
                  </p>
                </div>
                <div className="rounded-[var(--radius-md)] border border-border bg-surface p-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-foreground/60">
                    <Star className="h-3.5 w-3.5" /> Rating
                  </div>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {item.rating.toFixed(1)} / 5
                  </p>
                </div>
                <div className="rounded-[var(--radius-md)] border border-border bg-surface p-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-foreground/60">
                    <CalendarDays className="h-3.5 w-3.5" /> Added
                  </div>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {formatDate(item.createdAt)}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg">Add to cart</Button>
                <Link href="/items">
                  <Button size="lg" variant="outline">
                    Continue shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section
          bg="surface"
          eyebrow="You may also like"
          title="Related products"
          description={`More from ${CATEGORY_LABELS[item.category]}.`}
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <ItemCard key={r.id} item={r} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
