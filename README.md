# Tenya Security Group Limited: Corporate Website

**Integrity with Excellence.** React + TypeScript + Tailwind CSS (v4) + Vite.

## Brand tokens (strict)
`#060630` navy · `#F50406` red · `#FFFFFF` white · `#F5F6FA` light. Defined in `src/index.css`
(`:root` variables and the Tailwind `@theme`). No other colours are used.

## Structure
```
src/
  App.tsx                    page composition, canonical URL, skip link
  data/site.ts               all copy + company facts (single source of truth)
  lib/validation.ts          form validation, sanitisation, client-side rate limit
  hooks/useBrowser.ts        scroll state, scroll-spy, parallax, in-view
  components/                Navbar, Hero, TrustStrip, Services, WhyTenya, About,
                             SecurityProcess, Technology, Industries, CTA, Contact,
                             ContactForm, Footer, StickyContact, Logo, Reveal, ui
public/_headers              secure response headers (HSTS, CSP, X-Frame-Options, …)
public/robots.txt            add your Sitemap line once the domain is final
server/contact-api.example.mjs   reference backend for the enquiry form
```

## Enquiry form: how delivery works
The site is static, so there are two modes:

1. **Endpoint mode**: set `VITE_FORM_ENDPOINT` (see `.env.example`) and rebuild. The form POSTs
   validated JSON to your server. Deploy `server/contact-api.example.mjs` (or an equivalent
   serverless function) which re-validates everything, rate-limits per IP, checks `Origin`, and
   delivers the email using keys stored in server environment variables.
2. **Fallback mode (default)**: after validation, the visitor gets one-tap, pre-filled
   **WhatsApp** and **Email** buttons to `+254 725 348906` / `tenyasecure1@gmail.com`.

Client-side protections: strict validation, input sanitisation, honeypot field, minimum-time check,
local rate limit, safe error messages. React escapes all rendered output.

## Imagery
Photography is illustrative stock (Pexels) and does not depict Tenya personnel or clients.
Replace the entries in `IMAGES` (`src/data/site.ts`) with Tenya's own photography when available.
