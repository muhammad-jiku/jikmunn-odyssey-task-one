import { Container, ItemsGridSkeleton, Section, Skeleton } from "@/components/ui";

export default function ItemsLoading() {
  return (
    <Section bg="default" className="py-12 sm:py-16">
      <Container>
        <header className="mb-8 max-w-2xl space-y-3">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-4 w-80" />
        </header>

        <div className="mb-8 rounded-[var(--radius-lg)] border border-border bg-background p-4 shadow-[var(--shadow-card)] sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full lg:w-40" />
            <Skeleton className="h-11 w-full lg:w-44" />
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-32 sm:justify-self-end" />
          </div>
        </div>

        <ItemsGridSkeleton count={8} />
      </Container>
    </Section>
  );
}
