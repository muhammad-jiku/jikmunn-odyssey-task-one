import { ItemsBrowser } from "@/components/items/ItemsBrowser";
import { Container, Section } from "@/components/ui";
import { staticItems } from "@/data/items";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop — Odyssey",
  description:
    "Browse all Odyssey products. Search by name, filter by category, and dial in your price range.",
};

export default function ItemsPage() {
  return (
    <Section bg="default" className="py-12 sm:py-16">
      <Container>
        <header className="mb-8 max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-600">
            Catalog
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            All products
          </h1>
          <p className="mt-2 text-base text-foreground/70">
            {staticItems.length}+ thoughtfully chosen items, updated weekly.
          </p>
        </header>
        <ItemsBrowser items={staticItems} />
      </Container>
    </Section>
  );
}
