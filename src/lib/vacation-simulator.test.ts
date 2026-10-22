import { describe, expect, it } from "vitest";
import { SAMPLE, budgetBreakdown, buildItinerary, countKinds, normalizeAllocation } from "./vacation-simulator";

describe("vacation simulator", () => {
  it("has nights + 1 days", () => {
    expect(buildItinerary({ ...SAMPLE, nights: 5 })).toHaveLength(6);
  });
  it("pace sets activities per middle day", () => {
    expect(buildItinerary({ ...SAMPLE, pace: "relaxed" })[2]!.activities).toHaveLength(1);
    expect(buildItinerary({ ...SAMPLE, pace: "active" })[2]!.activities).toHaveLength(3);
  });
  it("rainy day replaces beach and exploring with indoor swaps on day 3", () => {
    const days = buildItinerary({ ...SAMPLE, priorities: ["beach", "exploring"], rainyDay: true });
    expect(days[2]!.rainy).toBe(true);
    expect(days[2]!.activities.every((a) => a.kind === "indoor")).toBe(true);
    expect(countKinds(buildItinerary({ ...SAMPLE, rainyDay: false }))["indoor"]).toBeUndefined();
  });
  it("delayed arrival moves welcome dinner to day 2", () => {
    const days = buildItinerary({ ...SAMPLE, delayedArrival: true });
    expect(days[0]!.activities.some((a) => a.kind === "dining")).toBe(false);
    expect(days[1]!.activities[0]!.title).toBe("Rescheduled welcome dinner");
  });
  it("allocation always sums to 100", () => {
    const a = normalizeAllocation({ stay: 3, experiences: 3, dining: 3, flex: 0 });
    expect(a.stay + a.experiences + a.dining + a.flex).toBe(100);
  });
  it("budget split: $8000 at 50% stay over 5 nights is $800 a night", () => {
    const b = budgetBreakdown(SAMPLE);
    expect(b.stay).toBe(4000);
    expect(b.stayPerNight).toBe(800);
  });
});
