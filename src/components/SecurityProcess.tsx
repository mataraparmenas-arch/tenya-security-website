import { ArrowRight } from "lucide-react";
import { PROCESS_STEPS } from "@/data/site";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./ui";

export function SecurityProcess() {
  return (
    <section id="process" aria-labelledby="process-title" className="bg-white py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          index="04"
          eyebrow="Security Process"
          titleId="process-title"
          title="A Disciplined Approach to Protection"
          intro="Every engagement follows a clear, repeatable path, from understanding your environment to staying vigilant long after deployment."
        />

        <Reveal variant="fade" className="relative mt-16">
          {/* Timeline rails (decorative) */}
          <span aria-hidden="true" className="absolute top-7 right-0 left-0 hidden h-px bg-navy/15 lg:block" />
          <span aria-hidden="true" className="line-x absolute top-7 right-0 left-0 hidden h-0.5 -translate-y-px bg-signal lg:block" style={{ ["--d" as string]: "250ms" }} />
          <span aria-hidden="true" className="absolute top-0 bottom-8 left-7 w-px bg-navy/15 lg:hidden" />
          <span aria-hidden="true" className="line-y absolute top-0 bottom-8 left-[27px] w-0.5 bg-signal lg:hidden" style={{ ["--d" as string]: "250ms" }} />

          <ol className="relative grid gap-12 lg:grid-cols-4 lg:gap-8">
            {PROCESS_STEPS.map((step, i) => (
              <Reveal as="li" key={step.n} delay={200 + i * 150} className="group relative pl-20 lg:pt-[5.5rem] lg:pl-0">
                <span className="absolute top-0 left-0 grid size-14 place-items-center border-2 border-navy bg-white font-display text-xl font-extrabold text-signal transition-colors duration-300 group-hover:border-signal group-hover:bg-signal group-hover:text-white">
                  {step.n}
                </span>
                <h3 className="font-display text-xl font-extrabold tracking-[0.06em] text-navy uppercase">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-xs text-[0.95rem] leading-relaxed text-navy/75">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </Reveal>

        <Reveal className="mt-16 flex flex-col items-start gap-6 border-t border-navy/12 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-lg font-bold text-navy sm:text-xl">
            Ready to begin? <span className="text-navy/70">Let's assess what your site needs.</span>
          </p>
          <a href="#contact" className="btn btn-red">
            Request a Security Quote
            <ArrowRight className="arrow size-4" aria-hidden="true" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
