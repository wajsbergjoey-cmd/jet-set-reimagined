import { useEffect, useRef, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type LightboxPhoto = { src: string; alt: string; name: string; region: string };

export function PhotoLightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: {
  photos: LightboxPhoto[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const current = index ?? 0;
  const open = index !== null;

  useEffect(() => {
    if (!open) return;
    const trigger = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      onClose();
      return;
    }
    if (event.key === "ArrowRight") {
      onNavigate((current + 1) % photos.length);
      return;
    }
    if (event.key === "ArrowLeft") {
      onNavigate((current - 1 + photos.length) % photos.length);
      return;
    }
    if (event.key !== "Tab" || !panelRef.current) return;
    const focusables = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>("button"),
    ).filter((el) => !el.hasAttribute("disabled"));
    if (focusables.length === 0) return;
    const first = focusables[0]!;
    const last = focusables[focusables.length - 1]!;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (index === null) return null;
  const photo = photos[index];
  if (!photo) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo of ${photo.name}`}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-[60] bg-primary/95 text-primary-foreground"
    >
      <button
        aria-label="Close photo view"
        tabIndex={-1}
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <figure className="relative flex h-full flex-col items-center justify-center px-4 py-20 sm:px-24">
        <img
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          className="max-h-[70vh] w-auto max-w-full rounded-sm object-contain shadow-2xl"
        />
        <figcaption className="mt-6 text-center">
          <div className="font-serif text-3xl">{photo.name}</div>
          <div className="mt-2 text-[10px] uppercase tracking-[0.2em] text-secondary">{photo.region}</div>
        </figcaption>
      </figure>
      <button
        ref={closeButtonRef}
        aria-label="Close photo view"
        onClick={onClose}
        className="absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-full border border-primary-foreground/30 transition-colors hover:bg-primary-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
      >
        <X className="size-5" aria-hidden="true" />
      </button>
      {photos.length > 1 && (
        <>
          <button
            aria-label="Previous photo"
            onClick={() => onNavigate((current - 1 + photos.length) % photos.length)}
            className="absolute left-3 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-primary-foreground/30 transition-colors hover:bg-primary-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary sm:left-6"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            aria-label="Next photo"
            onClick={() => onNavigate((current + 1) % photos.length)}
            className="absolute right-3 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-primary-foreground/30 transition-colors hover:bg-primary-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary sm:right-6"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
          <p aria-hidden="true" className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs tracking-[0.2em] text-primary-foreground/70">
            {current + 1} / {photos.length}
          </p>
        </>
      )}
    </div>
  );
}
