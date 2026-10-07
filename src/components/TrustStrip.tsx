import { TRUST_ITEMS } from "@/data/site";
import { Reveal } from "./Reveal";

export function TrustStrip() {
  return (
    <section id="trust" aria-label="What Tenya stands for" className="border-b border-navy/10 bg-white">
      <div className="container-x">
        <ul className="grid divide-y divide-navy/10 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {TRUST_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal
                as="li"
                key={item.label}
                delay={i * 80}
                className="group flex items-start gap-4 py-6 sm:py-8 lg:px-8 lg:first:pl-0 lg:last:pr-0"
              >
                <span className="relative grid size-12 shrink-0 place-items-center border border-navy/15 text-navy transition-colors duration-300 group-hover:border-signal group-hover:text-signal">
                  <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
                  <span aria-hidden="true" className="absolute -top-px -right-px size-2 bg-signal" />
                </span>
                <div>
                  <p className="font-display text-[0.8rem] font-extrabold tracking-[0.12em] text-navy uppercase">
                    {item.label}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-navy/70">{item.text}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
