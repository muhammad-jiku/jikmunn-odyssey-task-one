import clsx from "clsx";
import type { ForwardedRef, InputHTMLAttributes, ReactNode } from "react";
import { forwardRef, useId } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightAddon?: ReactNode;
}

function InputInner(
  {
    className,
    label,
    hint,
    error,
    leftIcon,
    rightAddon,
    id,
    ...rest
  }: InputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const reactId = useId();
  const inputId = id ?? `input-${reactId}`;
  const describedBy = error
    ? `${inputId}-error`
    : hint
      ? `${inputId}-hint`
      : undefined;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          {label}
        </label>
      )}
      <div
        className={clsx(
          "flex items-center gap-2 rounded-[var(--radius-md)] border bg-background transition-colors",
          error
            ? "border-red-500 focus-within:border-red-500"
            : "border-border focus-within:border-brand-500",
        )}
      >
        {leftIcon && (
          <span className="pl-3 text-foreground/60" aria-hidden>
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={clsx(
            "h-11 w-full bg-transparent px-3 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none",
            leftIcon && "pl-1",
            rightAddon && "pr-1",
            className,
          )}
          {...rest}
        />
        {rightAddon && <div className="pr-2">{rightAddon}</div>}
      </div>
      {error ? (
        <p
          id={`${inputId}-error`}
          className="mt-1.5 text-xs font-medium text-red-600"
        >
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-foreground/60">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export const Input = forwardRef(InputInner);
Input.displayName = "Input";
