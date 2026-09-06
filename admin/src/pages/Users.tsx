import { useEffect, useMemo, useState } from "react";
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
import { apiRequest, formatDate } from "@/lib/api";
import type { AuthUser } from "@/lib/auth";

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function AdminUsers() {
  const [items, setItems] = useState<AuthUser[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<AuthUser | null>(null);
  const [saving, setSaving] = useState(false);

  const query = useMemo(() => {
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search.trim()) params.set("search", search.trim());
    if (role !== "all") params.set("role", role);
    if (status !== "all") params.set("status", status);
    return params.toString();
  }, [page, search, role, status]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await apiRequest<AuthUser[]>(`/api/admin/users?${query}`);
      setItems(response.data);
      setPages(response.meta?.pages ?? 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const saveUser = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const response = await apiRequest<AuthUser>(`/api/admin/users/${selected.id}`, {
        method: "PATCH",
        body: JSON.stringify({ role: selected.role, status: selected.status }),
      });
      setSelected(response.data);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-[#637381]">User</p>
        <h1 className="text-3xl font-bold">List</h1>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-[0_8px_16px_rgba(145,158,171,0.08)] sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Search name, username, email or contact"
            value={search}
            onChange={(event) => {
              setPage(1);
              setSearch(event.target.value);
            }}
            className="rounded-xl bg-[#F4F6F8] sm:max-w-xs"
          />
          <Select
            value={role}
            onValueChange={(value) => {
              setPage(1);
              setRole(value);
            }}
          >
            <SelectTrigger className="w-full rounded-xl sm:w-36">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="superadmin">Super admin</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={status}
            onValueChange={(value) => {
              setPage(1);
              setStatus(value);
            }}
          >
            <SelectTrigger className="w-full rounded-xl sm:w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error && <p className="mb-3 text-sm text-[#FF5630]">{error}</p>}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Telegram / Whatsapp</TableHead>
              <TableHead>Referral</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-[#637381]">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-[#637381]">
                  No users yet
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow
                  key={item.id}
                  className="cursor-pointer"
                  onClick={() => setSelected(item)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#00A76F14] text-xs font-bold text-[#007867]">
                        {item.avatarUrl ? (
                          <img src={item.avatarUrl} alt="" className="size-10 rounded-full object-cover" />
                        ) : (
                          initials(item.name || item.email)
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-xs text-[#637381]">
                          {item.username ? `@${item.username}` : "—"} · {item.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{item.telegramWhatsapp || item.phone || "—"}</TableCell>
                  <TableCell>{item.referralUsername || "—"}</TableCell>
                  <TableCell className="capitalize">{item.role}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === "active" ? "default" : "destructive"}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="mt-4 flex items-center justify-end gap-2">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
            Previous
          </Button>
          <span className="text-sm text-[#637381]">
            Page {page} of {pages}
          </span>
          <Button variant="outline" disabled={page >= pages} onClick={() => setPage((current) => current + 1)}>
            Next
          </Button>
        </div>
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit user</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold">{selected.name}</p>
                <p className="text-sm text-[#637381]">{selected.email}</p>
                <p className="mt-2 text-sm">
                  <span className="text-[#637381]">Username:</span> {selected.username || "—"}
                </p>
                <p className="text-sm">
                  <span className="text-[#637381]">Telegram / Whatsapp:</span>{" "}
                  {selected.telegramWhatsapp || selected.phone || "—"}
                </p>
                <p className="text-sm">
                  <span className="text-[#637381]">Referral Username:</span>{" "}
                  {selected.referralUsername || "—"}
                </p>
              </div>
              <Select
                value={selected.role}
                onValueChange={(value) =>
                  setSelected({ ...selected, role: value as AuthUser["role"] })
                }
              >
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="superadmin">Super admin</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={selected.status}
                onValueChange={(value) =>
                  setSelected({ ...selected, status: value as AuthUser["status"] })
                }
              >
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => void saveUser()} disabled={saving}>
              {saving && <Loader2 className="animate-spin" />}
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
