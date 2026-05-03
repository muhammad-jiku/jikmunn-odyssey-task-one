import { Card, CardBody, CardHeader } from "@/components/ui";

export default function AdminSettingsPage() {
  return (
    <Card>
      <CardHeader>Admin Settings</CardHeader>
      <CardBody>
        <p className="text-sm text-foreground/70">
          This panel is reserved for platform-level controls and configuration workflows.
        </p>
      </CardBody>
    </Card>
  );
}
