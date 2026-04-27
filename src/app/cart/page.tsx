"use client";

import { Button, Container, Section } from "@/components/ui";
import { useCart } from "@/context/CartContext";
import { formatPrice, shouldUnoptimizeImage } from "@/lib/items-utils";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CartPage() {
  const { lines, itemCount, subtotal, removeFromCart, updateQuantity, clearCart } =
    useCart();

  if (itemCount === 0) {
    return (
      <Section className="py-16 sm:py-20" bg="surface">
        <Container>
          <div className="mx-auto max-w-md rounded-[var(--radius-lg)] border border-dashed border-border bg-background p-10 text-center shadow-[var(--shadow-card)]">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-200">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <h1 className="mt-4 text-xl font-semibold text-foreground">
              Your cart is empty
            </h1>
            <p className="mt-1.5 text-sm text-foreground/70">
              Browse the catalog and add a few favorites to get started.
            </p>
            <div className="mt-6">
              <Link href="/items">
                <Button>Continue shopping</Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section className="py-12 sm:py-16">
      <Container>
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Your cart
            </h1>
            <p className="mt-1.5 text-sm text-foreground/70">
              {itemCount} item{itemCount === 1 ? "" : "s"} ready for checkout.
            </p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              clearCart();
              toast.success("Cart cleared");
            }}
            leftIcon={<Trash2 className="h-3.5 w-3.5" />}
          >
            Clear all
          </Button>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <ul className="flex flex-col gap-4">
            {lines.map((line) => (
              <li
                key={line.id}
                className="flex gap-4 rounded-[var(--radius-lg)] border border-border bg-background p-4 shadow-[var(--shadow-card)]"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-surface-muted">
                  {line.imageUrl ? (
                    <Image
                      src={line.imageUrl}
                      alt={line.title}
                      fill
                      sizes="96px"
                      className="object-cover"
                      unoptimized={shouldUnoptimizeImage(line.imageUrl)}
                    />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/items/${line.id}`}
                      className="line-clamp-2 text-sm font-semibold text-foreground hover:text-brand-600"
                    >
                      {line.title}
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        removeFromCart(line.id);
                        toast.success("Removed from cart");
                      }}
                      className="grid h-8 w-8 place-items-center rounded-[var(--radius-sm)] text-foreground/60 hover:bg-surface-muted hover:text-red-600"
                      aria-label={`Remove ${line.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-3">
                    <div className="inline-flex items-center rounded-[var(--radius-md)] border border-border">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(line.id, line.quantity - 1)
                        }
                        className="grid h-8 w-8 place-items-center text-foreground/70 hover:bg-surface-muted"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="grid h-8 w-10 place-items-center border-x border-border text-sm font-semibold">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(line.id, line.quantity + 1)
                        }
                        className="grid h-8 w-8 place-items-center text-foreground/70 hover:bg-surface-muted"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-base font-semibold text-foreground">
                      {formatPrice(line.price * line.quantity)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="self-start rounded-[var(--radius-lg)] border border-border bg-background p-6 shadow-[var(--shadow-card)]">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
              Order summary
            </h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-foreground/70">Subtotal</dt>
                <dd className="font-semibold text-foreground">
                  {formatPrice(subtotal)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-foreground/70">Shipping</dt>
                <dd className="font-semibold text-foreground">Free</dd>
              </div>
              <div className="mt-3 flex justify-between border-t border-border pt-3 text-base">
                <dt className="font-semibold text-foreground">Total</dt>
                <dd className="font-semibold text-foreground">
                  {formatPrice(subtotal)}
                </dd>
              </div>
            </dl>
            <Button
              fullWidth
              size="lg"
              className="mt-6"
              onClick={() =>
                toast.success("Demo checkout — payments not implemented yet.")
              }
            >
              Checkout
            </Button>
            <Link
              href="/items"
              className="mt-3 block text-center text-xs font-medium text-foreground/70 hover:text-brand-600"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
