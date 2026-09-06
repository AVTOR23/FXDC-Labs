import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Loader2, RefreshCw } from "lucide-react";
import Navbar from "@/react-app/components/Navbar";
import { Button } from "@/react-app/components/ui/button";
import { fetchPaymentStatus, type PaymentRecord } from "@/react-app/lib/payments";

export default function PaymentStatus() {
  const { merchantOrderId = "" } = useParams();
  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    if (!merchantOrderId) return;
    setLoading(true);
    setError("");
    try {
      setPayment(await fetchPaymentStatus(merchantOrderId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load payment status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merchantOrderId]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-2xl border border-border bg-card p-8">
          <h1 className="font-display text-2xl font-bold">Payment status</h1>
          <p className="mt-2 text-sm text-muted-foreground">Order {merchantOrderId}</p>

          {loading ? (
            <div className="mt-8 flex items-center gap-2 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Syncing with CipherBC...
            </div>
          ) : error ? (
            <p className="mt-8 text-sm text-destructive">{error}</p>
          ) : payment ? (
            <dl className="mt-8 space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Course</dt>
                <dd className="font-medium">{payment.courseTitle}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Amount</dt>
                <dd className="font-medium">
                  ${payment.amount} {payment.currency.toUpperCase()}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Status</dt>
                <dd className="font-medium capitalize">{payment.status}</dd>
              </div>
              {payment.paidAmount ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Paid</dt>
                  <dd className="font-medium">${payment.paidAmount}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}

          <div className="mt-8 flex gap-3">
            <Button variant="outline" onClick={() => void load()} disabled={loading}>
              <RefreshCw className="mr-2 size-4" />
              Refresh
            </Button>
            <Button asChild>
              <Link to="/">Home</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
