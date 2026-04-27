import clsx from "clsx";
import type { HTMLAttributes } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Tailwind shape utility, e.g. "rounded-full" or "rounded-[var(--radius-md)]". */
  rounded?: string;
}

export function Skeleton({
  className,
  rounded = "rounded-[var(--radius-md)]",
  ...rest
}: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      aria-live="polite"
      className={clsx("skeleton", rounded, className)}
      {...rest}
    />
  );
}

export function ItemCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-background shadow-[var(--shadow-card)]">
      <Skeleton className="aspect-[4/3] w-full" rounded="" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-4 w-20" rounded="rounded-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-9 w-28" rounded="rounded-[var(--radius-md)]" />
        </div>
      </div>
    </div>
  );
}

export function ItemsGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ItemCardSkeleton key={i} />
      ))}
    </div>
  );
}
