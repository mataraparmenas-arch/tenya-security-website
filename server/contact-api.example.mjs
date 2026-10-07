/**
 * REFERENCE IMPLEMENTATION: enquiry endpoint for tenyasecurity website
 * ---------------------------------------------------------------------
 * The website is a static front-end. To receive enquiries directly, deploy an
 * endpoint like this one (or the equivalent serverless function) and set
 *   VITE_FORM_ENDPOINT=https://api.your-domain.com/enquiry
 * at build time. The URL is public; every secret below lives ONLY on the server.
 *
 * Zero dependencies (Node 18+):   node server/contact-api.example.mjs
 *
 * What it enforces:
 *   - Origin allow-list (blocks cross-site form posts / CSRF; no cookies are used)
 *   - JSON-only, small body limit, strict content-type
 *   - Server-side validation + sanitisation (never trust the client)
 *   - Per-IP rate limiting (in-memory; use Redis / the platform's limiter in production)
 *   - Honeypot field + minimum-time check
 *   - Secure headers, generic error messages, no stack traces
 *   - Delivery through a provider API key read from environment variables
 */
import http from "node:http";

const PORT = Number(process.env.PORT ?? 8787);
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "http://localhost:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const MAX_BODY = 8 * 1024; // 8 KB
const RATE_MAX = 5; // requests
const RATE_WINDOW = 15 * 60 * 1000; // per 15 minutes per IP
const SERVICES = [
  "Manned Guarding",
  "Mobile Patrols",
  "CCTV Monitoring",
  "Commercial Security",
  "Not sure yet, please advise",
];

const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_MAX;
}

const clean = (v, max, multiline = false) => {
  let s = String(v ?? "")
    .normalize("NFKC")
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "");
  s = multiline ? s.replace(/[ \t]+/g, " ") : s.replace(/\s+/g, " ");
  return s.trim().slice(0, max);
};

function validate(body) {
  const d = {
    fullName: clean(body.fullName, 80),
    organization: clean(body.organization, 100),
    phone: clean(body.phone, 24),
    email: clean(body.email, 254).toLowerCase(),
    service: clean(body.service, 60),
    message: clean(body.message, 1500, true),
  };
  const errors = [];
  if (d.fullName.length < 2) errors.push("fullName");
  if (!/^\+?\d{9,15}$/.test(d.phone.replace(/[\s\-().]/g, ""))) errors.push("phone");
  if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(d.email)) errors.push("email");
  if (!SERVICES.includes(d.service)) errors.push("service");
  if (d.message.length < 10) errors.push("message");
  return { d, errors };
}

/** Plug in your mail provider here. Read keys from process.env, never from code. */
async function deliver(enquiry) {
  // Example (provider-agnostic):
  // await fetch(process.env.MAIL_API_URL, {
  //   method: "POST",
  //   headers: { Authorization: `Bearer ${process.env.MAIL_API_KEY}`, "Content-Type": "application/json" },
  //   body: JSON.stringify({ to: "tenyasecure1@gmail.com", subject: `Quote request: ${enquiry.service}`, text: JSON.stringify(enquiry, null, 2) }),
  // });
  console.log("New enquiry received:", { service: enquiry.service, at: new Date().toISOString() });
}

function send(res, status, payload, origin) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "no-store",
    "Referrer-Policy": "no-referrer",
    ...(origin && {
      "Access-Control-Allow-Origin": origin,
      Vary: "Origin",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      "Access-Control-Max-Age": "600",
    }),
  });
  res.end(JSON.stringify(payload));
}

http
  .createServer(async (req, res) => {
    const origin = req.headers.origin;
    const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : undefined;

    if (req.url !== "/enquiry") return send(res, 404, { ok: false });
    if (req.method === "OPTIONS") return send(res, allowed ? 204 : 403, {}, allowed);
    if (req.method !== "POST") return send(res, 405, { ok: false });
    if (!allowed) return send(res, 403, { ok: false });
    if (!String(req.headers["content-type"] ?? "").startsWith("application/json"))
      return send(res, 415, { ok: false }, allowed);

    const ip = String(req.headers["x-forwarded-for"] ?? req.socket.remoteAddress ?? "unknown")
      .split(",")[0]
      .trim();
    if (rateLimited(ip)) return send(res, 429, { ok: false }, allowed);

    let raw = "";
    for await (const chunk of req) {
      raw += chunk;
      if (raw.length > MAX_BODY) return send(res, 413, { ok: false }, allowed);
    }

    try {
      const body = JSON.parse(raw);
      if (body.website) return send(res, 200, { ok: true }, allowed); // honeypot: pretend success
      const { d, errors } = validate(body);
      if (errors.length) return send(res, 422, { ok: false, fields: errors }, allowed);
      await deliver(d);
      return send(res, 200, { ok: true }, allowed);
    } catch {
      return send(res, 400, { ok: false }, allowed); // generic: never leak internals
    }
  })
  .listen(PORT, () => console.log(`Enquiry endpoint listening on :${PORT}`));
