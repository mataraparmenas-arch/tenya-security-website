import { ArrowRight, Phone } from "lucide-react";
import { SITE } from "@/data/site";
import { Reveal } from "./Reveal";

export function CTA() {
  return (
    <section
      id="request-quote"
      aria-labelledby="cta-title"
      className="on-dark relative isolate overflow-hidden bg-navy py-24 text-white sm:py-32"
    >
      <div
        aria-hidden="true"
        className="sec-grid absolute inset-0 -z-10 opacity-70 [mask-image:linear-gradient(to_right,#000,transparent_75%)]"
      />
      {/* Diagonal red plates echo the TS monogram */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 -z-10 hidden w-[20%] bg-signal [clip-path:polygon(45%_0,100%_0,100%_100%,0_100%)] md:block lg:w-[28%] xl:w-[34%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-[18%] -z-10 hidden w-[3%] bg-white/90 [clip-path:polygon(60%_0,100%_0,40%_100%,0_100%)] md:block lg:right-[26%] xl:right-[32%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-1.5 bg-signal md:hidden"
      />

      <div className="container-x relative">
        <div className="max-w-3xl">
          <Reveal>
            <p className="eyebrow text-white">
              <span aria-hidden="true" className="line-x block h-0.5 w-10 bg-signal" />
              Request a Quote
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2
              id="cta-title"
              className="mt-6 font-display text-[2.4rem] leading-[1.04] font-extrabold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              Your Security Deserves <span className="text-signal">Excellence.</span>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-lg text-white/85 sm:text-xl">
              Let's build a security solution that protects what matters most.
            </p>
          </Reveal>
          <Reveal delay={240} className="mt-10 flex flex-col gap-4 lg:flex-row lg:flex-wrap">
            <a href="#contact" className="btn btn-red-dark">
              Request a Security Quote
              <ArrowRight className="arrow size-4" aria-hidden="true" />
            </a>
            <a href={SITE.phoneHref} className="btn btn-outline-light">
              <Phone className="size-4" aria-hidden="true" />
              Call {SITE.phone}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
