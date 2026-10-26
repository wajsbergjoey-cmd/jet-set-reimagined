import { useEffect, useRef, type KeyboardEvent } from "react";
import { X } from "lucide-react";

/**
 * Accessible Calendly booking side panel. Full-screen on phones,
 * right-side panel on larger screens. Escape closes, focus is trapped.
 */
export function ConsultPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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

  if (!open) return null;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      onClose();
      return;
    }
    if (event.key !== "Tab" || !panelRef.current) return;
    const focusables = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>("button, a[href], iframe, [tabindex]:not([tabindex='-1'])"),
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

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Book your consult"
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-50 sm:bg-primary/50"
    >
      <button
        aria-label="Close booking panel"
        tabIndex={-1}
        className="absolute inset-0 hidden h-full w-full cursor-default sm:block"
        onClick={onClose}
      />
      <div className="absolute inset-0 flex flex-col bg-background shadow-2xl sm:inset-y-0 sm:left-auto sm:right-0 sm:w-[520px]">
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6">
          <p className="font-serif text-lg">Book your consult</p>
          <button
            ref={closeButtonRef}
            aria-label="Close booking panel"
            onClick={onClose}
            className="inline-flex min-h-11 items-center gap-2 rounded-sm px-3 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Close
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <iframe
          src="https://calendly.com/jetsettravelco"
          title="Book a consultation with Jet Set Travel Co."
          className="w-full flex-1 border-0 pb-[env(safe-area-inset-bottom)]"
        />
      </div>
    </div>
  );
}
