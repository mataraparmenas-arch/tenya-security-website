# TENYA SECURITY GROUP LIMITED

> **INTEGRITY WITH EXCELLENCE**

**Professional Security • Trusted Protection • Peace of Mind**

The official corporate website for **Tenya Security Group Limited**, a professional security services company focused on dependable protection, vigilance and client-focused security solutions.

---

## Overview

The Tenya Security website is designed as a modern, premium digital presence for a professional security company.

The platform communicates Tenya's commitment to:

* Professional security
* Trusted protection
* Peace of mind
* Integrity
* Excellence
* Vigilance
* Responsive service
* Modern security solutions

The website is intentionally designed to combine **corporate credibility, modern technology, strong visual identity and conversion-focused UX**.

---

## Brand

### Company

**TENYA SECURITY GROUP LIMITED**

### Public Brand

**TENYA SECURITY**

### Tagline

**INTEGRITY WITH EXCELLENCE**

### Contact

**Phone:** +254 725 348906

**Email:** [tenyasecure1@gmail.com](mailto:tenyasecure1@gmail.com)

---

## Brand Colors

The website uses the official Tenya Security brand palette.

| Token            | Color     | Usage                                          |
| ---------------- | --------- | ---------------------------------------------- |
| Primary Navy     | `#060630` | Headers, navigation, typography, dark sections |
| Secondary Red    | `#F50406` | CTAs, accents, highlights                      |
| White            | `#FFFFFF` | Backgrounds and light text                     |
| Light Background | `#F5F6FA` | Section backgrounds                            |
| Dark Text        | `#060630` | Primary typography                             |

These colors should remain consistent throughout the application.

---

## Core Services

The website presents the following security solutions:

### Manned Guarding

Professional security personnel providing visible deterrence, access control, surveillance and protection for people and property.

### Mobile Patrols

Mobile security patrol solutions designed to increase security visibility, deterrence and responsive support.

### CCTV Monitoring

Technology-enabled surveillance and monitoring solutions designed to support security awareness and incident response.

### Commercial Security

Security solutions designed for offices, commercial properties, facilities and business environments.

---

## Website Experience

The website includes:

* Premium responsive navigation
* Hero section
* Security-focused messaging
* Services showcase
* About Tenya
* Why Tenya
* Security process
* Technology section
* Industries served
* Conversion-focused CTAs
* Contact form
* Direct telephone contact
* Responsive mobile experience
* Accessibility considerations
* SEO metadata
* Security-conscious application architecture

---

## Design Philosophy

The visual language is based on:

**Corporate + Futuristic + Trusted + Precise + Premium**

The design deliberately avoids the typical generic security-company aesthetic.

Instead, it uses:

* Strong geometric typography
* High contrast
* Generous whitespace
* Structured layouts
* Controlled animation
* Navy/red visual hierarchy
* Modern security imagery
* Precise micro-interactions

The goal is to make a prospective corporate client immediately feel:

> **"This is a professional security company I can trust."**

---

## Technology

The preferred technology stack is:

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* Modern semantic HTML
* Responsive CSS
* Component-based architecture

The implementation should prioritize:

* Maintainability
* Performance
* Accessibility
* Security
* SEO
* Responsive design
* Clean component architecture

---

## Project Structure

Recommended structure:

```text
tenya-security-website/
│
├── .github/
│   ├── CODEOWNERS
│   ├── dependabot.yml
│   └── workflows/
│       ├── ci.yml
│       └── codeql.yml
│
├── public/
│   ├── images/
│   ├── icons/
│   ├── logo/
│   └── favicon/
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── ...
│   │
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── TrustStrip.tsx
│   │   ├── Services.tsx
│   │   ├── WhyTenya.tsx
│   │   ├── About.tsx
│   │   ├── SecurityProcess.tsx
│   │   ├── Technology.tsx
│   │   ├── Industries.tsx
│   │   ├── CTA.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   │
│   ├── data/
│   │   └── services.ts
│   │
│   ├── lib/
│   │   └── ...
│   │
│   └── types/
│       └── ...
│
├── docs/
│   ├── BRAND.md
│   └── SECURITY.md
│
├── .env.example
├── .gitignore
├── LICENSE
├── README.md
├── SECURITY.md
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## Local Development

### Prerequisites

Install:

* Node.js 20+
* npm, pnpm or yarn
* Git

### Clone

```bash
git clone https://github.com/YOUR-USERNAME/tenya-security-website.git
cd tenya-security-website
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Copy:

```bash
cp .env.example .env.local
```

Never commit `.env.local`.

### Start development

```bash
npm run dev
```

The development server will be available at:

```text
http://localhost:3000
```

### Production build

```bash
npm run build
```

### Production start

```bash
npm run start
```

### Lint

```bash
npm run lint
```

---

## Environment Variables

Use environment variables for configuration and secrets.

Example:

```env
NEXT_PUBLIC_SITE_URL=
CONTACT_FORM_ENDPOINT=
```

Do not commit:

* API keys
* Private tokens
* Database credentials
* SMTP passwords
* Authentication secrets
* Deployment credentials
* Third-party private keys

Only variables explicitly intended for browser exposure should use the `NEXT_PUBLIC_` prefix.

---

## Security

Security is a first-class requirement of this project.

The repository should use:

* Dependency monitoring
* Secret scanning
* Push protection
* Code scanning
* Secure dependency updates
* Server-side input validation
* Output encoding
* Rate limiting for public forms
* CSRF protection where applicable
* Secure HTTP headers
* Content Security Policy where practical
* HTTPS in production
* No secrets in source control

See [`SECURITY.md`](./SECURITY.md) for vulnerability reporting.

---

## Accessibility

The website aims to follow **WCAG 2.2 AA** principles where practical.

Accessibility considerations include:

* Semantic HTML
* Keyboard navigation
* Visible focus states
* Accessible forms
* Proper labels
* Meaningful alternative text
* Appropriate color contrast
* Reduced-motion support
* Responsive layouts

---

## SEO

The website is structured for search visibility around relevant services such as:

* Tenya Security
* Security company in Kenya
* Professional security services
* Manned guarding
* Mobile security patrols
* CCTV monitoring
* Commercial security

SEO implementation should include:

* Descriptive page titles
* Meta descriptions
* Open Graph metadata
* Semantic headings
* Structured data
* Canonical URLs
* Sitemap
* Robots directives

No keyword stuffing.

---

## Content Integrity

The website must not fabricate:

* Client names
* Government contracts
* Certifications
* Awards
* Security statistics
* Employee counts
* Years of operation
* Crime-reduction percentages
* Partnerships
* Testimonials

Any future claims should be verified and approved before publication.

---

## Contribution

Contributions should preserve the Tenya Security brand and security standards.

Before opening a pull request:

```bash
npm run lint
npm run build
```

Pull requests should clearly explain:

1. What changed
2. Why it changed
3. How it was tested
4. Any security implications
5. Any accessibility implications

---

## Deployment

The application can be deployed to a modern Node.js-compatible hosting platform.

Recommended production requirements:

* HTTPS
* Secure headers
* Environment variables
* Automated builds
* Dependency monitoring
* Error monitoring
* Domain configuration
* DNS security
* Backup/recovery strategy

---

## Brand Usage

Do not alter the official brand palette.

```css
:root {
  --primary-navy: #060630;
  --secondary-red: #F50406;
  --white: #FFFFFF;
  --light-bg: #F5F6FA;
  --dark-text: #060630;
}
```

The brand identity should consistently communicate:

> **INTEGRITY WITH EXCELLENCE**

---

## Contact

**TENYA SECURITY GROUP LIMITED**

**Phone:** +254 725 348906

**Email:** [tenyasecure1@gmail.com](mailto:tenyasecure1@gmail.com)

---

## License

Copyright © 2026 Tenya Security Group Limited.

Unless otherwise stated, the website's branding, visual assets, copy and proprietary materials remain the property of Tenya Security Group Limited.

See [`LICENSE`](./LICENSE) for repository-specific licensing terms.

---

## Status

**Production Website**

Built for **Tenya Security Group Limited**.

**Professional Security • Trusted Protection • Peace of Mind**
