import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, BedDouble, Menu, Plane, Sailboat, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import heroImage from "@/assets/jetset-hero.jpg";
import mauiImage from "@/assets/maui.jpg";
import amalfiImage from "@/assets/amalfi.jpg";
import cancunImage from "@/assets/cancun.jpg";
import turksImage from "@/assets/turks-caicos.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Luxury Travel Advisor — Jet Set Travel Co." },
      { name: "description", content: "Luxury hotels, cruises, and flights with exclusive perks, better value, and direct advisor support." },
      { property: "og:title", content: "Luxury Travel Advisor — Jet Set Travel Co." },
      { property: "og:description", content: "Travel planned with taste, preferred perks, and a direct line to your advisor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const navItems = [
  ["Services", "#services"], ["Perks", "#perks"], ["Recent trips", "#trips"],
  ["Reviews", "#reviews"], ["Contact", "#contact"],
] as const;

const destinations = [
  { name: "Maui", detail: "Hawaii", image: mauiImage },
  { name: "Amalfi Coast", detail: "Italy", image: amalfiImage },
  { name: "Cancun", detail: "Mexico", image: cancunImage },
  { name: "Turks & Caicos", detail: "Caribbean", image: turksImage },
];

const services = [
  { Icon: BedDouble, title: "Hotels & resorts", copy: "Room upgrades, resort credit, and early check-in at vetted luxury properties." },
  { Icon: Sailboat, title: "Cruises", copy: "Cabin selection, onboard credits, and verified itinerary advice." },
  { Icon: Plane, title: "Flights", copy: "Seamless routing, seat strategy, and instant support when plans shift." },
];

const reviews = [
  ["Ascha W.", "Joey made the entire travel planning process so easy and stress-free. He was incredibly responsive and made sure every detail was taken care of."],
  ["Jennifer S.", "Such a great experience from start to finish. Joey was professional, friendly, and helped us find exactly what we were looking for."],
  ["Brian K.", "Joey went above and beyond to make our trip special. Everything was organized perfectly, and we felt taken care of throughout the process."],
  ["Taylor D.", "Joey was knowledgeable, attentive, and made booking our trip incredibly simple. I couldn't have asked for a better experience."],
];

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <main className="overflow-hidden bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-primary/10 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-10">
          <a href="#top" aria-label="Jet Set Travel Co. home" className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-primary text-secondary shadow-md"><Send className="size-5" /></span>
            <span className="font-serif text-[18px] font-semibold leading-[0.9] uppercase tracking-[0.18em]">Jet Set<span className="mt-1 block font-sans text-[8px] font-medium tracking-[0.35em] text-accent">Travel Co.</span></span>
          </a>
          <nav aria-label="Primary navigation" className="hidden items-center gap-8 lg:flex">
            {navItems.map(([label, href]) => <a key={href} href={href} className="text-sm text-foreground/75 transition-colors hover:text-foreground">{label}</a>)}
          </nav>
          <Button asChild className="hidden h-11 rounded-sm px-6 lg:inline-flex"><a href="#contact">Book a consult</a></Button>
          <Button variant="outline" size="icon" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} className="size-11 bg-transparent lg:hidden">{menuOpen ? <X /> : <Menu />}</Button>
        </div>
        {menuOpen && <nav aria-label="Mobile navigation" className="border-t border-primary/10 bg-background px-5 py-5 lg:hidden">{navItems.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="block border-b border-primary/10 py-3 text-sm">{label}</a>)}<Button asChild className="mt-5 h-11 w-full rounded-sm"><a href="#contact" onClick={() => setMenuOpen(false)}>Book a consult</a></Button></nav>}
      </header>

      <section id="top" className="relative min-h-[760px] pt-[76px] text-primary-foreground lg:min-h-[800px]">
        <img src={heroImage} alt="Cliffside infinity pool overlooking a Greek island at sunset" width={1600} height={1200} className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-primary/55" />
        <div className="relative mx-auto flex min-h-[684px] max-w-7xl flex-col justify-end px-5 pb-10 lg:min-h-[724px] lg:px-10 lg:pb-12">
          <div className="max-w-3xl">
            <p className="inline-flex max-w-full items-center gap-2 overflow-hidden rounded-full border border-primary-foreground/35 bg-primary/25 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] whitespace-nowrap"><span className="size-1.5 shrink-0 rounded-full bg-secondary" />Travel advisor — hotels, cruises & flights</p>
            <h1 className="mt-6 max-w-3xl text-5xl leading-[0.98] font-medium sm:text-6xl lg:text-7xl">Trips planned with taste, <em className="font-normal">booked with an edge.</em></h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-primary-foreground/85 sm:text-lg">I plan and book travel the way frequent flyers wish they could do it themselves — with the upgrades, credits, and insider knowledge that only come from working with an advisor.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-13 rounded-sm bg-background px-7 text-foreground shadow-none hover:bg-background/90"><a href="#contact">Get your free consultation</a></Button>
              <Button asChild size="lg" variant="outline" className="h-13 rounded-sm border-primary-foreground/55 bg-transparent px-7 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"><a href="#trips">See what I book</a></Button>
            </div>
          </div>
          <div className="mt-12 grid max-w-2xl grid-cols-3 border-t border-primary-foreground/25 pt-6">
            {[['Fora','Advisor network'],['Exclusive','Perks'],['24/7','Direct advisor support']].map(([big, small]) => <div key={small}><div className="font-serif text-xl sm:text-2xl">{big}</div><div className="mt-1 pr-3 text-[9px] uppercase leading-4 tracking-[0.14em] text-primary-foreground/70 sm:text-[10px]">{small}</div></div>)}
          </div>
        </div>
      </section>

      <section id="services" className="scroll-mt-20 bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl md:grid-cols-3">
          {services.map(({ Icon, title, copy }) => <article key={title} className="border-b border-primary-foreground/10 px-8 py-12 text-center md:border-r md:border-b-0 last:border-r-0"><span className="mx-auto grid size-12 place-items-center rounded-full bg-accent text-accent-foreground"><Icon className="size-5" /></span><h2 className="mt-5 text-xl">{title}</h2><p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-primary-foreground/65">{copy}</p></article>)}
        </div>
      </section>

      <section id="perks" className="scroll-mt-20 px-5 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <p className="font-serif text-sm font-semibold italic text-accent">Why book through an advisor</p>
          <div className="mt-4 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <h2 className="max-w-xl text-4xl leading-[1.08] sm:text-5xl">Better rates, VIP status, and perks you cannot unlock on your own.</h2>
            <p className="max-w-xl self-end text-base leading-7 text-muted-foreground">The difference is not simply where you stay. It is how you are recognized, what is included, and who is in your corner when plans change.</p>
          </div>
          <div className="mt-16 grid gap-x-14 md:grid-cols-2">
            {[
              ['01', 'Exclusive rates and unmatched value', 'Through preferred partner networks and private contracts, I access exclusive rates, complimentary nights, and value-packed packages that never appear on public search engines.'],
              ['02', 'VIP perks you cannot buy online', 'Room upgrades, daily complimentary breakfast, resort credits, and early check-in, all tied to advisor relationships rather than standard booking sites.'],
              ['03', 'A direct line, zero hold times', 'If a flight is cancelled or plans change, you message me directly. No 1-800 numbers, no chatbots, and no waiting on hold.'],
              ['04', 'Custom trips with insider access', 'Hard-to-get reservations, vetted local contacts, and itineraries built around how you actually travel instead of generic packages.'],
            ].map(([number, title, copy]) => <article key={number} className="border-t border-border py-8"><span className="text-xs font-semibold text-accent">{number}</span><h3 className="mt-5 text-xl">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p></article>)}
          </div>
        </div>
      </section>

      <section id="trips" className="scroll-mt-20 bg-primary px-5 py-24 text-primary-foreground lg:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs uppercase tracking-[0.2em] text-secondary">Recent trips</p><h2 className="mt-3 text-4xl sm:text-5xl">A few places clients have landed.</h2></div><p className="max-w-sm text-sm leading-6 text-primary-foreground/60">Vetted stays, thoughtful routes, and the right details waiting at check-in.</p></div>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{destinations.map((destination, index) => <figure key={destination.name} className={`group relative overflow-hidden ${index % 2 ? 'lg:mt-12' : ''}`}><img src={destination.image} alt={`${destination.name} luxury travel destination`} loading="lazy" width={1200} height={912} className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-primary/25" /><figcaption className="absolute inset-x-0 bottom-0 p-6"><div className="font-serif text-2xl">{destination.name}</div><div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-primary-foreground/75">{destination.detail}</div></figcaption></figure>)}</div>
        </div>
      </section>

      <section id="reviews" className="scroll-mt-20 px-5 py-24 lg:px-10 lg:py-32"><div className="mx-auto max-w-7xl"><p className="text-xs uppercase tracking-[0.2em] text-accent">Client reviews</p><h2 className="mt-3 text-4xl sm:text-5xl">What it’s like to work with Joey.</h2><div className="mt-14 grid gap-px bg-border md:grid-cols-2">{reviews.map(([name, quote]) => <article key={name} className="bg-background p-7 sm:p-10"><div className="text-sm tracking-[0.2em] text-accent" aria-label="Five stars">★★★★★</div><blockquote className="mt-6 text-xl leading-8">“{quote}”</blockquote><p className="mt-7 text-xs font-semibold uppercase tracking-[0.16em]">{name}</p></article>)}</div></div></section>

      <section className="border-y border-border bg-card px-5 py-24 lg:px-10"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24"><div><p className="text-xs uppercase tracking-[0.2em] text-accent">Good to know</p><h2 className="mt-3 text-4xl sm:text-5xl">Frequently asked questions</h2></div><Accordion type="single" collapsible className="w-full">
        <AccordionItem value="cost"><AccordionTrigger className="py-6 text-base no-underline hover:no-underline">Does it cost more to book through an advisor?</AccordionTrigger><AccordionContent className="max-w-2xl pb-6 leading-6 text-muted-foreground">My consultation is complimentary. In many cases, you receive the same public rate plus added value through preferred partnerships. If a planning fee applies to a complex itinerary, I will always explain it before we begin.</AccordionContent></AccordionItem>
        <AccordionItem value="process"><AccordionTrigger className="py-6 text-base no-underline hover:no-underline">How does advisor booking work?</AccordionTrigger><AccordionContent className="max-w-2xl pb-6 leading-6 text-muted-foreground">We start with a short call about your dates, budget, and preferences. I research and present tailored options; once you approve, I handle the reservations and stay available through your return.</AccordionContent></AccordionItem>
        <AccordionItem value="perks"><AccordionTrigger className="py-6 text-base no-underline hover:no-underline">What perks can I receive?</AccordionTrigger><AccordionContent className="max-w-2xl pb-6 leading-6 text-muted-foreground">Depending on the property, benefits may include room upgrades, daily breakfast, resort credits, welcome amenities, and flexible arrival or departure times.</AccordionContent></AccordionItem>
        <AccordionItem value="transport"><AccordionTrigger className="py-6 text-base no-underline hover:no-underline">Can you coordinate flights and cruises too?</AccordionTrigger><AccordionContent className="max-w-2xl pb-6 leading-6 text-muted-foreground">Yes. I can coordinate air, hotels, transfers, and cruises into one seamless trip, including cabin and seat guidance and support if plans shift.</AccordionContent></AccordionItem>
      </Accordion></div></section>

      <section id="contact" className="scroll-mt-20 bg-secondary px-5 py-24 lg:px-10 lg:py-28"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-center"><div><p className="text-xs uppercase tracking-[0.2em]">Let’s plan something</p><h2 className="mt-4 max-w-2xl text-5xl leading-[1.05] sm:text-6xl">A quick call tells us if we’re a fit.</h2><p className="mt-6 max-w-xl text-base leading-7 text-foreground/70">No obligation, no cost. We’ll talk through where you want to go, what matters most on this trip, and what it would look like to have me handle the planning.</p></div><div className="border border-primary/20 bg-background p-7 sm:p-10"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Free trip consultation</p><h3 className="mt-4 text-3xl">Your next trip starts here.</h3><ol className="mt-7 space-y-4 text-sm text-muted-foreground"><li className="flex gap-3"><span className="font-semibold text-accent">01</span>We talk through your trip, budget, and dates.</li><li className="flex gap-3"><span className="font-semibold text-accent">02</span>I send a proposal with real, considered options.</li><li className="flex gap-3"><span className="font-semibold text-accent">03</span>You approve, and I take care of the booking.</li></ol><Button asChild size="lg" className="mt-8 h-13 w-full rounded-sm"><a href="mailto:joey.wajsberg@fora.travel?subject=Free%20travel%20consultation">Book your consult <ArrowRight /></a></Button><p className="mt-4 text-center text-[11px] text-muted-foreground">Private, personal, and no spam — ever.</p></div></div></section>

      <footer className="bg-primary px-5 py-14 text-primary-foreground lg:px-10"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-10 sm:flex-row"><div><div className="font-serif text-2xl uppercase tracking-[0.16em]">Jet Set<span className="block font-sans text-[9px] tracking-[0.34em] text-secondary">Travel Co.</span></div><p className="mt-5 max-w-xs text-sm leading-6 text-primary-foreground/60">Hotels, cruises & flights, planned with an insider’s eye.</p></div><div className="flex flex-col gap-3 text-sm"><a href="mailto:joey.wajsberg@fora.travel" className="hover:text-secondary">joey.wajsberg@fora.travel</a><a href="https://www.instagram.com/jetsettravelco_/" target="_blank" rel="noreferrer" className="hover:text-secondary">Instagram @jetsettravelco_</a></div></div><p className="mt-12 border-t border-primary-foreground/15 pt-6 text-[11px] leading-5 text-primary-foreground/45">Jet Set Travel Co. is an independent travel advisor operating as part of Fora Travel, Inc., a registered Seller of Travel. Bookings are made through Fora’s platform and are subject to Fora’s terms and applicable supplier terms.</p></div></footer>
    </main>
  );
}
