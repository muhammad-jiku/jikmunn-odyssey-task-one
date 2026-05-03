"use client";

import { Card, CardBody, CardHeader } from "@/components/ui";
import { apiAdminCharts } from "@/lib/api-client";
import { useEffect, useState } from "react";
import
    {
        Bar,
        BarChart,
        CartesianGrid,
        Cell,
        Legend,
        Line,
        LineChart,
        Pie,
        PieChart,
        ResponsiveContainer,
        Tooltip,
        XAxis,
        YAxis
    } from "recharts";

type ChartsPayload = {
  itemsAndMessagesByMonth: Array<{ month: string; items: number; messages: number }>;
  categoryDistribution: Array<{ label: string; value: number }>;
  roleDistribution: Array<{ label: string; value: number }>;
  messageStatusDistribution: Array<{ label: string; value: number }>;
};

const PIE_COLORS = ["#2563eb", "#0f766e", "#d97706", "#dc2626", "#7c3aed", "#0891b2"];

export default function AdminReportsPage() {
  const [charts, setCharts] = useState<ChartsPayload | null>(null);

  useEffect(() => {
    let active = true;
    void apiAdminCharts().then((data) => {
      if (active) setCharts(data);
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Reports</h1>
        <p className="mt-1 text-sm text-foreground/70">Bar, line, and pie charts powered by live backend aggregates.</p>
      </header>

      <Card>
        <CardHeader>Monthly Activity (Bar)</CardHeader>
        <CardBody className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts?.itemsAndMessagesByMonth ?? []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="items" fill="#2563eb" radius={[6, 6, 0, 0]} />
              <Bar dataKey="messages" fill="#d97706" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Monthly Trend (Line)</CardHeader>
        <CardBody className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={charts?.itemsAndMessagesByMonth ?? []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="items" stroke="#0f766e" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="messages" stroke="#dc2626" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>Category Distribution (Pie)</CardHeader>
          <CardBody className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts?.categoryDistribution ?? []}
                  dataKey="value"
                  nameKey="label"
                  outerRadius={110}
                  fill="#2563eb"
                  label
                >
                  {(charts?.categoryDistribution ?? []).map((entry, idx) => (
                    <Cell key={`${entry.label}-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>Role Distribution (Pie)</CardHeader>
          <CardBody className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts?.roleDistribution ?? []}
                  dataKey="value"
                  nameKey="label"
                  outerRadius={110}
                  fill="#0f766e"
                  label
                >
                  {(charts?.roleDistribution ?? []).map((entry, idx) => (
                    <Cell key={`${entry.label}-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
