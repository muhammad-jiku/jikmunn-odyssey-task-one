"use client";

import { Card, CardBody, CardHeader } from "@/components/ui";
import { apiAdminOverview } from "@/lib/api-client";
import { useEffect, useState } from "react";

type Stats = {
  totalUsers: number;
  totalItems: number;
  totalActiveItems: number;
  totalContactMessages: number;
};

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let active = true;
    void apiAdminOverview().then((result) => {
      if (active) setStats(result);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Admin Overview</h1>
        <p className="mt-1 text-sm text-foreground/70">Live platform metrics from backend data.</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>Total Users</CardHeader>
          <CardBody>
            <p className="text-3xl font-semibold text-foreground">{stats?.totalUsers ?? "-"}</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Total Items</CardHeader>
          <CardBody>
            <p className="text-3xl font-semibold text-foreground">{stats?.totalItems ?? "-"}</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Active Items</CardHeader>
          <CardBody>
            <p className="text-3xl font-semibold text-foreground">{stats?.totalActiveItems ?? "-"}</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Contact Messages</CardHeader>
          <CardBody>
            <p className="text-3xl font-semibold text-foreground">{stats?.totalContactMessages ?? "-"}</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
