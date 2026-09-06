import { Link, useSearchParams } from "react-router";
import { AlertTriangle } from "lucide-react";
import Navbar from "@/react-app/components/Navbar";
import { Button } from "@/react-app/components/ui/button";

export default function PaymentFailed() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order") ?? "";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-20 text-center">
        <AlertTriangle className="mx-auto size-16 text-destructive" />
        <h1 className="mt-6 font-display text-3xl font-bold">Payment not completed</h1>
        <p className="mt-3 text-muted-foreground">
          The payment was cancelled, expired, or needs review. You can try again from the courses page.
        </p>
        {orderId && (
          <p className="mt-4 text-xs text-muted-foreground">Order: {orderId}</p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="outline">
            <Link to="/#courses">Browse courses</Link>
          </Button>
          {orderId ? (
            <Button asChild>
              <Link to={`/payments/status/${orderId}`}>Check status</Link>
            </Button>
          ) : null}
        </div>
      </main>
    </div>
  );
}
