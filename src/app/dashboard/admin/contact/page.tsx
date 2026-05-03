"use client";

import { Button, Dropdown, Input, Table, TableCell, TableHead, TableHeaderCell, TableWrapper } from "@/components/ui";
import { apiAdminContactMessages } from "@/lib/api-client";
import { formatDate } from "@/lib/items-utils";
import { useCallback, useEffect, useState } from "react";

type ContactRow = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "resolved";
  createdAt: string;
};

export default function AdminContactPage() {
  const [rows, setRows] = useState<ContactRow[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "unread" | "read" | "resolved">("all");

  const load = useCallback(async () => {
    const data = await apiAdminContactMessages({ q, status, pageSize: 50 });
    setRows(data.messages);
  }, [q, status]);

  useEffect(() => {
    let active = true;

    void apiAdminContactMessages({ q, status, pageSize: 50 }).then((data) => {
      if (active) setRows(data.messages);
    });

    return () => {
      active = false;
    };
  }, [q, status]);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Contact Inbox</h1>
        <p className="mt-1 text-sm text-foreground/70">Messages submitted through the Contact form and stored in DB.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-[1fr_220px_auto]">
        <Input placeholder="Search messages" value={q} onChange={(event) => setQ(event.target.value)} />
        <Dropdown
          label="Status"
          selectedValue={status}
          onSelect={(value) => setStatus(value as "all" | "unread" | "read" | "resolved")}
          items={[
            { id: "all", label: "All", value: "all" },
            { id: "unread", label: "Unread", value: "unread" },
            { id: "read", label: "Read", value: "read" },
            { id: "resolved", label: "Resolved", value: "resolved" }
          ]}
        />
        <Button variant="outline" onClick={() => void load()}>Refresh</Button>
      </div>

      <TableWrapper>
        <Table>
          <TableHead>
            <tr>
              <TableHeaderCell>From</TableHeaderCell>
              <TableHeaderCell>Subject</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Created</TableHeaderCell>
              <TableHeaderCell>Message</TableHeaderCell>
            </tr>
          </TableHead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row.id}>
                <TableCell>
                  <p className="font-medium text-foreground">{row.name}</p>
                  <p className="text-xs text-foreground/60">{row.email}</p>
                </TableCell>
                <TableCell className="font-medium text-foreground">{row.subject}</TableCell>
                <TableCell className="capitalize">{row.status}</TableCell>
                <TableCell>{formatDate(row.createdAt)}</TableCell>
                <TableCell className="max-w-[420px] truncate text-foreground/70">{row.message}</TableCell>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    </div>
  );
}
