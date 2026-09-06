import { FormEvent, useState } from "react";
import { Link } from "react-router";
import { Check, Loader2 } from "lucide-react";
import Navbar from "@/react-app/components/Navbar";
import { Button } from "@/react-app/components/ui/button";
import { ContactSubmissionSchema } from "@/shared/types";
import { apiRequest } from "@/react-app/lib/api";
import { cn } from "@/react-app/lib/utils";

const LOCATIONS = [
  {
    title: "Forex Courses London",
    address:
      "Financial Markets Online, Level 5, St Claire House, 30-33 Minories, London, City of London, EC3N 1DD",
    phone: "+44 (0) 20 3982 6284",
    email: "info@financialmarketsonline.com",
    directions:
      "https://www.google.com/maps/search/?api=1&query=Level+5+St+Claire+House+30-33+Minories+London+EC3N+1DD",
  },
  {
    title: "Forex Courses Manchester",
    phone: "+44 (0) 20 3982 6284",
    email: "info@financialmarketsonline.com",
  },
  {
    title: "Forex Courses Dubai",
    address:
      "Financial Markets Trading Training Institute DMCC, Unit No: 30-01-BA1553, DMCC Business Centre JLT, Dubai",
    email: "info@financialmarketsonline.com",
  },
];

const INITIAL = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

const fieldClass =
  "h-12 w-full rounded-none border-0 bg-neutral-200 px-4 text-sm text-neutral-900 placeholder:text-neutral-500 outline-none focus-visible:ring-2 focus-visible:ring-primary";

export default function Contact() {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const onChange = (field: keyof typeof INITIAL, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitError("");

    const parsed = ContactSubmissionSchema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "");
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setSubmitting(true);
    try {
      await apiRequest("/api/contact-submissions", {
        method: "POST",
        body: JSON.stringify(parsed.data),
      });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not submit the form.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 lg:pt-20">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            Financial Markets Online
          </p>
          <h1 className="mt-3 font-display text-5xl font-bold uppercase tracking-wide sm:text-6xl">
            Contact
          </h1>

          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_minmax(0,420px)] lg:gap-16">
            <div className="space-y-10">
              {LOCATIONS.map((location) => (
                <section key={location.title}>
                  <h2 className="font-display text-lg font-bold uppercase tracking-wide text-primary">
                    {location.title}
                  </h2>
                  {location.address && (
                    <p className="mt-3 max-w-xl text-sm leading-6 text-foreground/90">{location.address}</p>
                  )}
                  {location.phone && (
                    <p className="mt-3 text-sm">
                      <span className="font-semibold text-primary">T:</span>{" "}
                      <a href={`tel:${location.phone.replace(/\s/g, "")}`} className="hover:underline">
                        {location.phone}
                      </a>
                    </p>
                  )}
                  <p className="mt-2 text-sm">
                    <span className="font-semibold text-primary">E:</span>{" "}
                    <a href={`mailto:${location.email}`} className="hover:underline">
                      {location.email}
                    </a>
                  </p>
                  {location.directions && (
                    <a
                      href={location.directions}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex border border-foreground px-6 py-2 text-xs font-semibold uppercase tracking-widest hover:bg-foreground hover:text-background"
                    >
                      Directions
                    </a>
                  )}
                </section>
              ))}
            </div>

            <div>
              {submitted ? (
                <div className="border border-border bg-card p-8 text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Check className="size-6" />
                  </div>
                  <h2 className="mt-5 font-display text-2xl font-bold uppercase">Request received</h2>
                  <p className="mt-3 text-sm text-muted-foreground">
                    A member of our team will contact you shortly.
                  </p>
                  <Button asChild className="mt-8 rounded-none uppercase tracking-widest">
                    <Link to="/">Back to home</Link>
                  </Button>
                </div>
              ) : (
                <form onSubmit={(event) => void onSubmit(event)} noValidate>
                  <h2 className="font-display text-3xl font-bold uppercase leading-tight sm:text-4xl">
                    Request a Call Back
                  </h2>
                  <p className="mt-2 text-sm text-foreground/80">A member of our team will contact you</p>

                  <label className="mt-8 block text-xs font-semibold uppercase tracking-widest">Name</label>
                  <input
                    value={form.name}
                    onChange={(event) => onChange("name", event.target.value)}
                    placeholder="ENTER NAME"
                    className={cn(fieldClass, "mt-2", errors.name && "ring-2 ring-destructive")}
                    autoComplete="name"
                  />
                  {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}

                  <label className="mt-5 block text-xs font-semibold uppercase tracking-widest">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => onChange("email", event.target.value)}
                    placeholder="ENTER EMAIL"
                    className={cn(fieldClass, "mt-2", errors.email && "ring-2 ring-destructive")}
                    autoComplete="email"
                  />
                  {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}

                  <label className="mt-5 block text-xs font-semibold uppercase tracking-widest">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) => onChange("phone", event.target.value)}
                    placeholder="ENTER NUMBER"
                    className={cn(fieldClass, "mt-2", errors.phone && "ring-2 ring-destructive")}
                    autoComplete="tel"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}

                  <label className="mt-5 block text-xs font-semibold uppercase tracking-widest">Message</label>
                  <textarea
                    value={form.message}
                    onChange={(event) => onChange("message", event.target.value)}
                    placeholder="ENTER MESSAGE"
                    rows={5}
                    className={cn(
                      "mt-2 w-full resize-none rounded-none border-0 bg-neutral-200 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-500 outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      errors.message && "ring-2 ring-destructive"
                    )}
                  />
                  {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}

                  {submitError && <p className="mt-4 text-sm text-destructive">{submitError}</p>}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-6 inline-flex h-12 min-w-40 items-center justify-center bg-primary px-8 text-sm font-bold uppercase tracking-widest text-primary-foreground disabled:opacity-60"
                  >
                    {submitting ? <Loader2 className="size-5 animate-spin" /> : "Submit"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
