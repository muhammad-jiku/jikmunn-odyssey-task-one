"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Badge, Button, Container, Section } from "@/components/ui";
import { CATEGORY_LABELS, formatDate, formatPrice } from "@/lib/items-utils";
import { deleteUserItem, useUserItems } from "@/lib/itemsStore";
import { Eye, PackageOpen, PackagePlus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

function ManageItemsView() {
  const items = useUserItems();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function handleDelete(id: string, title: string) {
    if (
      typeof window !== "undefined" &&
      !window.confirm(`Delete “${title}”? This can't be undone.`)
    ) {
      return;
    }
    setPendingId(id);
    try {
      const ok = await deleteUserItem(id);
      if (ok) toast.success("Product deleted");
      else toast.error("Could not find that product");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <Section className="py-12 sm:py-14" bg="surface">
      <Container>
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-600">
              Dashboard
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Manage products
            </h1>
            <p className="mt-2 text-sm text-foreground/70">
              {items.length === 0
                ? "You haven't added any products yet."
                : `You have ${items.length} product${
                    items.length === 1 ? "" : "s"
                  } in your account.`}
            </p>
          </div>
          <Link href="/items/add">
            <Button leftIcon={<PackagePlus className="h-4 w-4" />}>
              Add product
            </Button>
          </Link>
        </header>

        {items.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-border bg-background p-12 text-center shadow-[var(--shadow-card)]">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-200">
              <PackageOpen className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-foreground">
              No products yet
            </h2>
            <p className="mx-auto mt-1.5 max-w-md text-sm text-foreground/70">
              Add your first product to see it appear on the Shop page
              alongside the curated catalog.
            </p>
            <div className="mt-6">
              <Link href="/items/add">
                <Button leftIcon={<PackagePlus className="h-4 w-4" />}>
                  Add your first product
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-background shadow-[var(--shadow-card)]">
            {/* Desktop table */}
            <div className="hidden md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-surface text-xs uppercase tracking-wider text-foreground/60">
                  <tr>
                    <th className="px-5 py-3 font-medium">Product</th>
                    <th className="px-5 py-3 font-medium">Category</th>
                    <th className="px-5 py-3 font-medium">Price</th>
                    <th className="px-5 py-3 font-medium">Added</th>
                    <th className="px-5 py-3 font-medium text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-surface-muted/50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface-muted">
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl}
                                alt={item.title}
                                fill
                                sizes="48px"
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="grid h-full place-items-center text-foreground/40">
                                <PackageOpen className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-foreground">
                              {item.title}
                            </p>
                            <p className="truncate text-xs text-foreground/60">
                              {item.shortDescription}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Badge tone="brand">
                          {CATEGORY_LABELS[item.category]}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 font-medium text-foreground">
                        {formatPrice(item.price)}
                      </td>
                      <td className="px-5 py-4 text-foreground/70">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/items/${item.id}` as const}>
                            <Button
                              size="sm"
                              variant="outline"
                              leftIcon={<Eye className="h-3.5 w-3.5" />}
                            >
                              View
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="danger"
                            isLoading={pendingId === item.id}
                            onClick={() => handleDelete(item.id, item.title)}
                            leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile stacked cards */}
            <ul className="divide-y divide-border md:hidden">
              {items.map((item) => (
                <li key={item.id} className="p-4">
                  <div className="flex gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface-muted">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          sizes="64px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="grid h-full place-items-center text-foreground/40">
                          <PackageOpen className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">
                        {item.title}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-foreground/60">
                        {item.shortDescription}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                        <Badge tone="brand">
                          {CATEGORY_LABELS[item.category]}
                        </Badge>
                        <span className="font-medium text-foreground">
                          {formatPrice(item.price)}
                        </span>
                        <span className="text-foreground/60">
                          · {formatDate(item.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link href={`/items/${item.id}` as const} className="flex-1">
                      <Button
                        fullWidth
                        size="sm"
                        variant="outline"
                        leftIcon={<Eye className="h-3.5 w-3.5" />}
                      >
                        View
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="danger"
                      className="flex-1"
                      isLoading={pendingId === item.id}
                      onClick={() => handleDelete(item.id, item.title)}
                      leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </Section>
  );
}

export default function ManageItemsPage() {
  return (
    <ProtectedRoute>
      <ManageItemsView />
    </ProtectedRoute>
  );
}
