import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Check, Loader2 } from "lucide-react";
import Navbar from "@/react-app/components/Navbar";
import { Button } from "@/react-app/components/ui/button";
import { fetchPaymentStatus, type PaymentRecord } from "@/react-app/lib/payments";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order") ?? "";
  const [loading, setLoading] = useState(Boolean(orderId));
  const [payment, setPayment] = useState<PaymentRecord | null>(null);

  useEffect(() => {
    if (!orderId) return;

    fetchPaymentStatus(orderId)
      .then((item) => setPayment(item))
      .catch(() => setPayment(null))
      .finally(() => setLoading(false));
  }, [orderId]);

  const amount = payment?.paidAmount || payment?.amount;
  const applicationHref = orderId
    ? `/payments/application?order=${encodeURIComponent(orderId)}`
    : "/payments/application";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Step 1 of 3 · Payment success
        </p>

        <div className="relative mx-auto mt-8 flex size-28 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          <span className="absolute inset-2 rounded-full bg-primary/10" />
          <span className="relative flex size-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_40px_hsl(160_84%_39%/0.45)]">
            <Check className="size-10" strokeWidth={3} />
          </span>
        </div>

        <h1 className="mt-8 font-display text-3xl font-bold sm:text-4xl">Payment Successful!</h1>
        <p className="mt-4 text-sm text-muted-foreground sm:text-base">
          {loading
            ? "Confirming your payment with CipherBC..."
            : amount
              ? `Your payment of $${amount} has been processed and our team will verify your payment.`
              : "Your payment has been processed and our team will verify your payment."}{" "}
          {!loading &&
            "To complete your application, please review your recap and select your schedule appointment time."}
        </p>

        {loading && <Loader2 className="mx-auto mt-6 size-6 animate-spin text-primary" />}

        {orderId && (
          <p className="mt-4 text-xs text-muted-foreground">Order: {orderId}</p>
        )}

        <Button size="lg" className="mt-8 min-w-56 glow-primary font-bold uppercase tracking-wide" asChild>
          <Link to={applicationHref}>Payment Successful!</Link>
        </Button>
      </main>
    </div>
  );
}
