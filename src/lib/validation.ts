/* ------------------------------------------------------------------
   Form validation + sanitisation
   NOTE: client-side checks improve UX only. Any backend that receives
   this data MUST re-validate on the server (see server/contact-api.example.mjs).
------------------------------------------------------------------- */

export const LIMITS = {
  nameMin: 2,
  nameMax: 80,
  orgMax: 100,
  emailMax: 254,
  messageMin: 10,
  messageMax: 1500,
} as const;

export type FormValues = {
  fullName: string;
  organization: string;
  phone: string;
  email: string;
  service: string;
  message: string;
};

export type FieldName = keyof FormValues;
export type FieldErrors = Partial<Record<FieldName, string>>;

/* eslint-disable no-control-regex */
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const HTML_TAGS = /<[^>]*>/g;

/** Normalise + strip control characters, angle brackets and HTML tags. */
export function sanitize(value: string, multiline = false): string {
  let v = value.normalize("NFKC").replace(CONTROL_CHARS, "");
  v = v.replace(HTML_TAGS, "").replace(/[<>]/g, "");
  if (multiline) {
    v = v.replace(/\r\n?/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n");
  } else {
    v = v.replace(/\s+/g, " ");
  }
  return v.trim();
}

export function sanitizeValues(v: FormValues): FormValues {
  return {
    fullName: sanitize(v.fullName),
    organization: sanitize(v.organization),
    phone: sanitize(v.phone),
    email: sanitize(v.email).toLowerCase(),
    service: sanitize(v.service),
    message: sanitize(v.message, true),
  };
}

const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}\s'’.\-]*$/u;
const EMAIL_RE = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9](?:[A-Za-z0-9\-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9\-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;
const PHONE_RE = /^\+?\d{9,15}$/;

export function validateField(
  name: FieldName,
  raw: string,
  allowedServices: readonly string[],
): string | undefined {
  const isMultiline = name === "message";
  const value = sanitize(raw, isMultiline);

  switch (name) {
    case "fullName":
      if (!value) return "Please enter your full name.";
      if (value.length < LIMITS.nameMin) return "Your name looks too short.";
      if (value.length > LIMITS.nameMax) return `Please keep your name under ${LIMITS.nameMax} characters.`;
      if (!NAME_RE.test(value)) return "Please use letters only in your name.";
      return;
    case "organization":
      if (value.length > LIMITS.orgMax) return `Please keep this under ${LIMITS.orgMax} characters.`;
      return;
    case "phone": {
      if (!value) return "Please enter a phone number we can reach you on.";
      const digits = value.replace(/[\s\-().]/g, "");
      if (!PHONE_RE.test(digits)) return "Enter a valid phone number, e.g. +254 7XX XXX XXX.";
      return;
    }
    case "email":
      if (!value) return "Please enter your email address.";
      if (value.length > LIMITS.emailMax || !EMAIL_RE.test(value)) return "Enter a valid email address, e.g. name@company.com.";
      return;
    case "service":
      if (!value) return "Please choose the service you are interested in.";
      if (!allowedServices.includes(value)) return "Please choose one of the listed services.";
      return;
    case "message":
      if (!value) return "Please tell us a little about your security needs.";
      if (value.length < LIMITS.messageMin) return `Please add a little more detail (at least ${LIMITS.messageMin} characters).`;
      if (value.length > LIMITS.messageMax) return `Please keep your message under ${LIMITS.messageMax} characters.`;
      return;
  }
}

export const FIELD_ORDER: FieldName[] = ["fullName", "organization", "phone", "email", "service", "message"];

export function validateAll(values: FormValues, allowedServices: readonly string[]): FieldErrors {
  const errors: FieldErrors = {};
  for (const f of FIELD_ORDER) {
    const err = validateField(f, values[f], allowedServices);
    if (err) errors[f] = err;
  }
  return errors;
}

/* ------------------------------------------------------------------
   Lightweight client-side rate limit (UX guard only; the real limit
   must be enforced by the backend).
------------------------------------------------------------------- */
const RL_KEY = "tsg_enquiry_log";
const RL_MAX = 3;
const RL_WINDOW_MS = 15 * 60 * 1000;

function readLog(): number[] {
  try {
    const raw = window.localStorage.getItem(RL_KEY);
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(arr) ? arr.filter((n): n is number => typeof n === "number") : [];
  } catch {
    return [];
  }
}

export function isRateLimited(): boolean {
  const now = Date.now();
  return readLog().filter((t) => now - t < RL_WINDOW_MS).length >= RL_MAX;
}

export function recordSubmission(): void {
  try {
    const now = Date.now();
    const log = readLog().filter((t) => now - t < RL_WINDOW_MS);
    log.push(now);
    window.localStorage.setItem(RL_KEY, JSON.stringify(log));
  } catch {
    /* storage unavailable: ignore */
  }
}
