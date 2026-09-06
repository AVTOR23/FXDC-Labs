import { useEffect, useState } from "react";
import { Link } from "react-router";
import { GraduationCap, CreditCard, Image, Mail, Users, Wrench } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/lib/auth";

type StatusCounts = {
  total: number;
  pending: number;
  reviewed: number;
  contacted: number;
  closed: number;
};

type Stats = {
  users: { total: number; admins: number };
  education: StatusCounts;
  tradingTools: StatusCounts;
  contact: StatusCounts;
  media: { total: number };
  payments: { total: number; pendingReview: number };
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest<Stats>("/api/admin/stats")
      .then((response) => setStats(response.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load stats"));
  }, []);

  if (error) {
    return <p className="text-sm text-[#FF5630]">{error}</p>;
  }

  if (!stats) {
    return <p className="text-sm text-[#637381]">Loading dashboard...</p>;
  }

  const cards = [
    {
      title: "Total users",
      value: stats.users.total,
      detail: `${stats.users.admins} admins`,
      href: "/users",
      icon: Users,
      color: "bg-[#00A76F14] text-[#007867]",
    },
    {
      title: "Education forms",
      value: stats.education.total,
      detail: `${stats.education.pending} pending`,
      href: "/education",
      icon: GraduationCap,
      color: "bg-[#00B8D914] text-[#006C9C]",
    },
    {
      title: "Trading tools forms",
      value: stats.tradingTools.total,
      detail: `${stats.tradingTools.pending} pending`,
      href: "/trading-tools",
      icon: Wrench,
      color: "bg-[#FFAB0014] text-[#B76E00]",
    },
    {
      title: "Contact requests",
      value: stats.contact?.total ?? 0,
      detail: `${stats.contact?.pending ?? 0} pending`,
      href: "/contact",
      icon: Mail,
      color: "bg-[#FF563014] text-[#B71D18]",
    },
    {
      title: "Media files",
      value: stats.media.total,
      detail: "Cloudinary uploads",
      href: "/media",
      icon: Image,
      color: "bg-[#8E33FF14] text-[#5119B7]",
    },
    {
      title: "CipherBC payments",
      value: stats.payments.total,
      detail: `${stats.payments.pendingReview} need review`,
      href: "/payments",
      icon: CreditCard,
      color: "bg-[#22C55E14] text-[#118D57]",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm text-[#637381]">Hi, Welcome back</p>
        <h1 className="mt-1 text-3xl font-bold">{user?.name || "Admin"}</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.href}
            className="rounded-2xl bg-white p-6 shadow-[0_8px_16px_rgba(145,158,171,0.08)] transition hover:-translate-y-0.5"
          >
            <div className={`mb-6 flex size-12 items-center justify-center rounded-2xl ${card.color}`}>
              <card.icon className="size-6" />
            </div>
            <p className="text-3xl font-bold">{card.value}</p>
            <p className="mt-1 text-sm font-medium text-[#1C252E]">{card.title}</p>
            <p className="mt-1 text-xs text-[#637381]">{card.detail}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
