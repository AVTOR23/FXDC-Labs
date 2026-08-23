const TICKER_ITEMS = ['Forex', 'Crypto', 'Web3', 'A.I', 'Blockchain'];

function TickerContent({ id }: { id: string }) {
  return (
    <>
      {TICKER_ITEMS.map((item) => (
        <span key={`${id}-${item}`} className="inline-flex items-center gap-8 mx-8">
          <span className="font-display font-bold text-lg sm:text-xl whitespace-nowrap text-foreground">
            {item}
          </span>
          <span className="text-foreground/60" aria-hidden="true">
            •
          </span>
        </span>
      ))}
    </>
  );
}

export default function ScrollingTicker() {
  return (
    <div className="relative overflow-hidden border-y border-border bg-background/90">
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
      <div className="relative py-3 sm:py-4 overflow-hidden">
        <div className="marquee-track flex w-max">
          <div className="flex shrink-0 items-center">
            <TickerContent id="a" />
          </div>
          <div className="flex shrink-0 items-center" aria-hidden="true">
            <TickerContent id="b" />
          </div>
        </div>
      </div>
    </div>
  );
}
