import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import Navbar from "@/react-app/components/Navbar";
import { Button } from "@/react-app/components/ui/button";
import { fetchPaymentStatus } from "@/react-app/lib/payments";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order") ?? "";
  const [loading, setLoading] = useState(Boolean(orderId));
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!orderId) return;

    fetchPaymentStatus(orderId)
      .then((payment) => setStatus(payment.status))
      .catch(() => setStatus("pending"))
      .finally(() => setLoading(false));
  }, [orderId]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto size-16 text-primary" />
        <h1 className="mt-6 font-display text-3xl font-bold">Payment received</h1>
        <p className="mt-3 text-muted-foreground">
          {loading
            ? "Confirming your payment with CipherBC..."
            : status === "completed" || status === "overpayment"
              ? "Your course access has been activated."
              : "Your payment is being processed. This can take a few minutes on-chain."}
        </p>
        {loading && <Loader2 className="mx-auto mt-6 size-6 animate-spin text-primary" />}
        {orderId && (
          <p className="mt-4 text-xs text-muted-foreground">Order: {orderId}</p>
        )}
        <Button asChild className="mt-8">
          <Link to="/">Back to home</Link>
        </Button>
      </main>
    </div>
  );
}
