"use client";

import { Button, Container, Input } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, LogIn, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1-3.31 0-6.01-2.74-6.01-6.1S8.69 5.9 12 5.9c1.88 0 3.14.8 3.86 1.49l2.63-2.54C16.83 3.3 14.62 2.4 12 2.4 6.78 2.4 2.55 6.63 2.55 11.85S6.78 21.3 12 21.3c6.93 0 9.45-4.85 9.45-7.39 0-.5-.05-.88-.12-1.26H12z"
      />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { login, loginWithGoogle, firebaseEnabled } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    setSubmitting(true);
    try {
      await login(values.email, values.password);
      toast.success("Welcome back!");
      router.push(redirect);
      router.refresh();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Could not sign you in.";
      toast.error(msg.replace("Firebase: ", ""));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Signed in with Google");
      router.push(redirect);
      router.refresh();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Google sign-in failed.";
      toast.error(msg.replace("Firebase: ", ""));
    } finally {
      setGoogleLoading(false);
    }
  }

  const busy = submitting || isSubmitting;

  return (
    <section className="bg-surface py-16 sm:py-20">
      <Container>
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-[var(--radius-lg)] border border-border bg-background p-8 shadow-[var(--shadow-card)] sm:p-10">
            <div className="mb-6 text-center">
              <div className="mx-auto grid h-11 w-11 place-items-center rounded-[var(--radius-md)] bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-200">
                <LogIn className="h-5 w-5" />
              </div>
              <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
                Welcome back
              </h1>
              <p className="mt-1.5 text-sm text-foreground/70">
                Sign in to your Odyssey account to continue.
              </p>
            </div>

            {!firebaseEnabled && (
              <div className="mb-5 rounded-[var(--radius-md)] border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
                Firebase keys are not set in <code>.env.local</code>. Add the
                <code className="mx-1">NEXT_PUBLIC_FIREBASE_*</code>variables to
                enable authentication.
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-4"
            >
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                leftIcon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                {...register("email")}
              />
              <Input
                label="Password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                leftIcon={<Lock className="h-4 w-4" />}
                error={errors.password?.message}
                {...register("password")}
              />
              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={busy}
                disabled={busy || googleLoading}
              >
                Sign in
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs text-foreground/50">
              <span className="h-px flex-1 bg-border" />
              OR
              <span className="h-px flex-1 bg-border" />
            </div>

            <Button
              type="button"
              fullWidth
              size="lg"
              variant="outline"
              onClick={handleGoogle}
              isLoading={googleLoading}
              disabled={busy || googleLoading}
              leftIcon={<GoogleIcon className="h-4 w-4" />}
            >
              Continue with Google
            </Button>

            <p className="mt-6 text-center text-sm text-foreground/70">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-brand-600 hover:text-brand-700"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
