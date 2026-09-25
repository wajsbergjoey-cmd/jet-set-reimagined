import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import mauiImage from "@/assets/maui.jpg";
import amalfiImage from "@/assets/amalfi.jpg";
import cancunImage from "@/assets/cancun.jpg";
import turksImage from "@/assets/turks-caicos.jpg";
import heroImage from "@/assets/jetset-hero.jpg";
import cityImage from "@/assets/mood-city.jpg";
import mountainImage from "@/assets/mood-mountains.jpg";
import familyImage from "@/assets/mood-family.jpg";
import formalImage from "@/assets/mood-formal.jpg";

export const Route = createFileRoute("/find-your-trip")({
  head: () => ({
    meta: [
      { title: "Build Your Dream Trip Mood Board — Jet Set Travel Co." },
      { name: "description", content: "Tap the photos that feel like you and build a dream-trip mood board in seconds — then send it to Joey for a free consultation." },
      { property: "og:title", content: "Build Your Dream Trip Mood Board — Jet Set Travel Co." },
      { property: "og:description", content: "Tap the photos that feel like you and build a dream-trip mood board in seconds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MoodBoard,
});

type Option = { id: string; label: string; image: string };
type Step = { key: string; title: string; question: string; options: Option[] };

const steps: Step[] = [
  { key: "vibe", title: "Vibe", question: "Where does your mind go first?", options: [
    { id: "Beach", label: "Beach & islands", image: turksImage },
    { id: "City", label: "Cities & culture", image: cityImage },
    { id: "Mountains", label: "Mountains & lodges", image: mountainImage },
  ] },
  { key: "who", title: "Company", question: "Who's coming along?", options: [
    { id: "Couples / adults-only", label: "Just us — adults-only", image: formalImage },
    { id: "Family", label: "The whole family", image: familyImage },
    { id: "Friends / group", label: "Friends & a crew", image: cancunImage },
  ] },
  { key: "style", title: "Style", question: "Pick your kind of luxury.", options: [
    { id: "Barefoot luxury", label: "Barefoot & easy", image: mauiImage },
    { id: "Resort formal", label: "Dressed-up & elegant", image: formalImage },
    { id: "Iconic views", label: "Cliffside & iconic", image: amalfiImage },
  ] },
  { key: "pace", title: "Pace", question: "How do you want your days to feel?", options: [
    { id: "Slow & restful", label: "Pool, spa, repeat", image: heroImage },
    { id: "Explore & do it all", label: "Out exploring daily", image: amalfiImage },
  ] },
  { key: "budget", title: "Budget", question: "Rough budget per person?", options: [
    { id: "$3k–$6k", label: "$3k – $6k", image: cancunImage },
    { id: "$6k–$12k", label: "$6k – $12k", image: mauiImage },
    { id: "$12k+", label: "$12k and up", image: turksImage },
  ] },
];

function suggestion(p: Record<string, Option[]>) {
  const has = (k: string, id: string) => p[k]?.some((o) => o.id === id);
  if (has("vibe", "City")) return "Old-world cities and long lunches — think Amalfi, Paris or Lisbon.";
  if (has("vibe", "Mountains")) return "Fireside lodges and big views — Alps, Banff or Aspen territory.";
  if (has("who", "Family")) return "Beachfront with room to roam — Maui or Cancun fit beautifully.";
  if (has("who", "Couples / adults-only")) return "Barefoot, adults-only and beach-first — sounds like Turks & Caicos.";
  return "Sun, sand and a great hotel — Caribbean or Hawaii are calling.";
}

function MoodBoard() {
  const [stepIndex, setStepIndex] = useState(0);
  const [picks, setPicks] = useState<Record<string, Option[]>>({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consultOpen, setConsultOpen] = useState(false);
  const done = stepIndex >= steps.length;
  const step = steps[stepIndex];

  const board = useMemo(() => steps.flatMap((s) => picks[s.key] ?? []), [picks]);

  useEffect(() => {
    if (!consultOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && setConsultOpen(false);
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [consultOpen]);

  const toggle = (o: Option) => {
    if (!step) return;
    setPicks((p) => {
      const cur = p[step.key] ?? [];
      const next = cur.some((x) => x.id === o.id) ? cur.filter((x) => x.id !== o.id) : [...cur, o];
      return { ...p, [step.key]: next };
    });
  };

  const fullName = [firstName, lastName].map((s) => s.trim()).filter(Boolean).join(" ");
  const summary = steps.map((s) => `${s.title}: ${(picks[s.key] ?? []).map((o) => o.id).join(", ") || "—"}`).join("\n");
  const mailto = `mailto:jetsettravelco1@gmail.com?subject=${encodeURIComponent(`My dream trip mood board${fullName ? ` — ${fullName}` : ""}`)}&body=${encodeURIComponent(`Hi Joey,\n\nHere's my dream trip mood board:\n\n${summary}\n\nYour take: ${suggestion(picks)}\n\n${fullName ? `— ${fullName}\n` : ""}${email ? `Email: ${email}\n` : ""}${phone ? `Phone: ${phone}` : ""}`)}`;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-primary/10">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-10">
          <Link to="/" className="flex items-center gap-3" aria-label="Back to Jet Set Travel Co. home">
            <span className="grid size-11 place-items-center rounded-full bg-primary text-secondary shadow-md"><Send className="size-5" /></span>
            <span className="font-serif text-[18px] font-semibold leading-[0.9] uppercase tracking-[0.18em]">Jet Set<span className="mt-1 block font-sans text-[8px] font-medium tracking-[0.35em] text-accent">Travel Co.</span></span>
          </Link>
          <Link to="/" className="text-sm text-foreground/70 hover:text-foreground">Back to site</Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-[1.4fr_1fr] lg:px-10 lg:py-16">
        <section>
          <p className="text-xs uppercase tracking-[0.2em] text-accent">Build your dream trip</p>
          {!done && step ? (
            <>
              <div className="mt-4 flex gap-2" aria-label={`Step ${stepIndex + 1} of ${steps.length}`}>
                {steps.map((s, i) => <span key={s.key} className={`h-1 flex-1 rounded-full ${i <= stepIndex ? "bg-accent" : "bg-border"}`} />)}
              </div>
              <h1 className="mt-6 text-4xl sm:text-5xl">{step.question}</h1>
              <p className="mt-3 text-sm text-muted-foreground">Tap everything that feels like you — pick as many as you like.</p>
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {step.options.map((o) => {
                  const on = (picks[step.key] ?? []).some((x) => x.id === o.id);
                  return (
                    <button key={o.id} type="button" onClick={() => toggle(o)} aria-pressed={on}
                      className={`group relative aspect-[4/5] overflow-hidden rounded-sm text-left ring-offset-2 ring-offset-background transition ${on ? "ring-4 ring-accent" : "ring-1 ring-border hover:ring-accent/60"}`}>
                      <img src={o.image} alt="" loading="lazy" width={768} height={960} className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105" />
                      <span className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/10 to-transparent" />
                      {on && <span className="absolute top-3 right-3 grid size-8 place-items-center rounded-full bg-accent text-accent-foreground"><Check className="size-4" /></span>}
                      <span className="absolute inset-x-0 bottom-0 p-4 font-serif text-lg leading-tight text-primary-foreground">{o.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-8 flex items-center justify-between">
                <Button variant="ghost" disabled={stepIndex === 0} onClick={() => setStepIndex(stepIndex - 1)}><ArrowLeft /> Back</Button>
                <Button size="lg" className="rounded-sm" onClick={() => setStepIndex(stepIndex + 1)}>
                  {stepIndex === steps.length - 1 ? "See my mood board" : "Next"} <ArrowRight />
                </Button>
              </div>
            </>
          ) : (
            <>
              <h1 className="mt-4 text-4xl sm:text-5xl">Your trip, in pictures.</h1>
              <p className="mt-4 font-serif text-2xl italic text-accent">{suggestion(picks)}</p>
              <div className="mt-8 border border-primary/20 bg-card p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Totally free, start to finish</p>
                <h2 className="mt-3 text-2xl">Send your board to Joey</h2>
                <p className="mt-2 text-sm text-muted-foreground">Joey sees your picks before you ever talk — so your call jumps straight to the good part.</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium" htmlFor="mb-first">First name</label>
                    <input id="mb-first" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" placeholder="Jane" className="mt-2 h-11 w-full rounded-sm border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium" htmlFor="mb-last">Last name</label>
                    <input id="mb-last" value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" placeholder="Doe" className="mt-2 h-11 w-full rounded-sm border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium" htmlFor="mb-email">Email address</label>
                    <input id="mb-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="jane@email.com" className="mt-2 h-11 w-full rounded-sm border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium" htmlFor="mb-phone">Phone number</label>
                    <input id="mb-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="(555) 123-4567" className="mt-2 h-11 w-full rounded-sm border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" className="rounded-sm"><a href={mailto}>1. Email my board to Joey</a></Button>
                  <Button size="lg" variant="outline" className="rounded-sm" onClick={() => setConsultOpen(true)}>2. Book my free consult <ArrowRight /></Button>
                </div>
                <button type="button" onClick={() => { setPicks({}); setStepIndex(0); }} className="mt-5 text-xs text-muted-foreground underline underline-offset-4">Start over</button>
              </div>
            </>
          )}
        </section>

        <aside className="lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-sm bg-primary p-5 text-primary-foreground">
            <p className="text-xs uppercase tracking-[0.2em] text-secondary">Your mood board</p>
            {board.length === 0 ? (
              <p className="mt-10 mb-10 text-center font-serif text-xl text-primary-foreground/60">Your picks will appear here as you go.</p>
            ) : (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {board.map((o, i) => (
                  <figure key={`${o.id}-${i}`} className={`relative overflow-hidden rounded-sm animate-in fade-in zoom-in-95 ${i === 0 ? "col-span-2 row-span-2" : ""}`}>
                    <img src={o.image} alt={o.label} className="aspect-square size-full object-cover" />
                    <figcaption className="absolute inset-x-0 bottom-0 bg-primary/70 px-2 py-1 text-[10px] uppercase tracking-[0.12em]">{o.id}</figcaption>
                  </figure>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      {consultOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true" aria-label="Book your consult">
          <button type="button" tabIndex={-1} aria-hidden="true" onClick={() => setConsultOpen(false)} className="absolute inset-0 hidden bg-primary/60 sm:block" />
          <div className="relative flex h-full w-full flex-col bg-background sm:w-[520px]">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <p className="font-serif text-xl">Book your consult</p>
              <Button variant="ghost" autoFocus onClick={() => setConsultOpen(false)} className="min-h-11"><X /> Close</Button>
            </div>
            <iframe src="https://calendly.com/jetsettravelco" title="Book a consultation with Jet Set Travel Co." className="flex-1 w-full" />
          </div>
        </div>
      )}
    </main>
  );
}
