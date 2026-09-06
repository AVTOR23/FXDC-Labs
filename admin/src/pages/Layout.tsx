import { NavLink, Navigate, Outlet, useLocation } from "react-router";
import {
  GraduationCap,
  Image,
  LayoutDashboard,
  LogOut,
  CreditCard,
  Mail,
  Users,
  Wrench,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import Logo from "@/components/Logo";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/users", label: "User list", icon: Users, end: false },
  { to: "/education", label: "Education forms", icon: GraduationCap, end: false },
  { to: "/trading-tools", label: "Trading tools forms", icon: Wrench, end: false },
  { to: "/contact", label: "Contact requests", icon: Mail, end: false },
  { to: "/payments", label: "CipherBC payments", icon: CreditCard, end: false },
  { to: "/media", label: "File manager", icon: Image, end: false },
];

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function Layout() {
  const { user, loading, isAdmin, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F6F8] text-[#637381]">
        Loading dashboard...
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-[#1C252E]">
      <aside className="fixed inset-y-0 left-0 hidden w-[280px] flex-col border-r border-black/5 bg-white px-4 py-6 lg:flex">
        <div className="mb-8 flex items-center gap-2.5 px-3">
          <Logo className="h-9 w-9" />
          <span className="text-lg font-bold">FXDC</span>
        </div>
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-[#919EAB]">
          Overview
        </p>
        <nav className="flex flex-1 flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#00A76F14] text-[#007867]"
                    : "text-[#637381] hover:bg-black/5"
                }`
              }
            >
              <link.icon className="size-5" />
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="rounded-2xl bg-[#F4F6F8] p-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-[#00A76F] text-sm font-bold text-white">
              {initials(user.name || user.email)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-[#637381]">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm text-[#637381] hover:bg-white"
            onClick={() => void logout()}
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="lg:pl-[280px]">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-black/5 bg-white/80 px-4 py-3 backdrop-blur lg:hidden">
          <span className="font-bold">FXDC Admin</span>
          <button type="button" className="text-sm text-[#637381]" onClick={() => void logout()}>
            Logout
          </button>
        </header>
        <nav className="flex gap-2 overflow-x-auto px-4 py-3 lg:hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3 py-1.5 text-sm ${
                  isActive ? "bg-[#00A76F14] text-[#007867]" : "text-[#637381]"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
