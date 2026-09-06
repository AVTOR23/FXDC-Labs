import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import { ArrowRight, Bitcoin, Loader2, ShieldCheck } from "lucide-react";
import Navbar from "@/react-app/components/Navbar";
import { Button } from "@/react-app/components/ui/button";
import { useAuth } from "@/react-app/lib/auth";
import { createPaymentOrder, fetchCourses, type CourseCatalogItem } from "@/react-app/lib/payments";

export default function Checkout() {
  const { courseId = "" } = useParams();
  const { user, loading: authLoading } = useAuth();
  const [course, setCourse] = useState<CourseCatalogItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourses()
      .then((courses) => setCourse(courses.find((item) => item.id === courseId) ?? null))
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load course"))
      .finally(() => setLoading(false));
  }, [courseId]);

  if (!authLoading && !user) {
    return <Navigate to="/sign-in" replace state={{ from: `/checkout/${courseId}` }} />;
  }

  const startPayment = async () => {
    if (!course) return;
    setSubmitting(true);
    setError("");
    try {
      const order = await createPaymentOrder(course.id);
      window.location.href = order.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start payment");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
            <Bitcoin className="size-4" />
            Secure crypto checkout via CipherBC
          </div>

          {loading || authLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading checkout...
            </div>
          ) : !course ? (
            <div>
              <h1 className="font-display text-2xl font-bold">Course not found</h1>
              <p className="mt-2 text-muted-foreground">This course is not available for purchase.</p>
              <Button asChild className="mt-6">
                <Link to="/#courses">Back to courses</Link>
              </Button>
            </div>
          ) : (
            <>
              <h1 className="font-display text-3xl font-bold">{course.title}</h1>
              <p className="mt-2 text-muted-foreground">{course.subtitle}</p>

              <div className="mt-8 rounded-xl bg-secondary/50 p-6">
                <p className="text-sm text-muted-foreground">Total due</p>
                <p className="font-display text-4xl font-bold">${course.amount}</p>
                <p className="mt-2 text-xs text-muted-foreground uppercase">{course.currency}</p>
              </div>

              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                  Payment is processed on CipherBC hosted cashier with RSA-signed API requests.
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                  You will choose crypto network and pay the exact amount shown on the cashier.
                </li>
              </ul>

              {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

              <Button
                className="mt-8 w-full glow-primary"
                size="lg"
                disabled={submitting}
                onClick={() => void startPayment()}
              >
                {submitting ? <Loader2 className="animate-spin" /> : null}
                Pay with Crypto
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
