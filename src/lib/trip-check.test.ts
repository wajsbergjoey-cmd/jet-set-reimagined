import { describe, expect, it } from "vitest";
import { validateTripCheck } from "./trip-check";

const good = {
  name: "Ascha W.",
  email: "ascha@example.com",
  tripDetails: "Four nights in Maui at the Sheraton, arriving Sunday, honeymoon.",
};

describe("validateTripCheck", () => {
  it("accepts a complete request", () => {
    const result = validateTripCheck(good);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.email).toBe("ascha@example.com");
  });

  it("rejects a missing email with a field message", () => {
    const result = validateTripCheck({ ...good, email: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.fieldErrors.email).toBe("Please add your email");
  });

  it("rejects an invalid email address", () => {
    const result = validateTripCheck({ ...good, email: "not-an-email" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.fieldErrors.email).toBe("Please add a valid email");
  });

  it("rejects trip details that are too short to review", () => {
    const result = validateTripCheck({ ...good, tripDetails: "Maui" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.fieldErrors.tripDetails).toContain("20 characters");
  });

  it("rejects trip details over the review limit", () => {
    const result = validateTripCheck({ ...good, tripDetails: "x".repeat(4001) });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.fieldErrors.tripDetails).toBeDefined();
  });

  it("rejects a blank name", () => {
    const result = validateTripCheck({ ...good, name: "   " });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.fieldErrors.name).toBe("Please add your name");
  });
});
