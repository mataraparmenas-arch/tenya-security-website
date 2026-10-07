import { Mail, Phone } from "lucide-react";
import { SITE, whatsappLink } from "@/data/site";
import { ContactForm, type ServicePick } from "./ContactForm";
import { Reveal } from "./Reveal";
import { SectionHeading, WhatsAppIcon } from "./ui";

export function Contact({ servicePick }: { servicePick: ServicePick }) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative bg-mist py-20 sm:py-28">
      <div className="container-x grid gap-8 lg:grid-cols-12 lg:gap-0">
        {/* Direct contact panel */}
        <Reveal variant="left" className="lg:col-span-5">
          <div className="on-dark cut-bl relative h-full overflow-hidden bg-navy p-7 text-white [--cut:56px] sm:p-10 lg:p-12 lg:pr-14">
            <div
              aria-hidden="true"
              className="sec-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom_right,#000,transparent_70%)]"
            />
            <span aria-hidden="true" className="absolute top-0 left-0 h-1.5 w-24 bg-signal" />

            <div className="relative">
              <SectionHeading
                tone="dark"
                index="07"
                eyebrow="Contact"
                titleId="contact-title"
                title="Let's Talk Security"
                intro="Speak to Tenya directly, or send the details of your site and requirements and we will respond to discuss the right protection."
              />

              <dl className="mt-10 space-y-6">
                <div className="flex items-start gap-4">
                  <span className="grid size-12 shrink-0 place-items-center border border-white/25">
                    <Phone className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <dt className="font-display text-[0.7rem] font-bold tracking-[0.2em] text-white/70 uppercase">Phone</dt>
                    <dd>
                      <a
                        href={SITE.phoneHref}
                        className="inline-flex min-h-11 items-center font-display text-xl font-bold tracking-wide transition-colors hover:text-white/75 sm:text-2xl"
                      >
                        {SITE.phone}
                      </a>
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="grid size-12 shrink-0 place-items-center border border-white/25">
                    <Mail className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <dt className="font-display text-[0.7rem] font-bold tracking-[0.2em] text-white/70 uppercase">Email</dt>
                    <dd>
                      <a
                        href={SITE.emailHref}
                        className="inline-flex min-h-11 items-center font-display text-base font-bold tracking-wide break-all transition-colors hover:text-white/75 sm:text-lg"
                      >
                        {SITE.email}
                      </a>
                    </dd>
                  </div>
                </div>
              </dl>

              <div className="mt-10 flex flex-col gap-4">
                <a href={SITE.phoneHref} className="btn btn-red-dark w-full">
                  <Phone className="size-4" aria-hidden="true" />
                  Call {SITE.phone}
                </a>
                <a
                  href={whatsappLink("Hello Tenya Security, I would like to enquire about your security services.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-light w-full"
                >
                  <WhatsAppIcon className="size-4" />
                  Chat on WhatsApp
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>

              <p className="mt-10 border-t border-white/15 pt-6 font-display text-[0.7rem] font-bold tracking-[0.22em] text-white/70 uppercase">
                Integrity with Excellence
              </p>
            </div>
          </div>
        </Reveal>

        {/* Enquiry form */}
        <Reveal variant="right" delay={100} className="lg:col-span-7 lg:-ml-8 lg:mt-12 xl:-ml-10">
          <div className="drop-shadow-[0_30px_40px_rgba(6,6,48,0.14)]">
            <div className="cut-tr bg-white p-6 [--cut:56px] sm:p-10 lg:p-12">
              <h3 className="font-display text-2xl font-extrabold text-navy sm:text-3xl">Request a security quote</h3>
              <p className="mt-2 mb-8 max-w-lg text-navy/75">
                Tell us what you need to protect. A few details help Tenya understand your requirements.
              </p>
              <ContactForm servicePick={servicePick} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
