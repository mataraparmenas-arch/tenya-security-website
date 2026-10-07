import { ArrowRight, Phone } from "lucide-react";
import { IMAGES, SITE, WHY_ITEMS } from "@/data/site";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./ui";

export function WhyTenya() {
  return (
    <section id="why-tenya" aria-labelledby="why-title" className="relative overflow-x-clip bg-white py-20 sm:py-28">
      <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-14 xl:gap-20">
        {/* Visual */}
        <Reveal variant="left" className="lg:col-span-5 lg:self-start lg:sticky lg:top-28">
          <div className="relative mx-auto max-w-md pb-5 pl-5 lg:max-w-none">
            <div aria-hidden="true" className="absolute bottom-0 left-0 h-3/4 w-3/4 border-2 border-signal" />
            <div className="cut-tr relative aspect-4/5 bg-navy [--cut:72px]">
              <img
                src={IMAGES.why.src}
                srcSet={IMAGES.why.srcSet}
                sizes="(min-width: 1024px) 40vw, 90vw"
                width={IMAGES.why.width}
                height={IMAGES.why.height}
                alt={IMAGES.why.alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-navy/80 via-navy/10 to-navy/25" />
              <div className="absolute bottom-0 left-0 max-w-[88%] border-l-4 border-signal bg-white py-4 pr-8 pl-5">
                <p className="font-display text-[0.65rem] font-bold tracking-[0.22em] text-navy/70 uppercase">
                  Our promise
                </p>
                <p className="mt-1 font-display text-lg leading-tight font-extrabold text-navy sm:text-xl">
                  Integrity with Excellence
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Content */}
        <div className="lg:col-span-7">
          <SectionHeading
            index="02"
            eyebrow="Why Choose Tenya"
            titleId="why-title"
            title="Security Is More Than Presence. It's Trust."
            intro="Anyone can place a guard at a gate. Tenya Security focuses on the standards behind the uniform: how people conduct themselves, how situations are anticipated and how clients are served."
          />

          <ol className="mt-10 border-b border-navy/12">
            {WHY_ITEMS.map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 50} className="group relative">
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-0 h-px w-0 bg-signal transition-[width] duration-500 group-hover:w-full"
                />
                <div className="grid grid-cols-[3.25rem_1fr] items-start gap-x-3 border-t border-navy/12 py-5 transition-transform duration-300 group-hover:translate-x-1.5">
                  <span aria-hidden="true" className="pt-0.5 font-display text-xl font-extrabold text-signal">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-navy">{item.title}</h3>
                    <p className="mt-1 text-[0.95rem] leading-relaxed text-navy/70">{item.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-8">
            <a href="#contact" className="btn btn-red">
              Request a Security Quote
              <ArrowRight className="arrow size-4" aria-hidden="true" />
            </a>
            <a
              href={SITE.phoneHref}
              className="inline-flex min-h-12 items-center justify-center gap-3 font-display text-sm font-bold tracking-wide text-navy hover:text-signal sm:justify-start"
            >
              <Phone className="size-4 text-signal" aria-hidden="true" />
              Call {SITE.phone}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
