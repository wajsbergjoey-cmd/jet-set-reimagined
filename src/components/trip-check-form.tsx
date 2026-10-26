import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitTripCheck } from "@/lib/trip-check.functions";
import { validateTripCheck, type TripCheckInput } from "@/lib/trip-check";

type FieldErrors = Partial<Record<keyof TripCheckInput, string>>;

export function TripCheckForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tripDetails, setTripDetails] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const submit = useServerFn(submitTripCheck);

  const send = async () => {
    const result = validateTripCheck({ name, email, tripDetails });
    if (!result.ok) {
      setFieldErrors(result.fieldErrors);
      setStatus("idle");
      return;
    }
    setFieldErrors({});
    setStatus("sending");
    try {
      await submit({ data: result.data });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="border border-primary/20 bg-background p-7 sm:p-9">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Free trip check</p>
      <h3 className="mt-4 text-2xl">What to send</h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">Where you're going, the dates, where you're staying, and anything you're unsure about.</p>

      {status === "sent" ? (
        <p role="status" className="mt-7 border-t border-border pt-6 text-sm leading-6 text-accent">
          Thank you, {name}! Your trip is with Joey. He'll read it over and reply with what to fix.
        </p>
      ) : (
        <div className="mt-7 space-y-5">
          <div>
            <label className="block text-sm font-medium" htmlFor="tc-name">Your name</label>
            <input
              id="tc-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              maxLength={80}
              placeholder="Jane Doe"
              className="mt-2 h-11 w-full rounded-sm border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            {fieldErrors.name && <p role="alert" className="mt-2 text-xs text-destructive">{fieldErrors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="tc-email">Email address</label>
            <input
              id="tc-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              maxLength={200}
              placeholder="jane@email.com"
              className="mt-2 h-11 w-full rounded-sm border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            {fieldErrors.email && <p role="alert" className="mt-2 text-xs text-destructive">{fieldErrors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium" htmlFor="tc-trip">Your trip</label>
            <textarea
              id="tc-trip"
              value={tripDetails}
              onChange={(event) => setTripDetails(event.target.value)}
              rows={5}
              maxLength={4000}
              placeholder="Four nights in Maui at the Sheraton, arriving June 3. Honeymoon, not sure about the room."
              className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm leading-6 outline-none focus:ring-2 focus:ring-ring"
            />
            {fieldErrors.tripDetails && <p role="alert" className="mt-2 text-xs text-destructive">{fieldErrors.tripDetails}</p>}
          </div>

          <Button size="lg" className="h-13 w-full rounded-sm" disabled={status === "sending"} onClick={send}>
            {status === "sending" ? "Sending…" : <>Send my trip for a free check <ArrowRight /></>}
          </Button>
          {status === "error" && (
            <p role="alert" className="text-sm text-destructive">
              Something went wrong sending your trip. Please try again, or email jetsettravelco1@gmail.com.
            </p>
          )}
          <p className="text-center text-[11px] text-muted-foreground">No charge, no obligation, no spam.</p>
        </div>
      )}
    </div>
  );
}
