import { Link, Navigate } from "react-router";
import {
  ArrowRight,
  Bell,
  BookOpen,
  Bot,
  Briefcase,
  Crown,
  Lock,
  Trophy,
} from "lucide-react";
import Navbar from "@/react-app/components/Navbar";
import { Button } from "@/react-app/components/ui/button";
import { useAuth } from "@/react-app/lib/auth";

const courses = [
  {
    id: "foundation",
    icon: BookOpen,
    title: "Foundations",
    subtitle: "Master the Fundamentals",
    price: "$25",
    href: "/checkout/foundation",
  },
  {
    id: "advance",
    icon: Trophy,
    title: "Advanced",
    subtitle: "Institutional Precision",
    price: "$225",
    href: "/checkout/advance",
  },
  {
    id: "masterclass",
    icon: Crown,
    title: "Masterclass",
    subtitle: "Advanced Strategies & Methods",
    price: "$885",
    href: "/checkout/masterclass",
  },
];

const tools = [
  {
    icon: Bell,
    title: "Trading Signals",
    subtitle: "Daily alerts and VIP entries",
    href: "/checkout/advance",
  },
  {
    icon: Bot,
    title: "Automated Trading",
    subtitle: "CEX-MT5 algorithmic setups",
    href: "/checkout/masterclass",
  },
  {
    icon: Briefcase,
    title: "Account Management",
    subtitle: "Professional AUM access",
    href: "/checkout/masterclass",
  },
];

export default function Account() {
  const { user, loading } = useAuth();

  if (!loading && !user) {
    return <Navigate to="/sign-in" replace state={{ from: "/account" }} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Inside user dashboard
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
          Courses & Tools
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Choose a program or tool to continue. You&apos;ll go directly to CipherBC checkout — no
          application form on this path.
        </p>

        <section className="mt-12">
          <h2 className="font-display text-xl font-bold">Courses</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {courses.map((course) => (
              <div key={course.id} className="flex flex-col rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <course.icon className="size-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold">{course.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{course.subtitle}</p>
                <p className="mt-6 font-display text-3xl font-bold">{course.price}</p>
                <Button className="mt-6 w-full glow-primary" asChild>
                  <Link to={course.href}>
                    Checkout
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-xl font-bold">Tools</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {tools.map((tool) => (
              <div key={tool.title} className="flex flex-col rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-accent/15">
                  <tool.icon className="size-6 text-accent" />
                </div>
                <h3 className="font-display text-xl font-bold">{tool.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{tool.subtitle}</p>
                <Button className="mt-6 w-full" variant="outline" asChild>
                  <Link to={tool.href}>
                    Checkout
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-10 rounded-2xl border border-border bg-card/60 p-6 text-sm text-muted-foreground">
          <Lock className="mb-2 size-4" />
          Enhancement is coming soon. After payment you&apos;ll see a recap of your workshop details —
          not another form to fill.
        </div>
      </main>
    </div>
  );
}
