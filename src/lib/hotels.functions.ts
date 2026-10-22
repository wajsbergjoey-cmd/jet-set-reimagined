import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const GATEWAY = "https://connector-gateway.lovable.dev/google_maps";

export type HotelResult = {
  id: string;
  name: string;
  address: string;
  rating: number | null;
  reviews: number | null;
  mapsUrl: string | null;
  photo: string | null;
  photoCredit: string | null;
};

export type DestinationSearch = {
  destination: string;
  scenes: { url: string; credit: string | null }[];
  hotels: HotelResult[];
};

type Photo = { name: string; authorAttributions?: { displayName?: string }[] };
type Place = {
  id: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  photos?: Photo[];
};

export const searchDestination = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ destination: z.string().trim().min(2).max(80) }).parse(d))
  .handler(async ({ data }): Promise<DestinationSearch> => {
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const mapsKey = process.env["GOOGLE_MAPS_API_KEY"];
    if (!lovableKey || !mapsKey) throw new Error("Hotel search is not set up yet.");
    const headers = { Authorization: `Bearer ${lovableKey}`, "X-Connection-Api-Key": mapsKey, "Content-Type": "application/json" };

    const search = async (textQuery: string, max: number, mask: string): Promise<Place[]> => {
      const res = await fetch(`${GATEWAY}/places/v1/places:searchText`, {
        method: "POST",
        headers: { ...headers, "X-Goog-FieldMask": mask },
        body: JSON.stringify({ textQuery, pageSize: max }),
      });
      if (!res.ok) {
        console.error(`Places search failed [${res.status}]: ${await res.text()}`);
        throw new Error("Couldn't look up that place right now. Please try again.");
      }
      return ((await res.json()) as { places?: Place[] }).places ?? [];
    };

    const photoUrl = async (p: Photo, width: number): Promise<string | null> => {
      const res = await fetch(`${GATEWAY}/places/v1/${p.name}/media?maxWidthPx=${width}&skipHttpRedirect=true`, { headers });
      if (!res.ok) return null;
      return ((await res.json()) as { photoUri?: string }).photoUri ?? null;
    };

    const [hotels, spots] = await Promise.all([
      search(`best hotels and resorts in ${data.destination}`, 6,
        "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.googleMapsUri,places.photos"),
      search(`top sights in ${data.destination}`, 3, "places.id,places.photos"),
    ]);

    const scenePhotos = spots.flatMap((s) => s.photos?.slice(0, 1) ?? []).slice(0, 3);
    const [scenes, hotelPhotos] = await Promise.all([
      Promise.all(scenePhotos.map(async (p) => ({ url: await photoUrl(p, 1600), credit: p.authorAttributions?.[0]?.displayName ?? null }))),
      Promise.all(hotels.map((h) => (h.photos?.[0] ? photoUrl(h.photos[0], 800) : Promise.resolve(null)))),
    ]);

    return {
      destination: data.destination,
      scenes: scenes.filter((s): s is { url: string; credit: string | null } => !!s.url),
      hotels: hotels.map((h, i) => ({
        id: h.id,
        name: h.displayName?.text ?? "Hotel",
        address: h.formattedAddress ?? "",
        rating: h.rating ?? null,
        reviews: h.userRatingCount ?? null,
        mapsUrl: h.googleMapsUri ?? null,
        photo: hotelPhotos[i] ?? null,
        photoCredit: h.photos?.[0]?.authorAttributions?.[0]?.displayName ?? null,
      })),
    };
  });
