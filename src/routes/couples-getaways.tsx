import { createFileRoute } from "@tanstack/react-router";
import { OccasionPage } from "@/components/occasion-page";
import amalfiImage from "@/assets/amalfi.jpg";

export const Route = createFileRoute("/couples-getaways")({
  head: () => ({
    meta: [
      { title: "Couples Getaways & Anniversary Trips | Jet Set Travel Co." },
      { name: "description", content: "Anniversary trips, proposals, and romantic getaways planned personally by a travel advisor. Free planning and booking, start to finish." },
      { property: "og:title", content: "Couples Getaways & Anniversary Trips | Jet Set Travel Co." },
      { property: "og:description", content: "Anniversary trips, proposals, and romantic getaways planned personally. Free planning and booking, start to finish." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CouplesGetaways,
});

function CouplesGetaways() {
  return (
    <OccasionPage
      eyebrow="Couples & getaways"
      title={<>Trips for two, planned around <em className="font-normal">the two of you.</em></>}
      intro="Anniversaries, proposals, honeymoons, or simply a week away from everything. I plan romantic trips personally — the right room, the right view, and the details that make it feel like yours."
      image={amalfiImage}
      imageAlt="Amalfi Coast, Italy — a romantic couples getaway destination"
      sections={[
        {
          title: "Anniversary trips worth the occasion",
          copy: "Whether it's year one or year twenty-five, I match you with the right destination and the right room — then layer in the perks, like upgrades, breakfast, and resort credit where they're available.",
        },
        {
          title: "Proposals, planned quietly",
          copy: "Tell me the moment you're picturing and I'll handle the logistics around it — the hotel that helps instead of hovers, the timing, the table, the view. You just have to ask the question.",
        },
        {
          title: "Honeymoons without the spreadsheet",
          copy: "You've planned a wedding. You shouldn't have to plan this too. I stayed at the Sheraton in Maui myself and recommend it for honeymoons — relaxing, with service that truly stood out. Wherever you go, I build it around how you want to feel.",
        },
        {
          title: "The 'we just need a week away' trip",
          copy: "No occasion needed. Give me your dates and a rough budget and I'll come back with considered options — beach, city, or mountains — with perks you'd never unlock booking alone.",
        },
      ]}
      closingTitle="Tell me what you're celebrating."
      closingCopy="A short call is all it takes. I'll listen, then come back with real options — hotels I've vetted, routes that make sense, and perks included. Planning and booking are totally free, start to finish."
      ctaLabel="Plan our getaway"
    />
  );
}
