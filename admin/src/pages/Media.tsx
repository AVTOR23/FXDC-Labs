import { useEffect, useRef, useState } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest, formatDate } from "@/lib/api";

type MediaItem = {
  id: string;
  url: string;
  originalName: string;
  bytes: number;
  createdAt: string;
};

export default function AdminMedia() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await apiRequest<MediaItem[]>("/api/admin/media?limit=50");
      setItems(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const onUpload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      await apiRequest("/api/admin/media", { method: "POST", body });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const onDelete = async (id: string) => {
    if (!window.confirm("Delete this image from Cloudinary?")) return;
    try {
      await apiRequest(`/api/admin/media/${id}`, { method: "DELETE" });
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete");
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Media library</h1>
          <p className="mt-2 text-muted-foreground">Images are stored in Cloudinary.</p>
        </div>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void onUpload(file);
            }}
          />
          <Button onClick={() => inputRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
            Upload image
          </Button>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      {loading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading media...</p>
      ) : items.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No images uploaded yet.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-2xl border border-border bg-card">
              <img src={item.url} alt={item.originalName} className="h-40 w-full object-cover" />
              <div className="flex items-start justify-between gap-2 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.originalName}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</p>
                </div>
                <Button variant="ghost" size="icon-sm" onClick={() => void onDelete(item.id)}>
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
