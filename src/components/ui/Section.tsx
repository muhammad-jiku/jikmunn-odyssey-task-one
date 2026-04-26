import clsx from "clsx";
import type { HTMLAttributes, ReactNode } from "react";
import { Container } from "./Container";

export interface SectionProps
  extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  bleed?: boolean;
  bg?: "default" | "surface" | "muted";
  containerClassName?: string;
}

export function Section({
  className,
  eyebrow,
  title,
  description,
  bleed = false,
  bg = "default",
  containerClassName,
  children,
  ...rest
}: SectionProps) {
  const bgClass =
    bg === "surface"
      ? "bg-surface"
      : bg === "muted"
        ? "bg-surface-muted"
        : "bg-background";

  return (
    <section
      className={clsx("py-16 sm:py-20 lg:py-24", bgClass, className)}
      {...rest}
    >
      {bleed ? (
        children
      ) : (
        <Container className={containerClassName}>
          {(eyebrow || title || description) && (
            <header className="mb-10 max-w-2xl">
              {eyebrow && (
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-600">
                  {eyebrow}
                </p>
              )}
              {title && (
                <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-3 text-base text-foreground/70 sm:text-lg">
                  {description}
                </p>
              )}
            </header>
          )}
          {children}
        </Container>
      )}
    </section>
  );
}
