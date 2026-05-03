"use client";

import { Button, Dropdown, Input, Table, TableCell, TableHead, TableHeaderCell, TableWrapper } from "@/components/ui";
import { apiAdminUpdateUserRole, apiAdminUsers } from "@/lib/api-client";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

type Row = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt?: string;
};

export default function AdminUsersPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [role, setRole] = useState<"all" | "user" | "admin">("all");

  const load = useCallback(async () => {
    const data = await apiAdminUsers({ q, role, pageSize: 50 });
    setRows(data.rows);
  }, [q, role]);

  useEffect(() => {
    let active = true;

    void apiAdminUsers({ q, role, pageSize: 50 }).then((data) => {
      if (active) setRows(data.rows);
    });

    return () => {
      active = false;
    };
  }, [q, role]);

  async function handleRoleChange(userId: string, nextRole: "user" | "admin") {
    await apiAdminUpdateUserRole(userId, nextRole);
    toast.success("User role updated");
    await load();
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Manage Users</h1>
        <p className="mt-1 text-sm text-foreground/70">Filter, inspect, and update user roles.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-[1fr_220px_auto]">
        <Input placeholder="Search users by name or email" value={q} onChange={(event) => setQ(event.target.value)} />
        <Dropdown
          label="Role"
          selectedValue={role}
          onSelect={(value) => setRole(value as "all" | "user" | "admin")}
          items={[
            { id: "all", label: "All", value: "all" },
            { id: "user", label: "User", value: "user" },
            { id: "admin", label: "Admin", value: "admin" }
          ]}
        />
        <Button variant="outline" onClick={() => void load()}>Refresh</Button>
      </div>

      <TableWrapper>
        <Table>
          <TableHead>
            <tr>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Role</TableHeaderCell>
              <TableHeaderCell className="text-right">Action</TableHeaderCell>
            </tr>
          </TableHead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row.id}>
                <TableCell className="font-medium text-foreground">{row.name}</TableCell>
                <TableCell className="text-foreground/70">{row.email}</TableCell>
                <TableCell className="capitalize">{row.role}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => void handleRoleChange(row.id, row.role === "admin" ? "user" : "admin")}
                  >
                    Set {row.role === "admin" ? "User" : "Admin"}
                  </Button>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    </div>
  );
}
