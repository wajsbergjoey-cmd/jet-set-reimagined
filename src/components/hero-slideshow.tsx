import { useEffect, useState } from "react";
import greece from "@/assets/jetset-hero.jpg";
import maldives from "@/assets/hero-maldives.jpg";
import amalfi from "@/assets/hero-amalfi.jpg";
import boraBora from "@/assets/hero-bora-bora.jpg";
import alps from "@/assets/hero-alps.jpg";
import dubai from "@/assets/hero-dubai.jpg";
import bali from "@/assets/hero-bali.jpg";
import riviera from "@/assets/hero-riviera.jpg";

const slides = [
  { src: greece, alt: "Cliffside infinity pool overlooking a Greek island at sunset" },
  { src: maldives, alt: "Overwater villas in the Maldives at golden hour" },
  { src: amalfi, alt: "Hotel terrace above Positano on the Amalfi Coast at sunset" },
  { src: boraBora, alt: "Infinity pool facing Mount Otemanu in Bora Bora" },
  { src: alps, alt: "Alpine chalet hot tub facing the Matterhorn at dusk" },
  { src: dubai, alt: "Lantern-lit desert camp in the Dubai dunes at sunset" },
  { src: bali, alt: "Private villa pool above Bali rice terraces at sunrise" },
  { src: riviera, alt: "Superyacht off the French Riviera near Monaco" },
];

export function HeroSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setIndex((n) => (n + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {slides.map((slide, i) => (
        <img
          key={slide.alt}
          src={slide.src}
          alt={i === index ? slide.alt : ""}
          aria-hidden={i !== index}
          width={1600}
          height={1008}
          loading={i === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-[1500ms] ${i === index ? "opacity-100" : "opacity-0"}`}
        />
      ))}
    </div>
  );
}
