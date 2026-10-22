import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, MapPin, Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { searchDestination, type DestinationSearch } from "@/lib/hotels.functions";

export function AnywhereExplorer({ onAskJoey }: { onAskJoey: () => void }) {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<DestinationSearch | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [scene, setScene] = useState(0);
  const run = useServerFn(searchDestination);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!result || result.scenes.length < 2) return;
    const t = setInterval(() => setScene((n) => (n + 1) % result.scenes.length), 6000);
    return () => clearInterval(t);
  }, [result]);

  const signIn = async () => {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/vacation-simulator" });
    if (r.error) setError("Sign-in didn't work. Please try again.");
  };

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length < 2 || loading) return;
    setLoading(true); setError(null); setPicked(null); setScene(0);
    try { setResult(await run({ data: { destination: query.trim() } })); }
    catch (err) { setError(err instanceof Error ? err.message : "Something went wrong."); }
    finally { setLoading(false); }
  };

  const current = result?.scenes[scene];
  const hotel = result?.hotels.find((h) => h.id === picked);

  return (
    <section aria-label="Go anywhere" className="bg-primary text-primary-foreground">
      <div className="relative min-h-[100svh] overflow-hidden">
        {current && <img key={current.url} src={current.url} alt={`A view of ${result?.destination}`} className="absolute inset-0 size-full animate-in fade-in object-cover duration-1000" />}
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-primary/20" />
        <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 py-16 lg:px-10">
          <p className="text-xs uppercase tracking-[0.25em] text-secondary">Go anywhere</p>
          <h2 className="mt-3 max-w-3xl text-4xl leading-tight sm:text-6xl">
            {result ? <>Picture yourself in {result.destination}.</> : <>Where in the world do you want to be?</>}
          </h2>

          {signedIn === false && (
            <div className="mt-6 max-w-lg">
              <p className="text-sm text-primary-foreground/80">Sign in free with Google to explore any destination and see real hotels there.</p>
              <Button size="lg" variant="secondary" className="mt-4 rounded-sm" onClick={signIn}>Continue with Google</Button>
            </div>
          )}

          {signedIn && (
            <form onSubmit={search} className="mt-6 flex max-w-xl gap-2">
              <label htmlFor="anywhere" className="sr-only">Destination</label>
              <input id="anywhere" value={query} onChange={(e) => setQuery(e.target.value)} maxLength={80} placeholder="Try Bali, Paris, Santorini…"
                className="h-12 flex-1 rounded-sm border border-primary-foreground/30 bg-background/95 px-4 text-foreground placeholder:text-muted-foreground" />
              <Button type="submit" size="lg" variant="secondary" className="h-12 rounded-sm" disabled={loading}><Search /> {loading ? "Looking…" : "Explore"}</Button>
            </form>
          )}
          {error && <p role="alert" className="mt-3 text-sm text-secondary">{error}</p>}
          {current?.credit && <p className="mt-4 text-[11px] text-primary-foreground/60">Photo: {current.credit} via Google</p>}
        </div>
      </div>

      {result && (
        <div className="mx-auto max-w-7xl px-5 py-14 lg:px-10">
          <h3 className="text-3xl">Hotels in {result.destination}</h3>
          <p className="mt-2 text-sm text-primary-foreground/70">Real places from Google. Joey confirms prices, rooms and any perks for your dates.</p>
          {result.hotels.length === 0 && <p className="mt-6 text-sm">No hotels found. Try a nearby city or region.</p>}
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {result.hotels.map((h) => (
              <li key={h.id} className={`overflow-hidden rounded-sm border-2 bg-background text-foreground ${picked === h.id ? "border-accent" : "border-transparent"}`}>
                <div className="relative h-48 bg-muted">
                  {h.photo && <img src={h.photo} alt={h.name} loading="lazy" className="size-full object-cover" />}
                </div>
                <div className="p-5">
                  <p className="font-serif text-xl">{h.name}</p>
                  <p className="mt-1 flex items-start gap-1 text-xs text-muted-foreground"><MapPin className="mt-0.5 size-3 shrink-0" />{h.address}</p>
                  {h.rating != null && <p className="mt-2 inline-flex items-center gap-1 text-sm"><Star className="size-4 fill-accent text-accent" />{h.rating.toFixed(1)}<span className="text-muted-foreground">({h.reviews ?? 0} Google reviews)</span></p>}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" variant={picked === h.id ? "default" : "outline"} className="rounded-sm" onClick={() => setPicked(h.id)}>{picked === h.id ? <><Check /> My pick</> : "Picture me here"}</Button>
                    {h.mapsUrl && <Button size="sm" variant="ghost" asChild><a href={h.mapsUrl} target="_blank" rel="noreferrer">See on map</a></Button>}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {hotel && (
            <div className="relative mt-12 overflow-hidden rounded-sm">
              {hotel.photo && <img src={hotel.photo} alt="" className="absolute inset-0 size-full object-cover" />}
              <div className="absolute inset-0 bg-primary/70" />
              <div className="relative p-8 sm:p-12">
                <p className="text-xs uppercase tracking-[0.25em] text-secondary">Your stay</p>
                <p className="mt-3 max-w-2xl text-3xl sm:text-4xl">You check in at {hotel.name}, drop your bags, and the trip begins.</p>
                <Button size="lg" variant="secondary" className="mt-6 rounded-sm" onClick={onAskJoey}>Ask Joey about this hotel</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
