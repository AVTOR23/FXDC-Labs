import { Link } from "react-router";
import { Send } from "lucide-react";
import type { ReactNode } from "react";
import Logo from "@/react-app/components/Logo";

export const TELEGRAM_URL = "https://t.me/fxdclabscampus";

type AuthLayoutProps = {
  children: ReactNode;
  panelTitle: string;
  panelDescription: string;
  imageSrc?: string;
  imageAlt?: string;
};

export default function AuthLayout({
  children,
  panelTitle,
  panelDescription,
  imageSrc = "/form/trading-tools-form-illustration.png",
  imageAlt = "FXDC Labs trading tools illustration",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-card lg:flex lg:flex-col">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="absolute -right-20 top-0 h-80 w-80 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-accent/15 blur-[100px]" />

        <div className="relative z-10 p-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <Logo className="h-11 w-11" />
            <span className="font-display text-xl font-bold">
              FXDC <span className="text-primary">Labs</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 flex flex-1 items-center justify-center px-10">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="max-h-[min(42vh,320px)] w-full max-w-sm object-contain drop-shadow-2xl"
          />
        </div>

        <div className="relative z-10 space-y-6 p-10">
          <div>
            <h2 className="font-display text-3xl font-bold leading-tight">{panelTitle}</h2>
            <p className="mt-3 max-w-md text-muted-foreground">{panelDescription}</p>
          </div>

          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 px-5 py-4 transition-colors hover:bg-primary/20"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-primary/20 text-primary">
              <Send className="size-5" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-foreground">Join our Telegram</span>
              <span className="block text-xs text-muted-foreground">@fxdclabscampus</span>
            </span>
          </a>
        </div>
      </div>

      <div className="relative flex min-h-screen flex-col justify-center px-4 py-10 sm:px-8">
        <div className="absolute inset-0 grid-pattern opacity-40 lg:hidden" />
        <div className="relative mx-auto w-full max-w-md">
          <div className="mb-6 flex flex-col items-center text-center lg:items-start lg:text-left">
            <Logo className="mb-4 h-12 w-12 lg:hidden" />
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20 lg:hidden"
            >
              <Send className="size-4" />
              Join Telegram
            </a>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
