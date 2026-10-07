import { useCallback, useEffect, useState } from "react";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import type { ServicePick } from "@/components/ContactForm";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Industries } from "@/components/Industries";
import { Navbar } from "@/components/Navbar";
import { SecurityProcess } from "@/components/SecurityProcess";
import { Services } from "@/components/Services";
import { StickyContact } from "@/components/StickyContact";
import { Technology } from "@/components/Technology";
import { TrustStrip } from "@/components/TrustStrip";
import { WhyTenya } from "@/components/WhyTenya";

export default function App() {
  const [servicePick, setServicePick] = useState<ServicePick>(null);
  const pickService = useCallback((title: string) => setServicePick({ title, nonce: Date.now() }), []);

  // Canonical URL support: always points at the page's real, served address
  useEffect(() => {
    if (!window.location.protocol.startsWith("http")) return;
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = `${window.location.origin}${window.location.pathname}`;
  }, []);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-white focus:px-5 focus:py-3 focus:font-display focus:text-sm focus:font-bold focus:text-navy focus:shadow-lg"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <TrustStrip />
        <Services onSelectService={pickService} />
        <WhyTenya />
        <About />
        <SecurityProcess />
        <Technology />
        <Industries />
        <CTA />
        <Contact servicePick={servicePick} />
      </main>
      <Footer />
      <StickyContact />
    </>
  );
}
