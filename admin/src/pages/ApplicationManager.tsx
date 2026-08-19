import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, asText, formatDate } from "@/lib/api";

const STATUSES = ["pending", "reviewed", "contacted", "closed"] as const;

type Column = {
  key: string;
  label: string;
  render?: (item: Record<string, unknown>) => ReactNode;
};

type Props = {
  title: string;
  endpoint: string;
  columns: Column[];
};

function statusVariant(status: string) {
  if (status === "contacted") return "default" as const;
  if (status === "closed") return "destructive" as const;
  if (status === "reviewed") return "secondary" as const;
  return "outline" as const;
}

export default function ApplicationManager({ title, endpoint, columns }: Props) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);
  const [notes, setNotes] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [saving, setSaving] = useState(false);

  const query = useMemo(() => {
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search.trim()) params.set("search", search.trim());
    if (status !== "all") params.set("status", status);
    return params.toString();
  }, [page, search, status]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await apiRequest<Record<string, unknown>[]>(`${endpoint}?${query}`);
      setItems(response.data);
      setPages(response.meta?.pages ?? 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const openItem = (item: Record<string, unknown>) => {
    setSelected(item);
    setNotes(typeof item.notes === "string" ? item.notes : "");
    setSelectedStatus(typeof item.status === "string" ? item.status : "pending");
  };

  const saveItem = async () => {
    if (!selected?.id) return;
    setSaving(true);
    try {
      const response = await apiRequest<Record<string, unknown>>(`${endpoint}/${selected.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: selectedStatus, notes }),
      });
      setSelected(response.data);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async () => {
    if (!selected?.id) return;
    if (!window.confirm("Delete this application?")) return;
    setSaving(true);
    try {
      await apiRequest(`${endpoint}/${selected.id}`, { method: "DELETE" });
      setSelected(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete");
    } finally {
      setSaving(false);
    }
  };

  const hiddenKeys = new Set(["id", "notes", "status", "isDeleted"]);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">{title}</h1>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search name, email, or contact"
          value={search}
          onChange={(event) => {
            setPage(1);
            setSearch(event.target.value);
          }}
          className="sm:max-w-xs"
        />
        <Select
          value={status}
          onValueChange={(value) => {
            setPage(1);
            setStatus(value);
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <div className="mt-6 rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="py-10 text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="py-10 text-center text-muted-foreground">
                  No applications yet
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow
                  key={String(item.id)}
                  className="cursor-pointer"
                  onClick={() => openItem(item)}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render ? column.render(item) : asText(item[column.key])}
                    </TableCell>
                  ))}
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <Button variant="outline" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {page} of {pages}
        </span>
        <Button variant="outline" disabled={page >= pages} onClick={() => setPage((current) => current + 1)}>
          Next
        </Button>
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Application details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3">
              {Object.entries(selected)
                .filter(([key]) => !hiddenKeys.has(key))
                .map(([key, value]) => (
                  <div key={key}>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{key}</p>
                    <p className="mt-1 text-sm">{asText(value)}</p>
                  </div>
                ))}
              <div>
                <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Status</p>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Notes</p>
                <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="destructive" onClick={() => void deleteItem()} disabled={saving}>
              Delete
            </Button>
            <Button onClick={() => void saveItem()} disabled={saving}>
              {saving && <Loader2 className="animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function StatusBadge({ status }: { status: unknown }) {
  const value = typeof status === "string" ? status : "pending";
  return <Badge variant={statusVariant(value)}>{value}</Badge>;
}
