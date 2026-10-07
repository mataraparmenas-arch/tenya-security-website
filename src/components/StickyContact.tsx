import { Phone } from "lucide-react";
import { cn } from "@/utils/cn";
import { SITE, whatsappLink } from "@/data/site";
import { useElementInView, useScrollPast } from "@/hooks/useBrowser";
import { WhatsAppIcon } from "./ui";

/** Persistent contact helpers. They appear after the hero and step aside inside the contact section. */
export function StickyContact() {
  const pastHero = useScrollPast(520);
  const inContact = useElementInView("contact");
  const show = pastHero && !inContact;

  return (
    <>
      {/* Mobile: CALL TENYA | REQUEST A QUOTE */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 bg-white shadow-[0_-12px_30px_-14px_rgba(6,6,48,0.4)] transition-[transform,visibility] duration-300 md:hidden",
          show ? "visible translate-y-0" : "invisible translate-y-full",
        )}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="grid grid-cols-2 border-t border-navy/15">
          <a
            href={SITE.phoneHref}
            className="flex min-h-14 items-center justify-center gap-2 font-display text-[0.8125rem] font-extrabold tracking-[0.06em] text-navy uppercase"
          >
            <Phone className="size-4 text-signal" aria-hidden="true" />
            Call Tenya
          </a>
          <a
            href="#contact"
            className="flex min-h-14 items-center justify-center bg-signal px-2 text-center font-display text-[0.8125rem] font-extrabold tracking-[0.06em] text-white uppercase"
          >
            Request a Quote
          </a>
        </div>
      </div>

      {/* Desktop: discreet WhatsApp shortcut */}
      <a
        href={whatsappLink("Hello Tenya Security, I would like to enquire about your security services.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Tenya on WhatsApp (opens in a new tab)"
        tabIndex={show ? 0 : -1}
        className={cn(
          "group fixed right-6 bottom-6 z-40 hidden h-14 items-center overflow-hidden bg-navy text-white shadow-[0_14px_30px_-10px_rgba(6,6,48,0.6)] transition-[transform,opacity,visibility] duration-300 md:flex",
          show ? "visible translate-y-0 opacity-100" : "invisible translate-y-4 opacity-0",
        )}
      >
        <span className="max-w-0 overflow-hidden pl-0 font-display text-[0.75rem] font-bold tracking-[0.1em] whitespace-nowrap uppercase opacity-0 transition-all duration-300 group-hover:max-w-48 group-hover:pl-5 group-hover:opacity-100 group-focus-visible:max-w-48 group-focus-visible:pl-5 group-focus-visible:opacity-100">
          WhatsApp Tenya
        </span>
        <span className="relative grid size-14 shrink-0 place-items-center">
          <WhatsAppIcon className="size-6" />
          <span aria-hidden="true" className="absolute top-3 right-3 size-2 bg-signal" />
        </span>
      </a>
    </>
  );
}
