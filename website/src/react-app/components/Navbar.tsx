import { Link, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import Logo from "@/react-app/components/Logo";
import { useAuth } from "@/react-app/lib/auth";
import { cn } from "@/react-app/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/react-app/components/ui/dropdown-menu";

const navLinks = [
  { label: "Courses", href: "/#courses", id: "courses" },
  { label: "Features", href: "/#features", id: "features" },
  { label: "Crypto as Service", to: "/trading-tools", id: "trading-tools" },
  { label: "Contact", href: "/#contact", id: "contact" },
  { label: "Discover", to: "/education", id: "education" },
] as const;

type NavLink = (typeof navLinks)[number];

const ADMIN_DASHBOARD_URL =
  import.meta.env.VITE_ADMIN_URL ??
  (import.meta.env.DEV ? "http://localhost:5174" : "https://fxdc-camp.vercel.app");

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function isLinkActive(link: NavLink, pathname: string, hash: string) {
  if ("to" in link) {
    return pathname === link.to;
  }

  return pathname === "/" && hash === `#${link.id}`;
}

function NavLinkItem({
  link,
  active,
  onNavigate,
  className,
}: {
  link: NavLink;
  active: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  const classes = cn(
    "text-sm font-medium transition-colors px-3 py-1.5 rounded-md",
    active
      ? "bg-emerald-300/90 text-black"
      : "text-muted-foreground hover:text-foreground",
    className
  );

  if ("to" in link) {
    return (
      <Link to={link.to} className={classes} onClick={onNavigate}>
        {link.label}
      </Link>
    );
  }

  return (
    <a href={link.href} className={classes} onClick={onNavigate}>
      {link.label}
    </a>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, logout, loading } = useAuth();
  const { pathname } = useLocation();
  const [hash, setHash] = useState(() =>
    typeof window !== "undefined" ? window.location.hash : ""
  );

  useEffect(() => {
    setHash(window.location.hash);
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [pathname]);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <Logo className="h-10 w-10 lg:h-11 lg:w-11" />
            <span className="font-display font-bold text-xl tracking-tight">
              FXDC <span className="text-primary">Labs</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            {navLinks.map((link) => (
              <NavLinkItem
                key={link.label}
                link={link}
                active={isLinkActive(link, pathname, hash)}
              />
            ))}
          </div>

          <div className="hidden md:flex items-center gap-5 lg:gap-6">
            {loading ? null : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-border px-2 py-1">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                    {initials(user.name || user.email)}
                  </span>
                  <span className="pr-2 text-sm font-medium">{user.name.split(" ")[0]}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <a href={ADMIN_DASHBOARD_URL}>Admin dashboard</a>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/education">Education form</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/trading-tools">Trading tools form</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => void logout()}>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  to="/sign-up"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Affiliate
                </Link>
                <Link
                  to="/sign-in"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
                <Button size="sm" className="rounded-full px-5 glow-primary" asChild>
                  <Link to="/sign-up">Start Learning</Link>
                </Button>
              </>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-card border-b border-border">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <NavLinkItem
                key={link.label}
                link={link}
                active={isLinkActive(link, pathname, hash)}
                onNavigate={closeMenu}
                className="block w-fit"
              />
            ))}
            <div className="pt-4 flex flex-col gap-2 border-t border-border">
              {user ? (
                <>
                  {isAdmin && (
                    <Button variant="ghost" size="sm" className="w-full justify-center" asChild>
                      <a href={ADMIN_DASHBOARD_URL}>Admin dashboard</a>
                    </Button>
                  )}
                  <Button size="sm" className="w-full justify-center" onClick={() => void logout()}>
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" className="w-full justify-center" asChild>
                    <Link to="/sign-up" onClick={closeMenu}>
                      Affiliate
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-center" asChild>
                    <Link to="/sign-in" onClick={closeMenu}>
                      Sign In
                    </Link>
                  </Button>
                  <Button size="sm" className="w-full justify-center rounded-full glow-primary" asChild>
                    <Link to="/sign-up" onClick={closeMenu}>
                      Start Learning
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
