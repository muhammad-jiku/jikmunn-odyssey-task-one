"use client";

import { Button, Input } from "@/components/ui";
import { apiSubmitContactMessage } from "@/lib/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Send, User } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Please share your name"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  subject: z.string().min(2, "Subject is required").max(120, "Too long"),
  message: z
    .string()
    .min(10, "Tell us a bit more (at least 10 characters)")
    .max(2000, "Please keep it under 2000 characters"),
});

type ContactValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  async function onSubmit(values: ContactValues) {
    try {
      await apiSubmitContactMessage(values);
      toast.success("Message sent successfully.");
      reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send message");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Your name"
          placeholder="Jane Doe"
          autoComplete="name"
          leftIcon={<User className="h-4 w-4" />}
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />
      </div>
      <Input
        label="Subject"
        placeholder="What's this about?"
        error={errors.subject?.message}
        {...register("subject")}
      />
      <div>
        <label
          htmlFor="contact-message"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          rows={6}
          placeholder="Tell us what you're thinking…"
          className="w-full rounded-[var(--radius-md)] border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/40 focus:border-brand-500 focus:outline-none"
          aria-invalid={!!errors.message}
          {...register("message")}
        />
        {errors.message && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.message.message}
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-foreground/60">
          We respect your privacy and will only use your email to reply.
        </p>
        <Button
          type="submit"
          size="lg"
          isLoading={isSubmitting}
          leftIcon={<Send className="h-4 w-4" />}
        >
          Send message
        </Button>
      </div>
    </form>
  );
}
