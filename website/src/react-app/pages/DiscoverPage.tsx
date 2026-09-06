import { Link, useLocation } from "react-router";
import Navbar from "@/react-app/components/Navbar";
import { Button } from "@/react-app/components/ui/button";

const PAGE_COPY: Record<string, { section: string; title: string; description: string }> = {
  "/marketplace": {
    section: "Discover",
    title: "MarketPlace",
    description: "Browse tools, signals, and trading products from the FXDC community.",
  },
  "/leaderboard": {
    section: "Discover",
    title: "Leader Board",
    description: "See how traders rank and track top performance across the camp.",
  },
  "/community-feed": {
    section: "Discover",
    title: "Community Feed",
    description: "Follow updates, ideas, and conversations from the FXDC community.",
  },
  "/buy-sell-crypto": {
    section: "Crypto as Service",
    title: "Buy / Sell Crypto",
    description: "Trade crypto with a simple buy and sell flow built for the FXDC community.",
  },
  "/otc-crypto": {
    section: "Crypto as Service",
    title: "OTC Crypto",
    description: "Handle larger crypto trades with over-the-counter support.",
  },
  "/token-listing": {
    section: "Crypto as Service",
    title: "Token Listing",
    description: "Apply to list and launch tokens through FXDC Labs.",
  },
  "/crypto-airdrop": {
    section: "Crypto as Service",
    title: "Crypto Airdrop",
    description: "Discover and join community airdrop campaigns.",
  },
  "/web3-sandbox": {
    section: "Crypto as Service",
    title: "Web3 Sandbox",
    description: "Explore and test Web3 tools in a safe sandbox environment.",
  },
};

export default function DiscoverPage() {
  const { pathname } = useLocation();
  const copy = PAGE_COPY[pathname] ?? {
    section: "Discover",
    title: "Discover",
    description: "Explore FXDC Labs.",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">{copy.section}</p>
        <h1 className="mt-3 font-display text-3xl font-bold">{copy.title}</h1>
        <p className="mt-3 text-muted-foreground">{copy.description}</p>
        <Button asChild className="mt-8">
          <Link to="/">Back to home</Link>
        </Button>
      </main>
    </div>
  );
}
