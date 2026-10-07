import type { CSSProperties } from "react";
import { ArrowRight, Phone } from "lucide-react";
import { IMAGES, SERVICES, SITE } from "@/data/site";
import { useParallax } from "@/hooks/useBrowser";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

function Bracket({ className }: { className: string }) {
  return <span aria-hidden="true" className={`absolute size-7 border-white/70 ${className}`} />;
}

export function Hero() {
  const bgRef = useParallax<HTMLDivElement>(0.16);

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="on-dark relative isolate flex min-h-svh flex-col overflow-hidden bg-navy text-white"
    >
      {/* Photography with parallax */}
      <div ref={bgRef} className="absolute inset-x-0 -top-20 -bottom-20 -z-30 will-change-transform">
        <img
          src={IMAGES.hero.src}
          srcSet={IMAGES.hero.srcSet}
          sizes="100vw"
          width={IMAGES.hero.width}
          height={IMAGES.hero.height}
          alt={IMAGES.hero.alt}
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-[62%_center]"
        />
      </div>

      {/* Navy overlays keep type readable (navy only) */}
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-linear-to-r from-navy from-15% via-navy/85 to-navy/45 max-md:from-navy/95 max-md:via-navy/90 max-md:to-navy/80" />
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-linear-to-t from-navy via-transparent to-navy/70" />

      {/* Security grid + scan line */}
      <div
        aria-hidden="true"
        className="sec-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_72%_38%,#000_0%,transparent_72%)]"
      />
      <div aria-hidden="true" className="scanline -z-10" />

      {/* Viewfinder framing (decorative) */}
      <div aria-hidden="true" className="pointer-events-none absolute top-28 right-12 bottom-44 hidden w-[32%] max-w-md lg:block xl:right-20">
        <Bracket className="top-0 left-0 border-t-2 border-l-2" />
        <Bracket className="top-0 right-0 border-t-2 border-r-2" />
        <Bracket className="bottom-0 left-0 border-b-2 border-l-2" />
        <Bracket className="right-0 bottom-0 border-r-2 border-b-2" />
        <p className="absolute top-4 left-10 flex items-center gap-2 font-display text-[0.65rem] font-bold tracking-[0.2em] text-white/80 uppercase">
          <span className="pulse-dot" />
          Site overview
        </p>
        <span className="absolute top-1/2 left-1/2 block size-10 -translate-x-1/2 -translate-y-1/2">
          <span className="absolute top-1/2 left-0 h-px w-full bg-white/40" />
          <span className="absolute top-0 left-1/2 h-full w-px bg-white/40" />
        </span>
      </div>

      {/* Content */}
      <div className="container-x relative flex flex-1 items-center pt-32 pb-16 md:pb-40">
        <div className="max-w-4xl">
          <p className="eyebrow hero-in text-white" style={delay(80)}>
            <span aria-hidden="true" className="block h-0.5 w-10 bg-signal" />
            {SITE.legalName}
          </p>

          <h1 id="hero-title" className="mt-6 flex gap-4 sm:gap-6">
            <span
              aria-hidden="true"
              className="hero-in block w-1.5 shrink-0 self-stretch bg-signal"
              style={delay(200)}
            />
            <span className="block font-display text-[2.1rem] leading-[1.08] font-extrabold tracking-tight sm:text-5xl lg:text-6xl xl:text-[4.1rem]">
              <span className="hero-in block" style={delay(160)}>
                Professional Security.
              </span>
              <span className="hero-in block" style={delay(300)}>
                Trusted Protection.
              </span>
              <span className="hero-in block text-signal" style={delay(440)}>
                Peace of Mind.
              </span>
            </span>
          </h1>

          <p className="hero-in mt-7 max-w-2xl text-base text-white/85 sm:text-lg md:text-xl md:leading-relaxed" style={delay(580)}>
            Protecting people, property and businesses with disciplined security professionals,
            intelligent monitoring and dependable protection solutions.
          </p>

          <div className="hero-in mt-9 flex flex-col gap-4 sm:flex-row" style={delay(700)}>
            <a href="#contact" className="btn btn-red-dark">
              Get a Security Quote
              <ArrowRight className="arrow size-4" aria-hidden="true" />
            </a>
            <a href="#contact" className="btn btn-outline-light">
              Talk to Tenya
            </a>
          </div>

          <a
            href={SITE.phoneHref}
            className="hero-in group mt-8 inline-flex min-h-12 items-center gap-4 border-l-2 border-signal pl-4"
            style={delay(820)}
          >
            <Phone className="size-5 text-white" aria-hidden="true" />
            <span className="flex flex-col leading-tight">
              <span className="text-xs tracking-[0.16em] text-white/70 uppercase">Call us directly</span>
              <span className="font-display text-lg font-bold tracking-wide transition-colors group-hover:text-white/80">
                {SITE.phone}
              </span>
            </span>
          </a>
        </div>
      </div>

      {/* Tablet bar: phone + quote */}
      <div className="relative hidden bg-signal md:block xl:hidden">
        <div className="container-x flex min-h-14 items-center justify-between font-display text-sm font-bold tracking-[0.1em] text-white uppercase">
          <a href={SITE.phoneHref} className="inline-flex min-h-12 items-center gap-3">
            <Phone className="size-4" aria-hidden="true" />
            Call Tenya · {SITE.phone}
          </a>
          <a href="#contact" className="inline-flex min-h-12 items-center gap-2">
            Request a quote
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Desktop service bar */}
      <div className="relative hidden min-h-16 border-t border-white/10 bg-navy/75 backdrop-blur-sm xl:block">
        <a
          href={SITE.phoneHref}
          className="absolute inset-y-0 left-0 flex w-[38%] items-center bg-signal font-display text-sm font-bold tracking-[0.1em] text-white uppercase [clip-path:polygon(0_0,100%_0,calc(100%-44px)_100%,0_100%)]"
          style={{ paddingLeft: "max(3rem, calc((100vw - 80rem) / 2 + 3rem))" }}
        >
          <Phone className="mr-3 size-4" aria-hidden="true" />
          Call Tenya · {SITE.phone}
        </a>
        <div className="container-x relative flex min-h-16 items-center justify-end">
          <ul className="flex items-center gap-5 py-4 font-display text-[0.8rem] font-bold tracking-[0.12em] text-white uppercase">
            {SERVICES.map((s, i) => (
              <li key={s.id} className="flex items-center gap-5">
                {i > 0 && <span aria-hidden="true" className="size-1 rounded-full bg-signal" />}
                {s.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div aria-hidden="true" className="h-1 bg-signal md:hidden" />
    </section>
  );
}
