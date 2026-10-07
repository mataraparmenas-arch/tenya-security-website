import { ArrowUpRight } from "lucide-react";
import { INDUSTRIES } from "@/data/site";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./ui";

export function Industries() {
  return (
    <section id="industries" aria-labelledby="industries-title" className="bg-white py-20 sm:py-28">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            index="06"
            eyebrow="Industries We Can Serve"
            titleId="industries-title"
            title="Protection for the Places That Matter"
            intro="Whatever the environment, Tenya shapes its approach around the people, property and risks involved. These are some of the settings we can protect."
          />
          <Reveal delay={200}>
            <a
              href="#contact"
              className="inline-flex min-h-12 items-center gap-2 font-display text-sm font-bold tracking-[0.08em] text-navy uppercase underline decoration-signal decoration-2 underline-offset-[7px] hover:text-signal"
            >
              Discuss your environment
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </Reveal>
        </div>

        <ul className="mt-14 grid border-t border-l border-navy/12 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal
                as="li"
                key={item.title}
                delay={(i % 3) * 90}
                className="group relative border-r border-b border-navy/12 bg-white transition-colors duration-300 hover:bg-navy focus-within:bg-navy"
              >
                <a href="#contact" className="block h-full p-7 sm:p-9 focus-visible:outline-offset-[-6px]">
                  <span
                    aria-hidden="true"
                    className="absolute top-0 left-0 h-1 w-0 bg-signal transition-[width] duration-500 group-hover:w-full group-focus-within:w-full"
                  />
                  <span className="flex items-start justify-between">
                    <Icon
                      className="size-9 text-navy transition-colors duration-300 group-hover:text-white group-focus-within:text-white"
                      strokeWidth={1.4}
                      aria-hidden="true"
                    />
                    <ArrowUpRight
                      className="size-5 -translate-x-1 translate-y-1 text-signal opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:translate-y-0 group-focus-within:opacity-100"
                      aria-hidden="true"
                    />
                  </span>
                  <h3 className="mt-8 font-display text-lg font-extrabold tracking-wide text-navy transition-colors duration-300 group-hover:text-white group-focus-within:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-navy/70 transition-colors duration-300 group-hover:text-white/80 group-focus-within:text-white/80">
                    {item.text}
                  </p>
                </a>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
