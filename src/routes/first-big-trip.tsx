import { createFileRoute } from "@tanstack/react-router";
import { OccasionPage } from "@/components/occasion-page";
import jetsetHeroImage from "@/assets/jetset-hero.jpg";

export const Route = createFileRoute("/first-big-trip")({
  head: () => ({
    meta: [
      { title: "Planning Your First Big Trip? | Jet Set Travel Co." },
      { name: "description", content: "Overwhelmed by options for your first big trip? A personal travel advisor narrows it down, handles the booking, and answers within 24 hours. Free, start to finish." },
      { property: "og:title", content: "Planning Your First Big Trip? | Jet Set Travel Co." },
      { property: "og:description", content: "Overwhelmed by options? A personal travel advisor narrows it down and handles the booking, free from start to finish." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FirstBigTrip,
});

function FirstBigTrip() {
  return (
    <OccasionPage
      eyebrow="Your first big trip"
      title={<>A thousand tabs open. <em className="font-normal">Zero trips booked.</em></>}
      intro="If your first real trip has turned into endless research and second-guessing, that's normal, and it's exactly what I'm for. I narrow the noise down to a few great options and handle the rest."
      image={jetsetHeroImage}
      imageAlt="A luxury travel destination for a first big trip"
      sections={[
        {
          title: "Start with how you want to feel",
          copy: "Not 'where is cheapest', but where fits you. Relaxed or busy, beach or city, splurge or sensible. A short conversation replaces weeks of scrolling, and the options I send back actually match you.",
        },
        {
          title: "Real options, not search results",
          copy: "Booking sites show you everything, which is the same as showing you nothing. I come back with a small number of considered choices: vetted hotels, sensible routes, honest trade-offs. That way deciding is easy.",
        },
        {
          title: "Mistakes you don't have to make",
          copy: "The hotel that looks great but is far from everything. The connection that's too tight. The 'deal' that isn't. I've seen these trips go wrong, so I'll flag the problems before they're yours.",
        },
        {
          title: "Someone in your corner after you book",
          copy: "Most booking sites are done with you at checkout. I stay available through your return. If plans shift or something comes up, you message me directly, not a call center.",
        },
      ]}
      closingTitle="Bring me your maybe-list."
      closingCopy="Even if it's just 'somewhere warm in March, around this budget', that's enough to start. I'll reply personally, usually within 24 hours, with ideas worth considering. Planning and booking are totally free, start to finish."
      ctaLabel="Start my first trip"
    />
  );
}
