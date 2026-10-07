import { ArrowRight, Check } from "lucide-react";
import { IMAGES, SITE } from "@/data/site";
import { useParallax } from "@/hooks/useBrowser";
import { Monogram } from "./Logo";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./ui";

const PILLARS = [
  "Professional conduct and presentation",
  "Dependable protection for people and property",
  "Peace of mind for every client we serve",
];

export function About() {
  const parallaxRef = useParallax<HTMLDivElement>(0.1);

  return (
    <section id="about" aria-labelledby="about-title" className="relative overflow-hidden bg-mist py-20 sm:py-28">
      {/* Monogram watermark */}
      <Monogram className="pointer-events-none absolute -top-10 -right-32 w-[44rem] max-w-none opacity-[0.045]" />

      <div className="container-x relative grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading
            index="03"
            eyebrow="Who We Are"
            titleId="about-title"
            title="About Tenya Security Group Limited"
          />

          <Reveal delay={160}>
            <p className="mt-6 text-base text-navy/80 sm:text-lg">
              {SITE.legalName} is a professional security company committed to providing dependable
              protection and peace of mind for people, property and businesses.
            </p>
            <p className="mt-4 text-base text-navy/80 sm:text-lg">
              One principle guides everything we do: <strong className="font-bold text-navy">Integrity with Excellence</strong>.
              It shapes how we conduct ourselves, how we plan protection and how we serve every client.
            </p>
          </Reveal>

          <ul className="mt-7 space-y-3">
            {PILLARS.map((p, i) => (
              <Reveal as="li" key={p} delay={220 + i * 70} className="flex items-start gap-3 text-[0.95rem] font-medium text-navy">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center bg-signal text-white">
                  <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                </span>
                {p}
              </Reveal>
            ))}
          </ul>

          <Reveal delay={420} className="mt-10">
            <a href="#process" className="btn btn-outline-dark">
              Learn More
              <ArrowRight className="arrow size-4" aria-hidden="true" />
            </a>
          </Reveal>
        </div>

        <Reveal variant="right" className="lg:col-span-7">
          <div className="relative">
            <div aria-hidden="true" className="absolute -top-4 -right-4 h-1/2 w-1/2 border-2 border-navy/20" />
            <div className="cut-bl relative aspect-4/3 overflow-hidden bg-navy [--cut:84px] sm:aspect-16/11">
              <div ref={parallaxRef} className="absolute inset-x-0 -top-10 -bottom-10 will-change-transform">
                <img
                  src={IMAGES.about.src}
                  srcSet={IMAGES.about.srcSet}
                  sizes="(min-width: 1024px) 55vw, 95vw"
                  width={IMAGES.about.width}
                  height={IMAGES.about.height}
                  alt={IMAGES.about.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
              <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-navy via-navy/55 to-navy/25" />
              <div className="on-dark absolute right-0 bottom-0 left-0 p-6 sm:p-10">
                <div className="flex gap-4">
                  <span aria-hidden="true" className="w-1.5 shrink-0 bg-signal" />
                  <p className="font-display text-2xl leading-[1.05] font-extrabold tracking-tight text-white uppercase sm:text-4xl lg:text-5xl">
                    Integrity
                    <span className="block text-signal">with</span>
                    Excellence
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
