import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { tripCheckSchema } from "./trip-check";

/**
 * Server-side client for the public trip check form. Runs as the anonymous
 * role, so the insert-only policy applies and visitors cannot read submissions.
 */
function publishableClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false },
    // Opaque sb_ keys are not JWTs: send apikey only, never a bearer token.
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export const submitTripCheck = createServerFn({ method: "POST" })
  .inputValidator((d) => tripCheckSchema.parse(d))
  .handler(async ({ data }) => {
    const supabase = publishableClient();

    const { data: recent, error: recentError } = await supabase.rpc("trip_check_recent_count", {
      p_email: data.email,
    });
    if (!recentError && typeof recent === "number" && recent > 0) {
      throw new Error("Please wait a little before sending another trip.");
    }

    const { error } = await supabase.from("trip_check_requests").insert({
      name: data.name,
      email: data.email,
      trip_details: data.tripDetails,
    });
    if (error) throw new Error("Your trip could not be saved. Please try again.");

    const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");
    await sendTemplateEmail("trip-check-request", "jetsettravelco1@gmail.com", {
      templateData: { name: data.name, email: data.email, tripDetails: data.tripDetails },
      replyTo: data.email,
      idempotencyKey: `trip-check-${crypto.randomUUID()}`,
    });

    return { ok: true };
  });
