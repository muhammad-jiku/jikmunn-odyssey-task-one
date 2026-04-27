"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button, Container, Input, Section } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { ALL_CATEGORIES, CATEGORY_LABELS } from "@/lib/items-utils";
import { addUserItem } from "@/lib/itemsStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ImageIcon, PackagePlus, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const addItemSchema = z.object({
  title: z
    .string()
    .min(3, "At least 3 characters")
    .max(80, "Keep it under 80 characters"),
  shortDescription: z
    .string()
    .min(10, "At least 10 characters")
    .max(160, "Keep it under 160 characters"),
  fullDescription: z
    .string()
    .min(20, "At least 20 characters")
    .max(2000, "Keep it under 2000 characters"),
  price: z
    .number({ message: "Enter a valid number" })
    .min(0, "Price must be positive")
    .max(100000, "Too large"),
  category: z.enum([
    "electronics",
    "fashion",
    "home",
    "books",
    "sports",
    "beauty",
  ]),
  rating: z
    .number({ message: "Enter a valid number" })
    .min(0, "Min 0")
    .max(5, "Max 5"),
  imageUrl: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => !v || /^https?:\/\//i.test(v),
      "Must be a valid http(s) URL",
    ),
});

type AddItemValues = z.infer<typeof addItemSchema>;

function AddItemForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddItemValues>({
    resolver: zodResolver(addItemSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      fullDescription: "",
      price: 0,
      category: "electronics",
      rating: 4.5,
      imageUrl: "",
    },
  });

  async function onSubmit(values: AddItemValues) {
    setSubmitting(true);
    try {
      const created = addUserItem(
        {
          title: values.title.trim(),
          shortDescription: values.shortDescription.trim(),
          fullDescription: values.fullDescription.trim(),
          price: Number(values.price),
          category: values.category,
          rating: Number(values.rating),
          imageUrl: values.imageUrl?.trim() || undefined,
        },
        user?.uid,
      );
      toast.success(`“${created.title}” added`);
      router.push("/items/manage");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not save product";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  const busy = submitting || isSubmitting;

  return (
    <Section className="py-12 sm:py-14" bg="surface">
      <Container>
        <Link
          href="/items/manage"
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 transition-colors hover:text-brand-600"
        >
          <ArrowLeft className="h-4 w-4" /> Back to manage products
        </Link>

        <div className="mx-auto mt-6 max-w-3xl rounded-[var(--radius-lg)] border border-border bg-background p-8 shadow-[var(--shadow-card)] sm:p-10">
          <header className="mb-8 flex items-start gap-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--radius-md)] bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-200">
              <PackagePlus className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Add a new product
              </h1>
              <p className="mt-1 text-sm text-foreground/70">
                Saved locally to your browser. You&apos;ll see it on the Shop
                page right away.
              </p>
            </div>
          </header>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
          >
            <Input
              label="Title"
              placeholder="e.g. Walnut desk lamp"
              error={errors.title?.message}
              {...register("title")}
            />

            <Input
              label="Short description"
              placeholder="One-line summary shown on the product card"
              hint="Max 160 characters."
              error={errors.shortDescription?.message}
              {...register("shortDescription")}
            />

            <div>
              <label
                htmlFor="fullDescription"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Full description
              </label>
              <textarea
                id="fullDescription"
                rows={5}
                placeholder="Tell buyers what makes this product special…"
                className="w-full rounded-[var(--radius-md)] border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-brand-500 focus:outline-none"
                aria-invalid={!!errors.fullDescription}
                {...register("fullDescription")}
              />
              {errors.fullDescription && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {errors.fullDescription.message}
                </p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Price (USD)"
                type="number"
                step="0.01"
                min={0}
                placeholder="49.00"
                error={errors.price?.message}
                {...register("price", { valueAsNumber: true })}
              />

              <div>
                <label
                  htmlFor="category"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Category
                </label>
                <select
                  id="category"
                  className="h-11 w-full rounded-[var(--radius-md)] border border-border bg-background px-3 text-sm text-foreground focus:border-brand-500 focus:outline-none"
                  aria-invalid={!!errors.category}
                  {...register("category")}
                >
                  {ALL_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {CATEGORY_LABELS[c]}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <Input
                label="Rating (0–5)"
                type="number"
                step="0.1"
                min={0}
                max={5}
                placeholder="4.5"
                error={errors.rating?.message}
                {...register("rating", { valueAsNumber: true })}
              />

              <Input
                label="Image URL (optional)"
                type="url"
                placeholder="https://images.unsplash.com/…"
                leftIcon={<ImageIcon className="h-4 w-4" />}
                hint="Use an https:// URL. We support unsplash.com out of the box."
                error={errors.imageUrl?.message}
                {...register("imageUrl")}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
              <Button
                type="submit"
                size="lg"
                isLoading={busy}
                leftIcon={<Save className="h-4 w-4" />}
              >
                Save product
              </Button>
              <Link href="/items/manage">
                <Button type="button" size="lg" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </Container>
    </Section>
  );
}

export default function AddItemPage() {
  return (
    <ProtectedRoute>
      <AddItemForm />
    </ProtectedRoute>
  );
}
