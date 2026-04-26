import { Button, Container, Section } from "@/components/ui";
import { Compass, Heart, Leaf, Users } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Odyssey",
  description:
    "Odyssey is a curated marketplace for thoughtfully designed products, built by a small team that cares about craft and clarity.",
};

const values = [
  {
    icon: Compass,
    title: "Curated, not crowded",
    body: "We feature fewer products, picked with intention — not endless catalogues to scroll past.",
  },
  {
    icon: Leaf,
    title: "Made to last",
    body: "We favor materials and makers that prioritise longevity over disposability.",
  },
  {
    icon: Heart,
    title: "Honest details",
    body: "Real photos, plain-language specs, and reviews you can trust.",
  },
  {
    icon: Users,
    title: "People first",
    body: "Friendly humans behind every order, return, and question.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Section bg="surface" className="py-16 sm:py-20">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-600">
                Our story
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                A calmer way to shop online.
              </h1>
              <p className="mt-5 max-w-xl text-base text-foreground/70 sm:text-lg">
                Odyssey started as a weekend side project — a small list of
                products our team would actually buy and recommend to friends.
                Today it&apos;s grown into a curated marketplace, but the
                principle is the same: fewer, better things.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/items">
                  <Button size="lg">Browse the catalog</Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">
                    Get in touch
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface-muted shadow-[var(--shadow-elevated)]">
              <Image
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200"
                alt="Odyssey team workspace"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </Container>
      </Section>

      <Section
        eyebrow="What we believe"
        title="Four ideas guide every decision"
        description="Whether we're choosing a product, designing a page, or answering an email."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-[var(--radius-lg)] border border-border bg-background p-6 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-[var(--shadow-elevated)]"
            >
              <div className="grid h-11 w-11 place-items-center rounded-[var(--radius-md)] bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-200">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {title}
              </h3>
              <p className="mt-1.5 text-sm text-foreground/70">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section bg="surface" className="py-12 sm:py-14">
        <Container>
          <div className="rounded-[var(--radius-lg)] border border-border bg-background p-8 text-center shadow-[var(--shadow-card)] sm:p-12">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Want to list your own product?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-foreground/70 sm:text-base">
              Create a free account and you&apos;ll be able to add and manage
              your own listings from the dashboard.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/register">
                <Button size="lg">Create account</Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
