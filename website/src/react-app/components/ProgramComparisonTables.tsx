import { Award, Check, Star } from "lucide-react";
import {
  FAME_LEVELS,
  PROGRAM_TRACKS,
  type FeatureValue,
} from "@/react-app/data/fame-programs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/react-app/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/react-app/components/ui/tabs";
import { cn } from "@/react-app/lib/utils";

function FeatureCell({ value }: { value: FeatureValue | null }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center justify-center rounded-full bg-primary/15 p-1 text-primary">
        <Check className="size-3.5" />
        <span className="sr-only">Yes</span>
      </span>
    );
  }

  if (typeof value === "string") {
    return <span className="text-xs text-foreground/90 sm:text-sm">{value}</span>;
  }

  return <span className="text-muted-foreground/50">—</span>;
}

export default function ProgramComparisonTables() {
  return (
    <div className="mt-20 lg:mt-24">
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">F-A-M-E Program</p>
        <h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">What’s included in each path</h3>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Compare Foundations, Advanced, Masterclass, and Enhancement across both training tracks.
        </p>
      </div>

      <Tabs defaultValue="forex" className="gap-6">
        <TabsList className="mx-auto h-auto w-full max-w-3xl flex-col sm:flex-row">
          {PROGRAM_TRACKS.map((track) => (
            <TabsTrigger
              key={track.id}
              value={track.id}
              className="h-auto min-h-10 flex-1 whitespace-normal px-4 py-2 text-center"
            >
              <span className="flex flex-col items-center gap-0.5">
                <span>{track.title}</span>
                <span className="text-[10px] font-normal text-muted-foreground">{track.subtitle}</span>
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {PROGRAM_TRACKS.map((track) => (
          <TabsContent key={track.id} value={track.id}>
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/40 hover:bg-secondary/40">
                    <TableHead className="min-w-[220px] font-semibold">Features</TableHead>
                    {FAME_LEVELS.map((level) => (
                      <TableHead key={level.id} className="min-w-[140px] text-center">
                        <span className="flex flex-col items-center gap-1">
                          <span className="flex items-center gap-0.5 text-accent">
                            {Array.from({ length: level.stars }).map((_, index) => (
                              <Star key={index} className="size-3 fill-current" />
                            ))}
                          </span>
                          <span>{level.label}</span>
                        </span>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {track.features.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell className="max-w-[280px] whitespace-normal font-medium leading-snug">
                        {row.name}
                      </TableCell>
                      {FAME_LEVELS.map((level) => (
                        <TableCell
                          key={level.id}
                          className={cn("text-center whitespace-normal")}
                        >
                          <FeatureCell value={row.values[level.id]} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-8 rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center sm:p-8">
        <div className="mb-3 inline-flex items-center justify-center rounded-full bg-primary/15 p-3 text-primary">
          <Award className="size-6" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Certification Program</p>
        <h4 className="mt-2 font-display text-xl font-bold">Earn your FXDC Labs credential</h4>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          Digital Certificate · Score Rank · Eligible NFT Certificate Sponsor
        </p>
      </div>
    </div>
  );
}
