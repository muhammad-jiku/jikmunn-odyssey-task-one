"use client";

import { Button, Dropdown, Input, Table, TableCell, TableHead, TableHeaderCell, TableWrapper } from "@/components/ui";
import { apiAdminDeleteItem, apiAdminItems } from "@/lib/api-client";
import { formatDate, formatPrice } from "@/lib/items-utils";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

type Row = {
  id: string;
  title: string;
  category: string;
  price: number;
  rating: number;
  status: "active" | "archived";
  createdAt: string;
};

export default function AdminItemsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "archived">("all");

  const load = useCallback(async () => {
    const data = await apiAdminItems({ q, status, pageSize: 50 });
    setRows(data.rows as Row[]);
  }, [q, status]);

  useEffect(() => {
    let active = true;

    void apiAdminItems({ q, status, pageSize: 50 }).then((data) => {
      if (active) setRows(data.rows as Row[]);
    });

    return () => {
      active = false;
    };
  }, [q, status]);

  async function handleArchive(itemId: string) {
    await apiAdminDeleteItem(itemId);
    toast.success("Item archived");
    await load();
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Manage Items</h1>
        <p className="mt-1 text-sm text-foreground/70">Admin moderation table with filtering and actions.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-[1fr_220px_auto]">
        <Input placeholder="Search items" value={q} onChange={(event) => setQ(event.target.value)} />
        <Dropdown
          label="Status"
          selectedValue={status}
          onSelect={(value) => setStatus(value as "all" | "active" | "archived")}
          items={[
            { id: "all", label: "All", value: "all" },
            { id: "active", label: "Active", value: "active" },
            { id: "archived", label: "Archived", value: "archived" }
          ]}
        />
        <Button variant="outline" onClick={() => void load()}>Refresh</Button>
      </div>

      <TableWrapper>
        <Table>
          <TableHead>
            <tr>
              <TableHeaderCell>Title</TableHeaderCell>
              <TableHeaderCell>Category</TableHeaderCell>
              <TableHeaderCell>Price</TableHeaderCell>
              <TableHeaderCell>Rating</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Created</TableHeaderCell>
              <TableHeaderCell className="text-right">Action</TableHeaderCell>
            </tr>
          </TableHead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row.id}>
                <TableCell className="font-medium text-foreground">{row.title}</TableCell>
                <TableCell className="capitalize">{row.category}</TableCell>
                <TableCell>{formatPrice(row.price)}</TableCell>
                <TableCell>{row.rating.toFixed(1)}</TableCell>
                <TableCell className="capitalize">{row.status}</TableCell>
                <TableCell>{formatDate(row.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="danger"
                    disabled={row.status === "archived"}
                    onClick={() => void handleArchive(row.id)}
                  >
                    Archive
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
