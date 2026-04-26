import { Container, Section } from "@/components/ui";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Odyssey",
  description:
    "Have a question, feedback, or partnership idea? We'd love to hear from you.",
};

const channels = [
  {
    icon: Mail,
    title: "Email us",
    body: "support@odyssey.example",
    href: "mailto:support@odyssey.example",
  },
  {
    icon: Phone,
    title: "Call us",
    body: "+1 (415) 555-0142",
    href: "tel:+14155550142",
  },
  {
    icon: MessageCircle,
    title: "Live chat",
    body: "Available 9am–6pm, Mon–Fri",
    href: "#",
  },
  {
    icon: MapPin,
    title: "Visit",
    body: "742 Market Street, San Francisco, CA",
    href: "#",
  },
];

export default function ContactPage() {
  return (
    <Section className="py-16 sm:py-20" bg="surface">
      <Container>
        <header className="mx-auto max-w-2xl text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-600">
            Contact
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            We&apos;d love to hear from you
          </h1>
          <p className="mt-4 text-base text-foreground/70 sm:text-lg">
            Pick the channel that works best — we usually respond within one
            business day.
          </p>
        </header>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map(({ icon: Icon, title, body, href }) => (
            <a
              key={title}
              href={href}
              className="group rounded-[var(--radius-lg)] border border-border bg-background p-6 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-[var(--shadow-elevated)]"
            >
              <div className="grid h-11 w-11 place-items-center rounded-[var(--radius-md)] bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-100 dark:bg-brand-900/40 dark:text-brand-200">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {title}
              </h3>
              <p className="mt-1.5 text-sm text-foreground/70">{body}</p>
            </a>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-3xl rounded-[var(--radius-lg)] border border-border bg-background p-8 shadow-[var(--shadow-card)] sm:p-10">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Frequently asked
          </h2>
          <dl className="mt-6 divide-y divide-border">
            {[
              {
                q: "How long does shipping take?",
                a: "Most orders arrive within 2–5 business days, depending on your location.",
              },
              {
                q: "Can I return a product?",
                a: "Yes — we offer 30-day, no-questions-asked returns on every order.",
              },
              {
                q: "Do you ship internationally?",
                a: "We currently ship to over 70 countries with carbon-neutral options at checkout.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="py-5">
                <dt className="text-sm font-semibold text-foreground">{q}</dt>
                <dd className="mt-1.5 text-sm text-foreground/70">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </Section>
  );
}
