import { z } from "zod";

/** Rules for a "free trip sanity check" request. Pure so the route only renders. */
export const tripCheckSchema = z.object({
  name: z.string().trim().min(1, "Please add your name").max(80),
  email: z.string().trim().min(1, "Please add your email").email("Please add a valid email").max(200),
  tripDetails: z
    .string()
    .trim()
    .min(20, "Tell me a little about the trip (20 characters or more)")
    .max(4000),
});

export type TripCheckInput = z.infer<typeof tripCheckSchema>;

export type TripCheckValidation =
  | { ok: true; data: TripCheckInput }
  | { ok: false; fieldErrors: Partial<Record<keyof TripCheckInput, string>> };

export function validateTripCheck(input: unknown): TripCheckValidation {
  const parsed = tripCheckSchema.safeParse(input);
  if (parsed.success) return { ok: true, data: parsed.data };

  const fieldErrors: Partial<Record<keyof TripCheckInput, string>> = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in fieldErrors)) {
      fieldErrors[key as keyof TripCheckInput] = issue.message;
    }
  }
  return { ok: false, fieldErrors };
}
