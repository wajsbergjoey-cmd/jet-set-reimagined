import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConsultPanel } from "@/components/consult-panel";

export interface OccasionSection {
  title: string;
  copy: string;
}

interface OccasionPageProps {
  eyebrow: string;
  title: ReactNode;
  intro: string;
  image: string;
  imageAlt: string;
  sections: OccasionSection[];
  closingTitle: string;
  closingCopy: string;
  ctaLabel: string;
}

/**
 * Shared layout for the occasion pages (couples, milestones, first big trip).
 * Cream/espresso/gold design tokens, Fraunces headings, Calendly consult panel.
 */
export function OccasionPage({
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
  sections,
  closingTitle,
  closingCopy,
  ctaLabel,
}: OccasionPageProps) {
  const [consultOpen, setConsultOpen] = useState(false);

  return (
    <main className="bg-background text-foreground">
      <header className="border-b border-primary/10 px-5 py-4 lg:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3" aria-label="Back to Jet Set Travel Co. home">
            <span className="grid size-10 place-items-center rounded-full bg-primary text-secondary shadow-md">
              <Send className="size-4" />
            </span>
            <span className="font-serif text-[16px] font-semibold uppercase leading-[0.9] tracking-[0.18em]">
              Jet Set
              <span className="mt-1 block font-sans text-[8px] font-medium tracking-[0.35em] text-accent">Travel Co.</span>
            </span>
          </Link>
          <Button className="rounded-sm" onClick={() => setConsultOpen(true)}>Book a consult</Button>
        </div>
      </header>

      <section className="relative min-h-[420px] overflow-hidden text-primary-foreground sm:min-h-[520px]">
        <img src={image} alt={imageAlt} className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/45 to-primary/20" />
        <div className="relative mx-auto flex min-h-[420px] max-w-7xl flex-col justify-end px-5 pb-12 sm:min-h-[520px] lg:px-10">
          <p className="text-xs uppercase tracking-[0.25em] text-secondary">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-4xl leading-[1.02] sm:text-6xl">{title}</h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-primary-foreground/85 sm:text-base sm:leading-7">{intro}</p>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-x-14 gap-y-10 md:grid-cols-2">
            {sections.map((section, i) => (
              <article key={section.title} className="border-t border-border pt-7">
                <span className="text-xs font-semibold text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="mt-4 text-2xl leading-snug">{section.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{section.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary px-5 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <h2 className="max-w-2xl text-4xl leading-[1.05] sm:text-5xl">{closingTitle}</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-foreground/70">{closingCopy}</p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-sm border border-accent/60 bg-accent/15 px-4 py-2.5 text-sm font-semibold tracking-wide">
              <span className="size-1.5 shrink-0 rounded-full bg-accent" />
              Totally free — from the first call until you're back home, you never pay me a thing.
            </p>
          </div>
          <div className="border border-primary/20 bg-background p-7 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">A real reply within 24 hours</p>
            <h3 className="mt-4 text-3xl">Tell me about your trip.</h3>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Book a free call and we'll talk through dates, budget, and what you want the trip to feel like. No forms disappearing into a queue — you hear back from me personally, usually within a day.
            </p>
            <Button size="lg" className="mt-7 h-13 w-full rounded-sm" onClick={() => setConsultOpen(true)}>
              {ctaLabel} <ArrowRight />
            </Button>
            <p className="mt-4 text-center text-[11px] text-muted-foreground">Private, personal, and no spam — ever.</p>
          </div>
        </div>
      </section>

      <footer className="bg-primary px-5 py-10 text-primary-foreground lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-primary-foreground/75 hover:text-secondary">
            <ArrowLeft className="size-4" /> Back to Jet Set Travel Co.
          </Link>
          <a href="mailto:jetsettravelco1@gmail.com" className="text-sm text-primary-foreground/75 hover:text-secondary">
            jetsettravelco1@gmail.com
          </a>
        </div>
      </footer>

      <ConsultPanel open={consultOpen} onClose={() => setConsultOpen(false)} />
    </main>
  );
}
