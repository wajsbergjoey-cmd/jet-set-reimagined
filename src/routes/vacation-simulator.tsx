import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, CloudRain, Clock, RotateCcw, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import mauiImage from "@/assets/maui.jpg";
import amalfiImage from "@/assets/amalfi.jpg";
import cancunImage from "@/assets/cancun.jpg";
import turksImage from "@/assets/turks-caicos.jpg";
import {
  DESTINATIONS, SAMPLE, budgetBreakdown, buildItinerary, countKinds, normalizeAllocation,
  type Allocation, type DestinationId, type Pace, type Priority, type Scenario,
} from "@/lib/vacation-simulator";

export const Route = createFileRoute("/vacation-simulator")({
  head: () => ({
    meta: [
      { title: "Vacation Simulator | Jet Set Travel Co." },
      { name: "description", content: "Preview a day-by-day vacation in Maui, Amalfi, Cancun or Turks & Caicos. Change the pace, budget split and what-ifs, then ask Joey to review it." },
      { property: "og:title", content: "Vacation Simulator | Jet Set Travel Co." },
      { property: "og:description", content: "Try a visual day-by-day vacation preview and test what-if scenarios before you plan with Joey." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Simulator,
});

const IMAGES: Record<DestinationId, string> = { maui: mauiImage, amalfi: amalfiImage, cancun: cancunImage, turks: turksImage };
const PRIORITIES: [Priority, string][] = [["beach", "Beach"], ["exploring", "Exploring"], ["dining", "Dining"], ["quiet", "Quiet time"]];
const PACES: [Pace, string][] = [["relaxed", "Relaxed"], ["balanced", "Balanced"], ["active", "Active"]];
const ALLOC: [keyof Allocation, string][] = [["stay", "Stay"], ["experiences", "Experiences"], ["dining", "Dining"], ["flex", "Flights & extras"]];
const KIND_LABEL: Record<string, string> = { beach: "Beach", exploring: "Explore", dining: "Dining", quiet: "Quiet", indoor: "Rainy swap", arrival: "Arrive", departure: "Depart" };
const money = (n: number) => `$${n.toLocaleString("en-US")}`;

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <Button type="button" size="sm" variant={active ? "default" : "outline"} aria-pressed={active} onClick={onClick} className="rounded-full bg-transparent data-[on=true]:bg-primary" data-on={active}>
      {children}
    </Button>
  );
}

function Simulator() {
  const [scenario, setScenario] = useState<Scenario>(SAMPLE);
  const [consultOpen, setConsultOpen] = useState(false);
  const set = <K extends keyof Scenario>(k: K, v: Scenario[K]) => setScenario((s) => ({ ...s, [k]: v }));

  const days = useMemo(() => buildItinerary(scenario), [scenario]);
  const original = useMemo(() => buildItinerary({ ...SAMPLE, destination: scenario.destination }), [scenario.destination]);
  const budget = budgetBreakdown(scenario);
  const alloc = normalizeAllocation(scenario.allocation);
  const changed = JSON.stringify({ ...scenario, destination: SAMPLE.destination }) !== JSON.stringify(SAMPLE);
  const dest = DESTINATIONS[scenario.destination];

  const togglePriority = (p: Priority) =>
    set("priorities", scenario.priorities.includes(p) ? scenario.priorities.filter((x) => x !== p) : [...scenario.priorities, p]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-primary/10 px-5 py-4 lg:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-foreground/75 hover:text-foreground"><ArrowLeft className="size-4" /> Jet Set Travel Co.</Link>
          <Button className="rounded-sm" onClick={() => setConsultOpen(true)}>Ask Joey to review</Button>
        </div>
      </header>

      <section className="relative h-[340px] overflow-hidden text-primary-foreground sm:h-[420px]">
        <img src={IMAGES[scenario.destination]} alt={`${dest.name}, ${dest.region}`} className="absolute inset-0 size-full object-cover transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-10 lg:px-10">
          <p className="text-xs uppercase tracking-[0.25em] text-secondary">Vacation Simulator · sample</p>
          <h1 className="mt-3 max-w-3xl text-4xl leading-tight sm:text-6xl">{scenario.nights} nights in {dest.name}, played out day by day.</h1>
          <p className="mt-3 max-w-xl text-sm text-primary-foreground/80">Change anything below and watch your trip reshape. This is a playful preview, not a quote.</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 lg:grid-cols-[380px_1fr] lg:px-10">
        <aside className="space-y-8 lg:sticky lg:top-6 lg:self-start">
          <div>
            <h2 className="text-xl">Destination</h2>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {(Object.keys(DESTINATIONS) as DestinationId[]).map((id) => (
                <button key={id} type="button" aria-pressed={scenario.destination === id} onClick={() => set("destination", id)}
                  className={`relative h-24 overflow-hidden rounded-sm border-2 text-left ${scenario.destination === id ? "border-accent" : "border-transparent"}`}>
                  <img src={IMAGES[id]} alt="" className="absolute inset-0 size-full object-cover" />
                  <span className="absolute inset-0 bg-primary/45" />
                  <span className="absolute bottom-2 left-2 text-sm font-medium text-primary-foreground">{DESTINATIONS[id].name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="text-sm">Nights: <strong>{scenario.nights}</strong>
              <input type="range" min={2} max={10} value={scenario.nights} onChange={(e) => set("nights", +e.target.value)} className="mt-2 w-full accent-[var(--accent)]" />
            </label>
            <label className="text-sm">Travelers: <strong>{scenario.travelers}</strong>
              <input type="range" min={1} max={8} value={scenario.travelers} onChange={(e) => set("travelers", +e.target.value)} className="mt-2 w-full accent-[var(--accent)]" />
            </label>
            <label className="col-span-2 text-sm">Total budget: <strong>{money(scenario.budget)}</strong>
              <input type="range" min={2000} max={40000} step={500} value={scenario.budget} onChange={(e) => set("budget", +e.target.value)} className="mt-2 w-full accent-[var(--accent)]" />
            </label>
          </div>

          <div>
            <h2 className="text-xl">Priorities</h2>
            <div className="mt-3 flex flex-wrap gap-2">{PRIORITIES.map(([p, l]) => <Chip key={p} active={scenario.priorities.includes(p)} onClick={() => togglePriority(p)}>{l}</Chip>)}</div>
          </div>

          <div>
            <h2 className="text-xl">Pace</h2>
            <div className="mt-3 flex flex-wrap gap-2">{PACES.map(([p, l]) => <Chip key={p} active={scenario.pace === p} onClick={() => set("pace", p)}>{l}</Chip>)}</div>
          </div>

          <div>
            <h2 className="text-xl">What if…</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <Chip active={scenario.rainyDay} onClick={() => set("rainyDay", !scenario.rainyDay)}><CloudRain /> A rainy day</Chip>
              <Chip active={scenario.delayedArrival} onClick={() => set("delayedArrival", !scenario.delayedArrival)}><Clock /> Delayed first evening</Chip>
            </div>
          </div>

          <div>
            <h2 className="text-xl">Budget split</h2>
            <div className="mt-3 space-y-3">
              {ALLOC.map(([k, l]) => (
                <label key={k} className="block text-sm">
                  <span className="flex justify-between"><span>{l}</span><span>{alloc[k]}% · {money(budget[k])}</span></span>
                  <input type="range" min={0} max={80} value={scenario.allocation[k]} onChange={(e) => set("allocation", { ...scenario.allocation, [k]: +e.target.value })} className="w-full accent-[var(--accent)]" />
                </label>
              ))}
              <p className="text-xs text-muted-foreground">Roughly {money(budget.stayPerNight)} a night for your stay and {money(budget.perPersonPerDay)} per person per day overall. Simple math on your own numbers, not real prices.</p>
            </div>
          </div>

          <Button variant="outline" className="w-full bg-transparent" onClick={() => setScenario({ ...SAMPLE, destination: scenario.destination })}><RotateCcw /> Back to the original sample</Button>
        </aside>

        <section aria-label="Day by day preview">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-3xl">Your days</h2>
            <p className="text-xs text-muted-foreground">Hypothetical preview. No live weather, prices or availability.</p>
          </div>
          <ol className="mt-6 space-y-4">
            {days.map((d) => (
              <li key={d.day} className={`grid gap-4 border p-5 sm:grid-cols-[110px_1fr] ${d.rainy ? "border-accent bg-secondary/60" : "border-primary/15 bg-card"}`}>
                <div><p className="font-serif text-2xl">{d.label}</p>{d.rainy && <p className="mt-1 inline-flex items-center gap-1 text-xs text-accent"><CloudRain className="size-3" /> If it rains</p>}</div>
                <ul className="space-y-2">
                  {d.activities.map((a, i) => (
                    <li key={i} className="flex flex-wrap items-baseline gap-x-3 text-sm">
                      <span className="w-20 shrink-0 text-[11px] uppercase tracking-[0.15em] text-accent">{KIND_LABEL[a.kind]}</span>
                      <span>{a.title}</span>{a.note && <span className="text-xs text-muted-foreground">({a.note})</span>}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          <Compare original={original} current={days} changed={changed} />

          <div className="mt-10 border border-primary/20 bg-secondary p-6 sm:p-8">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent"><Sparkles className="size-4" /> Like where this is going?</p>
            <h3 className="mt-3 text-3xl">Turn the preview into a real trip.</h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-foreground/70">Book a free call and walk Joey through what you built here. He'll check real hotels, prices and perks for your dates. Planning and booking are totally free, start to finish.</p>
            <Button size="lg" className="mt-6 rounded-sm" onClick={() => setConsultOpen(true)}>Ask Joey to review</Button>
            <p className="mt-3 text-xs text-muted-foreground">This sample isn't saved or sent anywhere. Bring your ideas to the call.</p>
          </div>
        </section>
      </div>

      <footer className="bg-primary px-5 py-10 text-center text-sm text-primary-foreground/70">
        <a href="mailto:jetsettravelco1@gmail.com" className="hover:text-secondary">jetsettravelco1@gmail.com</a>
      </footer>

      {consultOpen && (
        <div role="dialog" aria-modal="true" aria-label="Book your consult" onKeyDown={(e) => e.key === "Escape" && setConsultOpen(false)} className="fixed inset-0 z-50 sm:bg-primary/50">
          <button aria-label="Close booking panel" tabIndex={-1} className="absolute inset-0 hidden size-full cursor-default sm:block" onClick={() => setConsultOpen(false)} />
          <div className="absolute inset-0 flex flex-col bg-background shadow-2xl sm:left-auto sm:w-[520px]">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <p className="font-serif text-lg">Book your consult</p>
              <Button variant="ghost" autoFocus aria-label="Close booking panel" onClick={() => setConsultOpen(false)}>Close <X /></Button>
            </div>
            <iframe src="https://calendly.com/jetsettravelco" title="Book a consultation with Jet Set Travel Co." className="w-full flex-1 border-0" />
          </div>
        </div>
      )}
    </main>
  );
}

function Compare({ original, current, changed }: { original: ReturnType<typeof buildItinerary>; current: ReturnType<typeof buildItinerary>; changed: boolean }) {
  const a = countKinds(original), b = countKinds(current);
  const keys = ["beach", "exploring", "dining", "quiet", "indoor"];
  return (
    <div className="mt-10">
      <h2 className="text-3xl">Original vs. your changes</h2>
      {!changed && <p className="mt-2 text-sm text-muted-foreground">Change the pace, priorities or a what-if to see the difference.</p>}
      <div className="mt-4 grid grid-cols-[1fr_auto_auto] gap-x-6 gap-y-2 border border-primary/15 p-5 text-sm">
        <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Moments</span>
        <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Original</span>
        <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Yours</span>
        <span>Days</span><span>{original.length}</span><span className="font-semibold">{current.length}</span>
        {keys.map((k) => (
          <span key={k} className="contents"><span>{KIND_LABEL[k]}</span><span>{a[k] ?? 0}</span><span className={(a[k] ?? 0) !== (b[k] ?? 0) ? "font-semibold text-accent" : ""}>{b[k] ?? 0}</span></span>
        ))}
      </div>
    </div>
  );
}
