import { Button, Container, Section } from "@/components/ui";
import { ArrowLeft, Compass, Search } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Page not found — Odyssey",
};

export default function NotFound() {
  return (
    <Section bg="surface" className="py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-xl rounded-[var(--radius-lg)] border border-border bg-background p-10 text-center shadow-[var(--shadow-card)] animate-fade-in-up sm:p-12">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-200">
            <Compass className="h-7 w-7" />
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-brand-600">
            Error 404
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            We couldn&apos;t find that page
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-foreground/70 sm:text-base">
            The link may be broken, or the page may have moved. Let&apos;s get
            you back on track.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/">
              <Button leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Back to home
              </Button>
            </Link>
            <Link href="/items">
              <Button
                variant="outline"
                leftIcon={<Search className="h-4 w-4" />}
              >
                Browse products
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
