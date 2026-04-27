import { ItemCard } from "@/components/items/ItemCard";
import { Badge, Button, Container, Section } from "@/components/ui";
import { staticItems } from "@/data/items";
import
  {
    ArrowRight,
    Headphones,
    Quote,
    ShieldCheck,
    Sparkles,
    Star,
    Truck,
    Undo2,
  } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    icon: Truck,
    title: "Fast worldwide shipping",
    body: "Carbon-neutral delivery in 2–5 days to over 70 countries.",
  },
  {
    icon: ShieldCheck,
    title: "Secure checkout",
    body: "Bank-grade encryption and trusted payment partners on every order.",
  },
  {
    icon: Undo2,
    title: "30-day easy returns",
    body: "Changed your mind? Send it back, no questions asked.",
  },
  {
    icon: Headphones,
    title: "Always-on support",
    body: "Real humans available 7 days a week, in your timezone.",
  },
];

const testimonials = [
  {
    name: "Amelia R.",
    role: "Product Designer",
    quote:
      "Odyssey is my go-to for considered everyday objects. The curation feels like a friend with great taste.",
  },
  {
    name: "Daniel K.",
    role: "Software Engineer",
    quote:
      "The site is fast, the photos are honest, and the products live up to the descriptions. Rare combination.",
  },
  {
    name: "Priya S.",
    role: "Founder, Nest Studio",
    quote:
      "I've furnished my entire studio from Odyssey. Quality, price, and delivery — all on point.",
  },
];

export default function Home() {
  const featuredItems = staticItems.slice(0, 4);

  return (
    <>
      {/* Hero */}
      <Section bleed bg="surface" className="overflow-hidden py-20 sm:py-24 lg:py-28">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
                <Sparkles className="h-3.5 w-3.5" /> New season collection is live
              </span>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Thoughtfully curated products for{" "}
                <span className="text-brand-600">every chapter</span> of life.
              </h1>
              <p className="mt-5 max-w-xl text-base text-foreground/70 sm:text-lg">
                Discover a marketplace built around design, durability, and
                delight — across electronics, home, fashion, and more.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/items">
                  <Button
                    size="lg"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Shop the collection
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline">
                    Our story
                  </Button>
                </Link>
              </div>
              <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-border pt-6 text-sm">
                <div>
                  <dt className="text-foreground/60">Products</dt>
                  <dd className="text-xl font-semibold text-foreground">
                    1.2k+
                  </dd>
                </div>
                <div>
                  <dt className="text-foreground/60">Brands</dt>
                  <dd className="text-xl font-semibold text-foreground">90+</dd>
                </div>
                <div>
                  <dt className="text-foreground/60">Happy buyers</dt>
                  <dd className="text-xl font-semibold text-foreground">38k</dd>
                </div>
              </dl>
            </div>

            <div className="relative animate-fade-in-up animation-delay-100">
              <div className="relative aspect-[5/4] overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface-muted shadow-[var(--shadow-elevated)]">
                <Image
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200"
                  alt="Curated product collection"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden w-56 rounded-[var(--radius-lg)] border border-border bg-background p-4 shadow-[var(--shadow-elevated)] sm:block">
                <div className="flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-amber-50 text-amber-600">
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      4.9 / 5
                    </p>
                    <p className="text-xs text-foreground/60">12,400 reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Features */}
      <Section
        eyebrow="Why Odyssey"
        title="Built around what matters"
        description="Every detail of the buying experience is designed to feel calm, fast, and trustworthy."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="group rounded-[var(--radius-lg)] border border-border bg-background p-6 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-[var(--shadow-elevated)] focus-within:border-brand-300"
            >
              <div className="grid h-11 w-11 place-items-center rounded-[var(--radius-md)] bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-100 dark:bg-brand-900/40 dark:text-brand-200">
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

      {/* Items preview */}
      <Section bg="surface">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-600">
              Featured
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Hand-picked this week
            </h2>
            <p className="mt-3 text-base text-foreground/70">
              A small selection of products our team is loving right now.
            </p>
          </div>
          <Link href="/items">
            <Button
              variant="outline"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              View all
            </Button>
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <Section
        eyebrow="Loved by buyers"
        title="What customers are saying"
        description="Real words from people who shop with us regularly."
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex h-full flex-col rounded-[var(--radius-lg)] border border-border bg-background p-6 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-elevated)]"
            >
              <Quote className="h-6 w-6 text-brand-500" aria-hidden />
              <blockquote className="mt-4 flex-1 text-base text-foreground/80">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-600 text-sm font-semibold text-white">
                  {t.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")}
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {t.name}
                  </p>
                  <p className="text-xs text-foreground/60">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* CTA banner */}
      <Section bg="surface" className="py-14 sm:py-16">
        <div className="overflow-hidden rounded-[var(--radius-lg)] bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-12 text-white shadow-[var(--shadow-elevated)] sm:px-12 sm:py-16">
          <div className="grid items-center gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <Badge tone="brand" className="bg-white/20 text-white">
                Members save more
              </Badge>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Join Odyssey to unlock your wishlist & exclusive drops.
              </h2>
              <p className="mt-3 max-w-xl text-base text-white/80">
                Create a free account to save products, manage your listings,
                and get early access to new launches.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link href="/register" className="flex-1">
                <Button
                  fullWidth
                  size="lg"
                  className="bg-white text-brand-700 hover:bg-white/90"
                >
                  Create account
                </Button>
              </Link>
              <Link href="/items" className="flex-1">
                <Button
                  fullWidth
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10"
                >
                  Continue browsing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
