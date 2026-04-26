import { Button, Section } from "@/components/ui";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <Section bg="surface" className="py-24 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
          <Sparkles className="h-3.5 w-3.5" /> Phase 1 shell ready
        </span>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Welcome to <span className="text-brand-600">Jikmunn</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-foreground/70 sm:text-lg">
          A curated marketplace built with Next.js, Tailwind, and Firebase. The
          full landing experience arrives in Phase 2.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/items">
            <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Browse products
            </Button>
          </Link>
          <Link href="/about">
            <Button size="lg" variant="outline">
              Learn more
            </Button>
          </Link>
        </div>
      </div>
    </Section>
  );
}
