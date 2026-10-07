import { ArrowRight, ArrowUp, Mail, Phone } from "lucide-react";
import { NAV_LINKS, SITE } from "@/data/site";
import { LogoStacked } from "./Logo";

const FOOTER_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Why Tenya", href: "#why-tenya" },
  { label: "Contact", href: "#contact" },
] as const satisfies readonly { label: string; href: (typeof NAV_LINKS)[number]["href"] }[];

export function Footer() {
  return (
    <footer className="on-dark relative overflow-hidden bg-navy pb-24 text-white md:pb-0">
      <div aria-hidden="true" className="h-1.5 bg-signal" />
      <div
        aria-hidden="true"
        className="sec-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,transparent,#000_30%,transparent)]"
      />

      <div className="container-x relative grid gap-12 py-16 lg:grid-cols-12 lg:gap-10 lg:py-20">
        <div className="lg:col-span-5">
          <div className="cut-tr inline-block bg-white p-4 [--cut:22px] sm:p-5">
            <LogoStacked className="w-52 sm:w-60" />
          </div>
          <p className="mt-7 font-display text-lg font-extrabold tracking-[0.04em] uppercase">{SITE.legalName}</p>
          <p className="mt-2 font-display text-xs font-bold tracking-[0.22em] text-signal uppercase">
            Integrity with Excellence
          </p>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/75">
            Professional security. Trusted protection. Peace of mind. Protecting people, property and businesses.
          </p>
        </div>

        <nav aria-label="Footer" className="lg:col-span-3 lg:col-start-7">
          <h2 className="font-display text-xs font-bold tracking-[0.22em] text-white/70 uppercase">Navigate</h2>
          <ul className="mt-5 space-y-1">
            {FOOTER_LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="group inline-flex min-h-11 items-center gap-3 text-base font-medium text-white transition-colors hover:text-white/75"
                >
                  <span aria-hidden="true" className="block h-0.5 w-3 bg-signal transition-all duration-300 group-hover:w-6" />
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className="font-display text-xs font-bold tracking-[0.22em] text-white/70 uppercase">Contact</h2>
          <ul className="mt-5 space-y-1">
            <li>
              <a href={SITE.phoneHref} className="inline-flex min-h-11 items-center gap-3 font-display text-lg font-bold hover:text-white/75">
                <Phone className="size-4 text-signal" aria-hidden="true" />
                {SITE.phone}
              </a>
            </li>
            <li>
              <a href={SITE.emailHref} className="inline-flex min-h-11 items-center gap-3 text-sm font-medium break-all hover:text-white/75 sm:text-base">
                <Mail className="size-4 shrink-0 text-signal" aria-hidden="true" />
                {SITE.email}
              </a>
            </li>
          </ul>
          <a href="#contact" className="btn btn-red-dark mt-6 w-full sm:w-auto">
            Request a Quote
            <ArrowRight className="arrow size-4" aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col items-start justify-between gap-4 py-6 text-sm text-white/70 sm:flex-row sm:items-center">
          <p>© 2026 Tenya Security Group Limited. All Rights Reserved.</p>
          <a href="#home" className="inline-flex min-h-11 items-center gap-2 font-display text-xs font-bold tracking-[0.16em] text-white uppercase hover:text-white/75">
            Back to top
            <ArrowUp className="size-4 text-signal" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
