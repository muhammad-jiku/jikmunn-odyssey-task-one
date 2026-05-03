"use client";

import { Card, CardBody, CardHeader } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { useUserItems } from "@/lib/itemsStore";

export default function UserOverviewPage() {
  const { user } = useAuth();
  const items = useUserItems();

  const avgRating =
    items.length === 0
      ? 0
      : items.reduce((sum, item) => sum + item.rating, 0) / items.length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welcome back, {user?.name ?? "User"}</h1>
        <p className="mt-1 text-sm text-foreground/70">Your marketplace activity at a glance.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>Total Listings</CardHeader>
          <CardBody>
            <p className="text-3xl font-semibold text-foreground">{items.length}</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Average Rating</CardHeader>
          <CardBody>
            <p className="text-3xl font-semibold text-foreground">{avgRating.toFixed(1)}</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Account Role</CardHeader>
          <CardBody>
            <p className="text-3xl font-semibold capitalize text-foreground">{user?.role ?? "user"}</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
