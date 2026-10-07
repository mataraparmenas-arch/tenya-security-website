import {
  Binoculars,
  Briefcase,
  Building2,
  Cctv,
  Crosshair,
  Eye,
  HardHat,
  House,
  Landmark,
  Monitor,
  Radio,
  Route,
  ShieldCheck,
  Store,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------
   Company facts: ONLY information supplied by Tenya Security.
------------------------------------------------------------------- */
export const SITE = {
  legalName: "Tenya Security Group Limited",
  brand: "Tenya Security",
  tagline: "Integrity with Excellence",
  phone: "+254 725 348906",
  phoneHref: "tel:+254725348906",
  whatsappNumber: "254725348906",
  email: "tenyasecure1@gmail.com",
  emailHref: "mailto:tenyasecure1@gmail.com",
} as const;

export const whatsappLink = (text?: string) =>
  `https://wa.me/${SITE.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

/* ------------------------------------------------------------------
   Navigation
------------------------------------------------------------------- */
export const NAV_LINKS = [
  { label: "Home", href: "#home", id: "home" },
  { label: "Services", href: "#services", id: "services" },
  { label: "About Us", href: "#about", id: "about" },
  { label: "Why Tenya", href: "#why-tenya", id: "why-tenya" },
  { label: "Contact", href: "#contact", id: "contact" },
] as const;

/* Every page section, in document order (used for scroll-spy) */
export const SECTION_IDS = [
  "home",
  "trust",
  "services",
  "why-tenya",
  "about",
  "process",
  "technology",
  "industries",
  "request-quote",
  "contact",
] as const;

/* ------------------------------------------------------------------
   Imagery (Pexels, illustrative stock; not Tenya personnel or clients)
------------------------------------------------------------------- */
const px = (id: number, w: number, h: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

export type Img = {
  src: string;
  srcSet: string;
  alt: string;
  width: number;
  height: number;
};

const make = (id: number, ratio: number, widths: number[], alt: string): Img => {
  const mid = widths[Math.floor(widths.length / 2)];
  return {
    src: px(id, mid, Math.round(mid / ratio)),
    srcSet: widths.map((w) => `${px(id, w, Math.round(w / ratio))} ${w}w`).join(", "),
    alt,
    width: mid,
    height: Math.round(mid / ratio),
  };
};

export const IMAGES = {
  hero: make(
    29935587,
    1.5,
    [800, 1280, 1920],
    "Uniformed security guard standing near the entrance of a modern office building at night",
  ),
  why: make(
    27831371,
    0.8,
    [560, 840, 1100],
    "Uniformed security officer on duty ascending steps outside a building",
  ),
  about: make(
    29069329,
    1.5,
    [640, 960, 1400],
    "Nairobi city skyline at dusk with illuminated office towers",
  ),
  technology: make(
    30481728,
    1.5,
    [640, 960, 1400],
    "Modern security control room with operators monitoring surveillance screens",
  ),
} as const;

/* ------------------------------------------------------------------
   Trust strip
------------------------------------------------------------------- */
export const TRUST_ITEMS = [
  { label: "Professional Security", text: "Disciplined personnel who uphold clear standards.", icon: ShieldCheck },
  { label: "Trusted Protection", text: "Built on integrity and delivered with care.", icon: Eye },
  { label: "Responsive Support", text: "Reachable and ready when it matters.", icon: Radio },
  { label: "Integrity & Excellence", text: "The promise behind every post we cover.", icon: Crosshair },
] as const satisfies readonly { label: string; text: string; icon: LucideIcon }[];

/* ------------------------------------------------------------------
   Services
------------------------------------------------------------------- */
export type Service = {
  id: string;
  title: string;
  description: string;
  points: string[];
  icon: LucideIcon;
};

export const SERVICES: Service[] = [
  {
    id: "manned-guarding",
    title: "Manned Guarding",
    description:
      "Professional security personnel providing visible deterrence, access control, surveillance and protection for people and property.",
    points: [
      "Visible deterrence for people and property",
      "Access control at entry and exit points",
      "Attentive on-site observation and surveillance",
    ],
    icon: ShieldCheck,
  },
  {
    id: "mobile-patrols",
    title: "Mobile Patrols",
    description:
      "Responsive mobile security patrol solutions designed to increase visibility, deterrence and rapid response.",
    points: [
      "Increased visibility and deterrence",
      "Responsive attendance when situations develop",
      "Patrol plans shaped around your premises",
    ],
    icon: Route,
  },
  {
    id: "cctv-monitoring",
    title: "CCTV Monitoring",
    description:
      "Technology-enabled surveillance and monitoring solutions designed to help detect, monitor and respond to security incidents.",
    points: [
      "Camera surveillance of the areas that matter",
      "Monitoring to help detect incidents early",
      "Information that supports a faster response",
    ],
    icon: Cctv,
  },
  {
    id: "commercial-security",
    title: "Commercial Security",
    description:
      "Integrated security solutions designed for offices, commercial properties, facilities and business environments.",
    points: [
      "Offices, commercial properties and facilities",
      "People, patrols and technology working together",
      "A single, coordinated security approach",
    ],
    icon: Building2,
  },
];

export const SERVICE_OPTIONS = [
  ...SERVICES.map((s) => s.title),
  "Not sure yet, please advise",
] as const;

/* ------------------------------------------------------------------
   Why Tenya
------------------------------------------------------------------- */
export const WHY_ITEMS = [
  { title: "Professionalism", text: "Disciplined, well-presented personnel who represent your business with pride." },
  { title: "Integrity", text: "Honest, accountable conduct is the foundation of every engagement." },
  { title: "Vigilance", text: "Constant awareness that helps prevent incidents before they escalate." },
  { title: "Responsiveness", text: "Clear communication and dependable support when you need it." },
  { title: "Client-Focused Service", text: "Solutions shaped around your premises, your people and your priorities." },
  { title: "Consistent Standards", text: "The same dependable approach, shift after shift." },
  { title: "Modern Security Thinking", text: "People supported by technology and proactive planning." },
] as const;

/* ------------------------------------------------------------------
   Process
------------------------------------------------------------------- */
export const PROCESS_STEPS = [
  { n: "01", title: "Assess", text: "Understand the client's security environment and requirements." },
  { n: "02", title: "Plan", text: "Develop a security approach tailored to the client's needs." },
  { n: "03", title: "Protect", text: "Deploy appropriate personnel, patrols and security solutions." },
  { n: "04", title: "Respond", text: "Maintain vigilance and responsive support." },
] as const;

/* ------------------------------------------------------------------
   Technology
------------------------------------------------------------------- */
export const TECH_ITEMS = [
  { title: "CCTV Surveillance", text: "Camera coverage of the areas that matter most.", icon: Cctv },
  { title: "Monitoring", text: "Attentive observation to help detect issues early.", icon: Monitor },
  { title: "Communication", text: "Clear channels between teams, patrols and clients.", icon: Radio },
  { title: "Mobile Response", text: "Patrol teams positioned to attend and support.", icon: Route },
  { title: "Situational Awareness", text: "A clear picture of what is happening on site.", icon: Binoculars },
  { title: "Proactive Operations", text: "Planning and vigilance that stay ahead of risk.", icon: Crosshair },
] as const satisfies readonly { title: string; text: string; icon: LucideIcon }[];

/* ------------------------------------------------------------------
   Industries (areas Tenya can serve)
------------------------------------------------------------------- */
export const INDUSTRIES = [
  { title: "Corporate Offices", text: "Reception, access control and after-hours protection.", icon: Briefcase },
  { title: "Commercial Properties", text: "Visible security for tenants, visitors and assets.", icon: Building2 },
  { title: "Residential Communities", text: "Calm, dependable protection for homes and estates.", icon: House },
  { title: "Retail", text: "Deterrence and customer-friendly vigilance on the shop floor.", icon: Store },
  { title: "Construction Sites", text: "Securing materials, equipment and access points.", icon: HardHat },
  { title: "Facilities & Institutions", text: "Structured security for busy, people-centred environments.", icon: Landmark },
] as const satisfies readonly { title: string; text: string; icon: LucideIcon }[];
