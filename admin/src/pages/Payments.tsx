import { useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
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

const STATUSES = [
  "pending",
  "completed",
  "abnormal",
  "overpayment",
  "cancelled",
  "failed",
] as const;

const REVIEW_STATUSES = ["none", "pending_review", "approved", "rejected"] as const;

function statusVariant(status: string) {
  if (status === "completed" || status === "overpayment") return "default" as const;
  if (status === "abnormal" || status === "failed") return "destructive" as const;
  if (status === "cancelled") return "secondary" as const;
  return "outline" as const;
}

export default function Payments() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [events, setEvents] = useState<Record<string, unknown>[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);
  const [notes, setNotes] = useState("");
  const [reviewStatus, setReviewStatus] = useState("none");
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
      const response = await apiRequest<Record<string, unknown>[]>(`/api/admin/payments?${query}`);
      setItems(response.data);
      setPages(response.meta?.pages ?? 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const openItem = async (item: Record<string, unknown>) => {
    setSelected(item);
    setNotes(typeof item.notes === "string" ? item.notes : "");
    setReviewStatus(typeof item.reviewStatus === "string" ? item.reviewStatus : "none");
    setEvents([]);

    if (typeof item.id === "string") {
      try {
        const response = await apiRequest<Record<string, unknown>[]>(
          `/api/admin/payments/${item.id}/events`
        );
        setEvents(response.data);
      } catch {
        setEvents([]);
      }
    }
  };

  const saveItem = async () => {
    if (!selected?.id) return;
    setSaving(true);
    try {
      const response = await apiRequest<Record<string, unknown>>(`/api/admin/payments/${selected.id}`, {
        method: "PATCH",
        body: JSON.stringify({ notes, reviewStatus }),
      });
      setSelected(response.data);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save payment");
    } finally {
      setSaving(false);
    }
  };

  const resyncItem = async () => {
    if (!selected?.id) return;
    setSaving(true);
    try {
      const response = await apiRequest<Record<string, unknown>>(
        `/api/admin/payments/${selected.id}/resync`,
        { method: "POST" }
      );
      setSelected(response.data);
      await load();
      await openItem(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sync payment");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">CipherBC payments</h1>
        <p className="mt-1 text-sm text-[#637381]">
          All crypto deposit orders, callbacks, and review actions in one place.
        </p>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search order, email, course..."
          value={search}
          onChange={(event) => {
            setPage(1);
            setSearch(event.target.value);
          }}
        />
        <Select
          value={status}
          onValueChange={(value) => {
            setPage(1);
            setStatus(value);
          }}
        >
          <SelectTrigger className="sm:w-48">
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

      {error && <p className="mb-4 text-sm text-[#FF5630]">{error}</p>}

      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_16px_rgba(145,158,171,0.08)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-[#637381]">
                  <Loader2 className="mx-auto size-5 animate-spin" />
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-[#637381]">
                  No payments found.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow
                  key={String(item.id)}
                  className="cursor-pointer"
                  onClick={() => void openItem(item)}
                >
                  <TableCell>
                    <p className="font-medium">{asText(item.merchantOrderId)}</p>
                    <p className="text-xs text-[#637381]">{asText(item.cipherbcOrderNo)}</p>
                  </TableCell>
                  <TableCell>
                    <p>{asText(item.userName)}</p>
                    <p className="text-xs text-[#637381]">{asText(item.userEmail)}</p>
                  </TableCell>
                  <TableCell>{asText(item.courseTitle)}</TableCell>
                  <TableCell>${asText(item.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(String(item.status))}>{asText(item.status)}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-[#637381]">
          Page {page} of {pages}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={page >= pages}
            onClick={() => setPage((value) => value + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Payment details</DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-[#637381]">Merchant order</p>
                  <p className="font-medium">{asText(selected.merchantOrderId)}</p>
                </div>
                <div>
                  <p className="text-[#637381]">CipherBC order</p>
                  <p className="font-medium">{asText(selected.cipherbcOrderNo)}</p>
                </div>
                <div>
                  <p className="text-[#637381]">Customer</p>
                  <p className="font-medium">{asText(selected.userEmail)}</p>
                </div>
                <div>
                  <p className="text-[#637381]">Course</p>
                  <p className="font-medium">{asText(selected.courseTitle)}</p>
                </div>
                <div>
                  <p className="text-[#637381]">Amount / Paid</p>
                  <p className="font-medium">
                    ${asText(selected.amount)} / ${asText(selected.paidAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-[#637381]">Status</p>
                  <p className="font-medium capitalize">{asText(selected.status)}</p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-[#637381]">Review status</p>
                <Select value={reviewStatus} onValueChange={setReviewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REVIEW_STATUSES.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className="mb-2 text-[#637381]">Admin notes</p>
                <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} />
              </div>

              <div>
                <p className="mb-2 font-medium">Security audit trail</p>
                <div className="max-h-48 space-y-2 overflow-y-auto rounded-xl bg-[#F4F6F8] p-3">
                  {events.length === 0 ? (
                    <p className="text-[#637381]">No events recorded.</p>
                  ) : (
                    events.map((event) => (
                      <div key={String(event.id)} className="rounded-lg bg-white p-3">
                        <p className="font-medium">{asText(event.eventType)}</p>
                        <p className="text-xs text-[#637381]">{formatDate(event.createdAt)}</p>
                        {typeof event.signatureValid === "boolean" && (
                          <p className="text-xs">
                            Signature valid: {event.signatureValid ? "yes" : "no"}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => void resyncItem()} disabled={saving}>
              <RefreshCw className="mr-2 size-4" />
              Sync from CipherBC
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
