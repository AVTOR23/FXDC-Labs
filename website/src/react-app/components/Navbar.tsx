import { Link, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/react-app/components/ui/collapsible";

const cryptoLinks = [
  { label: "Buy / Sell Crypto", to: "/buy-sell-crypto" },
  { label: "OTC Crypto", to: "/otc-crypto" },
  { label: "Token Listing", to: "/token-listing" },
  { label: "Crypto Airdrop", to: "/crypto-airdrop" },
  { label: "Web3 Sandbox", to: "/web3-sandbox" },
] as const;

const discoverLinks = [
  { label: "MarketPlace", to: "/marketplace" },
  { label: "Leader Board", to: "/leaderboard" },
  { label: "Community Feed", to: "/community-feed" },
] as const;

const navItems = [
  { kind: "link" as const, label: "Courses", href: "/#courses", id: "courses" },
  { kind: "link" as const, label: "Features", href: "/#features", id: "features" },
  { kind: "menu" as const, label: "Crypto as Service", links: cryptoLinks },
  { kind: "menu" as const, label: "Discover", links: discoverLinks },
  { kind: "route" as const, label: "Contact", to: "/contact" },
];

type NavHashLink = Extract<(typeof navItems)[number], { kind: "link" }>;
type NavRoute = Extract<(typeof navItems)[number], { kind: "route" }>;
type MenuLink = { label: string; to: string };
type NavItem = (typeof navItems)[number];

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

function isHashActive(link: NavHashLink, pathname: string, hash: string) {
  return pathname === "/" && hash === `#${link.id}`;
}

function navItemClass(active: boolean, className?: string) {
  return cn(
    "text-sm font-medium transition-colors px-3 py-1.5 rounded-md",
    active
      ? "bg-emerald-300/90 text-black"
      : "text-muted-foreground hover:text-foreground",
    className
  );
}

function isMenuActive(links: readonly MenuLink[], pathname: string) {
  return links.some((item) => pathname === item.to);
}

function NavHashLinkItem({
  link,
  active,
  onNavigate,
  className,
}: {
  link: NavHashLink;
  active: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <a href={link.href} onClick={onNavigate} className={navItemClass(active, className)}>
      {link.label}
    </a>
  );
}

function NavRouteItem({
  link,
  active,
  onNavigate,
  className,
}: {
  link: NavRoute;
  active: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <Link to={link.to} onClick={onNavigate} className={navItemClass(active, className)}>
      {link.label}
    </Link>
  );
}

function renderNavItem({
  item,
  pathname,
  hash,
  onNavigate,
  className,
  mobile,
}: {
  item: NavItem;
  pathname: string;
  hash: string;
  onNavigate?: () => void;
  className?: string;
  mobile?: boolean;
}) {
  if (item.kind === "menu") {
    return mobile && onNavigate ? (
      <MobileNavDropdown
        key={item.label}
        label={item.label}
        links={item.links}
        pathname={pathname}
        onNavigate={onNavigate}
      />
    ) : (
      <NavDropdown key={item.label} label={item.label} links={item.links} pathname={pathname} />
    );
  }

  if (item.kind === "route") {
    return (
      <NavRouteItem
        key={item.label}
        link={item}
        active={pathname === item.to}
        onNavigate={onNavigate}
        className={className}
      />
    );
  }

  return (
    <NavHashLinkItem
      key={item.label}
      link={item}
      active={isHashActive(item, pathname, hash)}
      onNavigate={onNavigate}
      className={className}
    />
  );
}

function NavDropdown({
  label,
  links,
  pathname,
  onNavigate,
}: {
  label: string;
  links: readonly MenuLink[];
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = isMenuActive(links, pathname);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "group inline-flex items-center gap-1 text-sm font-medium transition-colors px-3 py-1.5 rounded-md outline-none",
          active
            ? "bg-emerald-300/90 text-black"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {label}
        <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {links.map((item) => (
          <DropdownMenuItem key={item.to} asChild>
            <Link
              to={item.to}
              onClick={onNavigate}
              className={cn(pathname === item.to && "bg-accent")}
            >
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileNavDropdown({
  label,
  links,
  pathname,
  onNavigate,
}: {
  label: string;
  links: readonly MenuLink[];
  pathname: string;
  onNavigate: () => void;
}) {
  const active = isMenuActive(links, pathname);

  return (
    <Collapsible defaultOpen={active}>
      <CollapsibleTrigger
        className={cn(
          "group flex w-fit items-center gap-1 text-sm font-medium transition-colors px-3 py-1.5 rounded-md",
          active
            ? "bg-emerald-300/90 text-black"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {label}
        <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-1 ml-3 space-y-1 border-l border-border pl-3">
        {links.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "block w-fit text-sm font-medium transition-colors px-3 py-1.5 rounded-md",
              pathname === item.to
                ? "bg-emerald-300/90 text-black"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
      </CollapsibleContent>
    </Collapsible>
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
            {navItems.map((item) =>
              renderNavItem({ item, pathname, hash })
            )}
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
                  <Link to="/sign-up">Join Waitlist</Link>
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
            {navItems.map((item) =>
              renderNavItem({
                item,
                pathname,
                hash,
                onNavigate: closeMenu,
                className: "block w-fit",
                mobile: true,
              })
            )}
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
                      Join Waitlist
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
