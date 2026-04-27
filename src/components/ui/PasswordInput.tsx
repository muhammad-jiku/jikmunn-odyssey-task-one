"use client";

import { Eye, EyeOff } from "lucide-react";
import type { ForwardedRef } from "react";
import { forwardRef, useState } from "react";
import { Input, type InputProps } from "./Input";

export type PasswordInputProps = Omit<InputProps, "type" | "rightAddon">;

function PasswordInputInner(
  props: PasswordInputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const [visible, setVisible] = useState(false);
  return (
    <Input
      {...props}
      ref={ref}
      type={visible ? "text" : "password"}
      rightAddon={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="grid h-7 w-7 place-items-center rounded-[var(--radius-sm)] text-foreground/60 transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      }
    />
  );
}

export const PasswordInput = forwardRef(PasswordInputInner);
PasswordInput.displayName = "PasswordInput";
