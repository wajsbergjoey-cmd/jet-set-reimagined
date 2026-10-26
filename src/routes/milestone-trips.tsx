import { createFileRoute } from "@tanstack/react-router";
import { OccasionPage } from "@/components/occasion-page";
import moodFormalImage from "@/assets/mood-formal.jpg";

export const Route = createFileRoute("/milestone-trips")({
  head: () => ({
    meta: [
      { title: "Milestone Trips — Birthdays, Graduations & Reunions | Jet Set Travel Co." },
      { name: "description", content: "30th birthdays, graduations, retirements, and family reunions planned personally by a travel advisor. Free planning and booking, start to finish." },
      { property: "og:title", content: "Milestone Trips — Birthdays, Graduations & Reunions | Jet Set Travel Co." },
      { property: "og:description", content: "Big birthdays, graduations, retirements, and reunions planned personally. Free planning and booking, start to finish." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MilestoneTrips,
});

function MilestoneTrips() {
  return (
    <OccasionPage
      eyebrow="Milestone trips"
      title={<>Big moments deserve <em className="font-normal">more than a group chat.</em></>}
      intro="A 30th birthday, a graduation, a retirement, the whole family in one place. These trips have moving parts — I take them off your plate and make the occasion feel like one."
      image={moodFormalImage}
      imageAlt="An elegant celebration setting for a milestone trip"
      sections={[
        {
          title: "Milestone birthdays, done properly",
          copy: "Turning 30, 40, or 60 somewhere unforgettable beats a dinner reservation. I plan the destination, the stay, and the celebration details — and where they're available, perks like upgrades and resort credit come along.",
        },
        {
          title: "Graduations and retirements",
          copy: "The trips that mark a chapter closing deserve thought, not a last-minute booking site scroll. Tell me who it's for and what they love, and I'll build something that actually honors the moment.",
        },
        {
          title: "Family reunions without the herding",
          copy: "Different ages, different budgets, different ideas of fun. I coordinate the rooms, the timing, and the logistics so the family organizer — usually you — actually gets to enjoy the trip too.",
        },
        {
          title: "Group trips that stay friendly",
          copy: "Friends' trips fall apart in the planning stage. I give the group one clear plan with real options and prices, so nobody has to chase anyone and everyone knows what they're saying yes to.",
        },
      ]}
      closingTitle="What's the occasion?"
      closingCopy="One short call and I'll take it from there — destination ideas, vetted hotels, and a plan the whole group can say yes to. Planning and booking are totally free, start to finish."
      ctaLabel="Plan the milestone"
    />
  );
}
