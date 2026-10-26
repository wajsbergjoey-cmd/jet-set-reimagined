import { useEffect, useState } from "react";
import greece from "@/assets/jetset-hero.jpg";
import maldives from "@/assets/hero-maldives.jpg";
import amalfi from "@/assets/hero-amalfi.jpg";
import boraBora from "@/assets/hero-bora-bora.jpg";
import alps from "@/assets/hero-alps.jpg";
import dubai from "@/assets/hero-dubai.jpg";
import bali from "@/assets/hero-bali.jpg";
import riviera from "@/assets/hero-riviera.jpg";

export const HERO_PHOTOS = [
  { src: greece, alt: "Cliffside infinity pool overlooking a Greek island at sunset", name: "Greece", region: "Mediterranean" },
  { src: maldives, alt: "Overwater villas in the Maldives at golden hour", name: "Maldives", region: "Indian Ocean" },
  { src: amalfi, alt: "Hotel terrace above Positano on the Amalfi Coast at sunset", name: "Amalfi Coast", region: "Italy" },
  { src: boraBora, alt: "Infinity pool facing Mount Otemanu in Bora Bora", name: "Bora Bora", region: "French Polynesia" },
  { src: alps, alt: "Alpine chalet hot tub facing the Matterhorn at dusk", name: "The Alps", region: "Switzerland" },
  { src: dubai, alt: "Lantern-lit desert camp in the Dubai dunes at sunset", name: "Dubai", region: "United Arab Emirates" },
  { src: bali, alt: "Private villa pool above Bali rice terraces at sunrise", name: "Bali", region: "Indonesia" },
  { src: riviera, alt: "Superyacht off the French Riviera near Monaco", name: "French Riviera", region: "France" },
];

export function HeroSlideshow({ onOpen }: { onOpen?: (index: number) => void }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setIndex((n) => (n + 1) % HERO_PHOTOS.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {HERO_PHOTOS.map((slide, i) => (
        <img
          key={slide.alt}
          src={slide.src}
          alt={i === index ? slide.alt : ""}
          aria-hidden={i !== index}
          width={1600}
          height={1008}
          loading={i === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-[1500ms] ${i === index ? "hero-drift opacity-100" : "opacity-0"}`}
        />
      ))}
      {onOpen && (
        <button
          type="button"
          onClick={() => onOpen(index)}
          aria-label="Look closer at this destination photo"
          className="absolute inset-0 cursor-zoom-in focus-visible:outline-2 focus-visible:-outline-offset-8 focus-visible:outline-secondary"
        />
      )}
    </div>
  );
}
