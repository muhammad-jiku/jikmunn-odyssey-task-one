"use client";

import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

export interface DropdownItem {
  id: string;
  label: string;
  value: string;
}

interface DropdownProps {
  label: string;
  items: DropdownItem[];
  selectedValue: string;
  onSelect: (value: string) => void;
  className?: string;
}

export function Dropdown({
  label,
  items,
  selectedValue,
  onSelect,
  className
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = items.find((item) => item.value === selectedValue) ?? items[0];

  return (
    <div ref={rootRef} className={clsx("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 w-full items-center justify-between rounded-[var(--radius-md)] border border-border bg-background px-3 text-sm text-foreground transition-colors hover:bg-surface-muted"
      >
        <span className="truncate">{label}: {selected?.label}</span>
        <ChevronDown className={clsx("h-4 w-4 text-foreground/60", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 top-11 z-20 w-full overflow-hidden rounded-[var(--radius-md)] border border-border bg-background shadow-[var(--shadow-elevated)]">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={clsx(
                "w-full px-3 py-2.5 text-left text-sm transition-colors hover:bg-surface-muted",
                item.value === selectedValue && "bg-surface-muted font-medium"
              )}
              onClick={() => {
                onSelect(item.value);
                setOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function DropdownMenu({ children }: { children: ReactNode }) {
  return <div className="space-y-1">{children}</div>;
}
