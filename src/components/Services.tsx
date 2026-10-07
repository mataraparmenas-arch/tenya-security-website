import { useId, useState } from "react";
import { ArrowRight, Check, Plus } from "lucide-react";
import { cn } from "@/utils/cn";
import { SERVICES, type Service } from "@/data/site";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./ui";

type Props = { onSelectService: (title: string) => void };

function ServiceCard({
  service,
  index,
  onSelectService,
}: {
  service: Service;
  index: number;
  onSelectService: (title: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const Icon = service.icon;

  return (
    <Reveal as="li" delay={index * 90} className="self-start">
      <div className="group transition-[transform,filter] duration-300 ease-out hover:-translate-y-1.5 hover:drop-shadow-[0_22px_24px_rgba(6,6,48,0.16)] has-focus-visible:-translate-y-1.5">
        {/* Outer layer = 1px border that turns red on hover */}
        <div className="cut-tr bg-navy/15 p-px transition-colors duration-300 [--cut:34px] group-hover:bg-signal group-has-focus-visible:bg-signal">
          <article className="cut-tr bg-white p-6 [--cut:33px] sm:p-7">
            <div className="flex items-start justify-between">
              <span className="grid size-14 place-items-center bg-navy text-white transition-colors duration-300 group-hover:bg-signal">
                <Icon className="size-7" strokeWidth={1.6} aria-hidden="true" />
              </span>
              <span aria-hidden="true" className="font-display text-4xl leading-none font-extrabold text-navy/15">
                0{index + 1}
              </span>
            </div>

            <h3 className="mt-7 font-display text-lg font-extrabold tracking-[0.04em] text-navy uppercase">
              {service.title}
            </h3>
            <span aria-hidden="true" className="mt-3 block h-0.5 w-8 bg-signal transition-all duration-300 group-hover:w-20" />
            <p className="mt-4 text-[0.95rem] leading-relaxed text-navy/75">{service.description}</p>

            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls={panelId}
              className="mt-5 inline-flex min-h-11 items-center gap-2 font-display text-[0.8rem] font-bold tracking-[0.1em] text-navy uppercase transition-colors hover:text-signal"
            >
              {open ? "Show less" : "Learn more"}
              <Plus
                className={cn("size-4 text-signal transition-transform duration-300", open && "rotate-45")}
                aria-hidden="true"
              />
            </button>

            <div id={panelId} className="expand" data-open={open} inert={!open}>
              <div>
                <ul className="mt-2 space-y-2.5 border-t border-navy/10 pt-4">
                  {service.points.map((p) => (
                    <li key={p} className="flex gap-3 text-sm text-navy/80">
                      <Check className="mt-0.5 size-4 shrink-0 text-signal" strokeWidth={2.5} aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  onClick={() => onSelectService(service.title)}
                  className="mt-5 mb-1 inline-flex min-h-11 items-center gap-2 font-display text-[0.8rem] font-bold tracking-[0.08em] text-navy uppercase underline decoration-signal decoration-2 underline-offset-[6px] hover:text-signal"
                >
                  Request a quote for this service
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </Reveal>
  );
}

export function Services({ onSelectService }: Props) {
  return (
    <section id="services" aria-labelledby="services-title" className="relative bg-mist py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          index="01"
          eyebrow="Our Services"
          titleId="services-title"
          title="Security Solutions Built Around Your Needs"
          intro="From visible guarding to technology-enabled monitoring, every Tenya service is designed to protect people, property and business continuity."
        />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} onSelectService={onSelectService} />
          ))}
        </ul>

        <Reveal className="mt-14">
          <div className="flex flex-col items-start justify-between gap-6 border-t border-navy/15 pt-8 md:flex-row md:items-center">
            <p className="max-w-xl font-display text-lg font-bold text-navy sm:text-xl">
              Not sure which service fits your site?{" "}
              <span className="text-navy/70">Tell us about it and Tenya will advise.</span>
            </p>
            <a href="#contact" onClick={() => onSelectService("Not sure yet, please advise")} className="btn btn-red">
              Request a Security Quote
              <ArrowRight className="arrow size-4" aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
