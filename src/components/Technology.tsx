import { ArrowRight } from "lucide-react";
import { IMAGES, TECH_ITEMS } from "@/data/site";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./ui";

function Bracket({ className }: { className: string }) {
  return <span aria-hidden="true" className={`absolute size-6 border-white/70 ${className}`} />;
}

function Tag({ className, children }: { className: string; children: string }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute flex items-center gap-2 border border-white/25 bg-navy/70 px-2.5 py-1.5 font-display text-[0.62rem] font-bold tracking-[0.18em] text-white uppercase backdrop-blur-sm ${className}`}
    >
      <span className="pulse-dot" />
      {children}
    </span>
  );
}

export function Technology() {
  return (
    <section
      id="technology"
      aria-labelledby="tech-title"
      className="on-dark relative overflow-hidden bg-navy py-20 text-white sm:py-28"
    >
      <div
        aria-hidden="true"
        className="sec-grid absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_85%_30%,#000,transparent_70%)]"
      />

      <div className="container-x relative grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-14">
        <div className="lg:col-span-6">
          <SectionHeading
            tone="dark"
            index="05"
            eyebrow="Technology & Monitoring"
            titleId="tech-title"
            title="Security Powered by People & Technology"
            intro="Skilled people remain at the centre of every Tenya solution. Surveillance, monitoring and communication tools extend what they can see, share and respond to."
          />

          <ul className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {TECH_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <Reveal as="li" key={item.title} delay={i * 70} className="group flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center border border-white/25 text-white transition-colors duration-300 group-hover:border-signal group-hover:bg-signal">
                    <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display text-[0.95rem] font-bold tracking-wide text-white">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/75">{item.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </ul>

          <Reveal delay={200} className="mt-10">
            <a href="#contact" className="btn btn-red-dark">
              Discuss Your Security Needs
              <ArrowRight className="arrow size-4" aria-hidden="true" />
            </a>
          </Reveal>
        </div>

        {/* Monitoring interface visual */}
        <Reveal variant="right" className="lg:col-span-6">
          <div className="relative">
            <div className="cut-tr relative aspect-4/3 overflow-hidden bg-navy [--cut:64px] sm:aspect-5/4 lg:aspect-4/4">
              <img
                src={IMAGES.technology.src}
                srcSet={IMAGES.technology.srcSet}
                sizes="(min-width: 1024px) 45vw, 95vw"
                width={IMAGES.technology.width}
                height={IMAGES.technology.height}
                alt={IMAGES.technology.alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-navy/55" />
              <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-navy via-transparent to-navy/50" />

              {/* Interface overlay (decorative) */}
              <div
                aria-hidden="true"
                className="sec-grid absolute inset-0 opacity-60"
              />
              <div aria-hidden="true" className="absolute inset-4 sm:inset-6">
                <Bracket className="top-0 left-0 border-t-2 border-l-2" />
                <Bracket className="top-0 right-0 border-t-2 border-r-2" />
                <Bracket className="bottom-0 left-0 border-b-2 border-l-2" />
                <Bracket className="right-0 bottom-0 border-r-2 border-b-2" />
                <span className="sweep-line absolute right-0 left-0 h-0.5 bg-signal/80 shadow-[0_0_18px_rgba(245,4,6,0.6)]" />
              </div>

              <Tag className="top-9 left-9 sm:top-12 sm:left-12">CCTV</Tag>
              <Tag className="top-1/2 right-9 sm:right-12">Patrol</Tag>
              <Tag className="bottom-24 left-9 sm:left-12">Comms</Tag>

              <div aria-hidden="true" className="absolute right-6 bottom-6 flex items-end gap-1.5 sm:right-10 sm:bottom-10">
                <span className="mr-2 font-display text-[0.62rem] font-bold tracking-[0.18em] text-white/80 uppercase">
                  Monitoring
                </span>
                {[14, 22, 30, 20, 26].map((h, i) => (
                  <span
                    key={i}
                    className="signal-bar w-1.5 bg-signal"
                    style={{ height: h, ["--d" as string]: `${i * 180}ms` }}
                  />
                ))}
              </div>
            </div>
            <div aria-hidden="true" className="absolute -bottom-3 -left-3 h-1/3 w-1/3 border-b-2 border-l-2 border-signal" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
