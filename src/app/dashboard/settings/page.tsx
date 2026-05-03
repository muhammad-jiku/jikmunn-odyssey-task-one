"use client";

import { Card, CardBody, CardHeader } from "@/components/ui";
import { useTheme } from "@/context/ThemeContext";

export default function UserSettingsPage() {
  const { resolved } = useTheme();

  return (
    <Card>
      <CardHeader>Settings</CardHeader>
      <CardBody>
        <p className="text-sm text-foreground/70">
          Current theme: <span className="font-semibold text-foreground">{resolved}</span>
        </p>
        <p className="mt-2 text-sm text-foreground/70">
          Additional user preference controls can be added here as Phase 8 and 9 progress.
        </p>
      </CardBody>
    </Card>
  );
}
