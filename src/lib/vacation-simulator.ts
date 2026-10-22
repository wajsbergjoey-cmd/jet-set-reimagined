// Pure, deterministic scenario logic for the Vacation Simulator sample.
// Everything here is hypothetical: no live prices, weather or availability.

export type Priority = "beach" | "exploring" | "dining" | "quiet";
export type Pace = "relaxed" | "balanced" | "active";
export type DestinationId = "maui" | "amalfi" | "cancun" | "turks";

export type Allocation = { stay: number; experiences: number; dining: number; flex: number };

export type Scenario = {
  destination: DestinationId;
  nights: number;
  travelers: number;
  budget: number;
  priorities: Priority[];
  pace: Pace;
  rainyDay: boolean;
  delayedArrival: boolean;
  allocation: Allocation;
};

export type Activity = { kind: Priority | "arrival" | "departure" | "indoor"; title: string; note?: string };
export type Day = { day: number; label: string; activities: Activity[]; rainy: boolean };

type Ideas = Record<Priority, string[]> & { indoor: string[] };

export const DESTINATIONS: Record<DestinationId, { name: string; region: string; ideas: Ideas }> = {
  maui: {
    name: "Maui", region: "Hawaii",
    ideas: {
      beach: ["Slow morning on a west side beach", "Snorkel time in calm morning water", "Sunset beach walk"],
      exploring: ["Scenic coastal drive", "Upcountry farms and views", "Early sunrise outing"],
      dining: ["Long oceanfront dinner", "Casual local lunch spot", "Poolside cocktails at golden hour"],
      quiet: ["Spa or massage afternoon", "Lanai reading and a nap", "Hammock hour, phones away"],
      indoor: ["Spa afternoon instead of the beach", "Cooking or lei-making class", "Long lunch and a gallery browse"],
    },
  },
  amalfi: {
    name: "Amalfi Coast", region: "Italy",
    ideas: {
      beach: ["Beach club lounger day", "Swim stop on a boat day", "Cliffside pool afternoon"],
      exploring: ["Boat along the coast", "Wander a hillside village", "Lemon grove and ceramics stroll"],
      dining: ["Terrace dinner with a view", "Long seafood lunch", "Aperitivo at sunset"],
      quiet: ["Pool and a paperback", "Late breakfast on the balcony", "Afternoon siesta"],
      indoor: ["Cooking class instead of the boat", "Museum or cathedral visit", "Wine tasting indoors"],
    },
  },
  cancun: {
    name: "Cancun", region: "Mexico",
    ideas: {
      beach: ["Turquoise water and a cabana", "Paddleboard morning", "Beach bar sunset"],
      exploring: ["Cenote swim outing", "Ruins day trip", "Island ferry adventure"],
      dining: ["Chef's tasting dinner", "Tacos and mezcal night", "Beachfront brunch"],
      quiet: ["Spa and hydrotherapy", "Shady pool hour", "Early night in"],
      indoor: ["Spa circuit instead of the beach", "Tequila or chocolate tasting", "Long lunch under cover"],
    },
  },
  turks: {
    name: "Turks & Caicos", region: "Caribbean",
    ideas: {
      beach: ["Powder sand beach day", "Shallow water snorkel", "Barefoot sunset on the sand"],
      exploring: ["Boat to a quiet cay", "Kayak through mangroves", "Island drive and conch shack"],
      dining: ["Toes in the sand dinner", "Fresh conch lunch", "Rum punch at sunset"],
      quiet: ["Cabana nap", "In-room breakfast and slow start", "Spa treatment"],
      indoor: ["Spa morning instead of the beach", "Long covered lunch", "Movie and room service night"],
    },
  },
};

const PER_DAY: Record<Pace, number> = { relaxed: 1, balanced: 2, active: 3 };

export function normalizeAllocation(a: Allocation): Allocation {
  const total = a.stay + a.experiences + a.dining + a.flex;
  if (total <= 0) return { stay: 25, experiences: 25, dining: 25, flex: 25 };
  const r = (n: number) => Math.round((n / total) * 100);
  const stay = r(a.stay), experiences = r(a.experiences), dining = r(a.dining);
  return { stay, experiences, dining, flex: 100 - stay - experiences - dining };
}

export function budgetBreakdown(s: Scenario) {
  const a = normalizeAllocation(s.allocation);
  const amt = (p: number) => Math.round((s.budget * p) / 100);
  const stay = amt(a.stay);
  return {
    stay, experiences: amt(a.experiences), dining: amt(a.dining), flex: amt(a.flex),
    stayPerNight: Math.round(stay / Math.max(1, s.nights)),
    perPersonPerDay: Math.round(s.budget / Math.max(1, s.travelers) / Math.max(1, s.nights + 1)),
  };
}

/** Day count = nights + 1 (arrival day through departure day). */
export function buildItinerary(s: Scenario): Day[] {
  const ideas = DESTINATIONS[s.destination].ideas;
  const prios: Priority[] = s.priorities.length ? s.priorities : ["quiet"];
  const perDay = PER_DAY[s.pace];
  const used: Record<string, number> = {};
  const next = (k: Priority | "indoor") => {
    const list = ideas[k];
    const i = used[k] ?? 0;
    used[k] = i + 1;
    return list[i % list.length]!;
  };
  const rainyIndex = !s.rainyDay || s.nights < 2 ? -1 : s.nights >= 3 ? 3 : 2;
  const days: Day[] = [];
  let cursor = 0;

  for (let d = 1; d <= s.nights + 1; d++) {
    const acts: Activity[] = [];
    const rainy = d === rainyIndex;
    if (d === 1) {
      if (s.delayedArrival) {
        acts.push({ kind: "arrival", title: "Late arrival after a delay", note: "Dinner plans move to tomorrow" });
        acts.push({ kind: "quiet", title: "Simple bite and an early night" });
      } else {
        acts.push({ kind: "arrival", title: "Arrive and settle in" });
        acts.push({ kind: "dining", title: next("dining") });
      }
    } else if (d === s.nights + 1) {
      acts.push({ kind: "quiet", title: "Slow breakfast" });
      acts.push({ kind: "departure", title: "Head home" });
    } else {
      // Day 2 absorbs a delayed welcome dinner.
      if (d === 2 && s.delayedArrival) acts.push({ kind: "dining", title: "Rescheduled welcome dinner" });
      while (acts.length < perDay) {
        const p = prios[cursor % prios.length]!;
        cursor++;
        if (rainy && (p === "beach" || p === "exploring")) acts.push({ kind: "indoor", title: next("indoor"), note: "Rainy day swap" });
        else acts.push({ kind: p, title: next(p) });
      }
    }
    days.push({ day: d, label: d === 1 ? "Arrival" : d === s.nights + 1 ? "Departure" : `Day ${d}`, activities: acts, rainy });
  }
  return days;
}

export function countKinds(days: Day[]) {
  const c: Record<string, number> = {};
  for (const d of days) for (const a of d.activities) c[a.kind] = (c[a.kind] ?? 0) + 1;
  return c;
}

export const SAMPLE: Scenario = {
  destination: "maui", nights: 5, travelers: 2, budget: 8000,
  priorities: ["beach", "dining", "quiet"], pace: "balanced",
  rainyDay: false, delayedArrival: false,
  allocation: { stay: 50, experiences: 20, dining: 20, flex: 10 },
};
