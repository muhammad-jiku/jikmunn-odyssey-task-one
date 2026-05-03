"use client";

import { Button, Card, CardBody, CardHeader, Input, PasswordInput } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { apiUpdateAvatar, apiUpdatePassword, apiUpdateProfile } from "@/lib/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email()
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6).max(128),
    newPassword: z.string().min(6).max(128),
    confirmPassword: z.string().min(6).max(128)
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match"
  });

const avatarSchema = z.object({
  avatarUrl: z.string().url()
});

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;
type AvatarValues = z.infer<typeof avatarSchema>;

export default function DashboardProfilePage() {
  const { user } = useAuth();

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? ""
    }
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  const avatarForm = useForm<AvatarValues>({
    resolver: zodResolver(avatarSchema),
    defaultValues: {
      avatarUrl: user?.avatarUrl ?? ""
    }
  });

  useEffect(() => {
    profileForm.reset({ name: user?.name ?? "", email: user?.email ?? "" });
    avatarForm.reset({ avatarUrl: user?.avatarUrl ?? "" });
  }, [user, profileForm, avatarForm]);

  async function onProfileSubmit(values: ProfileValues) {
    try {
      await apiUpdateProfile(values);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update profile");
    }
  }

  async function onPasswordSubmit(values: PasswordValues) {
    try {
      await apiUpdatePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      });
      passwordForm.reset();
      toast.success("Password updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update password");
    }
  }

  async function onAvatarSubmit(values: AvatarValues) {
    try {
      await apiUpdateAvatar(values.avatarUrl);
      toast.success("Avatar updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update avatar");
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>Profile Information</CardHeader>
        <CardBody>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
            <Input label="Name" {...profileForm.register("name")} error={profileForm.formState.errors.name?.message} />
            <Input
              label="Email"
              type="email"
              {...profileForm.register("email")}
              error={profileForm.formState.errors.email?.message}
            />
            <div className="sm:col-span-2">
              <Button type="submit" isLoading={profileForm.formState.isSubmitting}>Save profile</Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Avatar</CardHeader>
        <CardBody>
          <form className="grid gap-4 sm:grid-cols-[1fr_auto]" onSubmit={avatarForm.handleSubmit(onAvatarSubmit)}>
            <Input
              label="Avatar URL"
              placeholder="https://..."
              {...avatarForm.register("avatarUrl")}
              error={avatarForm.formState.errors.avatarUrl?.message}
            />
            <div className="self-end">
              <Button type="submit" isLoading={avatarForm.formState.isSubmitting}>Update avatar</Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Change Password</CardHeader>
        <CardBody>
          <form className="grid gap-4 sm:grid-cols-3" onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
            <PasswordInput
              label="Current password"
              {...passwordForm.register("currentPassword")}
              error={passwordForm.formState.errors.currentPassword?.message}
            />
            <PasswordInput
              label="New password"
              {...passwordForm.register("newPassword")}
              error={passwordForm.formState.errors.newPassword?.message}
            />
            <PasswordInput
              label="Confirm password"
              {...passwordForm.register("confirmPassword")}
              error={passwordForm.formState.errors.confirmPassword?.message}
            />
            <div className="sm:col-span-3">
              <Button type="submit" isLoading={passwordForm.formState.isSubmitting}>Change password</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
