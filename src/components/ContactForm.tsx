import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, Check, ChevronDown, CircleAlert, LoaderCircle, Mail, Send } from "lucide-react";
import { cn } from "@/utils/cn";
import { SERVICE_OPTIONS, SITE, whatsappLink } from "@/data/site";
import {
  FIELD_ORDER,
  LIMITS,
  isRateLimited,
  recordSubmission,
  sanitizeValues,
  validateAll,
  validateField,
  type FieldErrors,
  type FieldName,
  type FormValues,
} from "@/lib/validation";
import { WhatsAppIcon } from "./ui";

/* Optional PUBLIC endpoint (a URL, not a secret). If it is not configured the form
   prepares the enquiry for direct sending by WhatsApp or email. */
const ENDPOINT = (import.meta.env.VITE_FORM_ENDPOINT ?? "").trim();
const HAS_ENDPOINT = /^(https:\/\/|\/)/.test(ENDPOINT);

const EMPTY: FormValues = {
  fullName: "",
  organization: "",
  phone: "",
  email: "",
  service: "",
  message: "",
};

const LABELS: Record<FieldName, string> = {
  fullName: "Full name",
  organization: "Company / organization",
  phone: "Phone number",
  email: "Email",
  service: "Security service",
  message: "Message",
};

type Status = "idle" | "submitting" | "success";
type Mode = "sent" | "prepare";

export type ServicePick = { title: string; nonce: number } | null;

const fieldId = (n: FieldName) => `cf-${n}`;

function inputClass(invalid: boolean) {
  return cn(
    "block w-full min-h-12 border bg-white px-4 py-3 text-base text-navy transition-colors placeholder:text-navy/60",
    "hover:border-navy/70 focus:border-navy",
    invalid ? "border-2 border-signal" : "border-navy/30",
  );
}

function Field({
  name,
  required,
  error,
  hint,
  className,
  children,
}: {
  name: FieldName;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  const id = fieldId(name);
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 block font-display text-[0.78rem] font-bold tracking-[0.07em] text-navy uppercase"
      >
        {LABELS[name]}
        {required ? (
          <span aria-hidden="true" className="text-signal">
            {" "}
            *
          </span>
        ) : (
          <span className="ml-2 text-[0.7rem] font-semibold tracking-normal text-navy/60 normal-case">(optional)</span>
        )}
      </label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          className="mt-2 flex items-start gap-2 border-l-2 border-signal bg-signal/5 py-1.5 pr-2 pl-3 text-sm font-medium text-navy"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0 text-signal" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-navy/65">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function buildSummary(v: FormValues) {
  const lines: string[] = [
    "Hello Tenya Security, I would like to request a security quote.",
    "",
    `Name: ${v.fullName}`,
  ];
  if (v.organization) lines.push(`Organization: ${v.organization}`);
  lines.push(`Phone: ${v.phone}`, `Email: ${v.email}`, `Service: ${v.service}`, "", `Message: ${v.message}`);
  return lines.join("\n");
}

export function ContactForm({ servicePick }: { servicePick: ServicePick }) {
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [mode, setMode] = useState<Mode>("prepare");
  const [formError, setFormError] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const startedAt = useRef(Date.now());
  const successRef = useRef<HTMLDivElement>(null);

  // Pre-select a service when the visitor clicks "Request a quote" on a service card
  useEffect(() => {
    if (!servicePick) return;
    setValues((v) => ({ ...v, service: servicePick.title }));
    setErrors((e) => ({ ...e, service: undefined }));
    setStatus((s) => (s === "success" ? "idle" : s));
  }, [servicePick]);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const update =
    (name: FieldName) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setValues((v) => ({ ...v, [name]: value }));
      if (touched[name] || errors[name]) {
        setErrors((er) => ({ ...er, [name]: validateField(name, value, SERVICE_OPTIONS) }));
      }
    };

  const blur = (name: FieldName) => () => {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((er) => ({ ...er, [name]: validateField(name, values[name], SERVICE_OPTIONS) }));
  };

  const aria = (name: FieldName, hasHint = false) => ({
    id: fieldId(name),
    name,
    "aria-invalid": errors[name] ? (true as const) : undefined,
    "aria-describedby": errors[name] ? `${fieldId(name)}-error` : hasHint ? `${fieldId(name)}-hint` : undefined,
    onBlur: blur(name),
  });

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setTouched({});
    setFormError(null);
    setShowSummary(false);
    setStatus("idle");
    startedAt.current = Date.now();
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;
    setFormError(null);

    const clean = sanitizeValues(values);
    const errs = validateAll(clean, SERVICE_OPTIONS);
    const firstInvalid = FIELD_ORDER.find((f) => errs[f]);

    if (firstInvalid) {
      setErrors(errs);
      setTouched(Object.fromEntries(FIELD_ORDER.map((f) => [f, true])));
      setShowSummary(true);
      document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }
    setShowSummary(false);
    setErrors({});
    setValues(clean);

    // Spam traps: a filled honeypot is dropped silently; very fast submissions are asked to retry
    if (website.trim() !== "") {
      setMode("sent");
      setStatus("success");
      return;
    }
    if (Date.now() - startedAt.current < 3000) {
      setFormError("Please review your details and press send again.");
      return;
    }
    if (isRateLimited()) {
      setFormError(
        `You have sent several requests recently. Please wait a few minutes, or call or WhatsApp us on ${SITE.phone}.`,
      );
      return;
    }

    if (!HAS_ENDPOINT) {
      recordSubmission();
      setMode("prepare");
      setStatus("success");
      return;
    }

    setStatus("submitting");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...clean, source: "tenya-website" }),
        credentials: "omit",
        referrerPolicy: "strict-origin-when-cross-origin",
        signal: controller.signal,
      });
      if (res.status === 429) {
        throw new Error("rate");
      }
      if (!res.ok) throw new Error("http");
      recordSubmission();
      setMode("sent");
      setStatus("success");
    } catch (err) {
      setStatus("idle");
      setFormError(
        err instanceof Error && err.message === "rate"
          ? `Too many requests right now. Please try again shortly, or call or WhatsApp us on ${SITE.phone}.`
          : `We couldn't send your request just now. Please try again, or call or WhatsApp us on ${SITE.phone}.`,
      );
    } finally {
      window.clearTimeout(timeout);
    }
  };

  /* ------------------------------ Success ------------------------------ */
  if (status === "success") {
    const summary = buildSummary(values);
    const firstName = values.fullName.split(" ")[0];
    return (
      <div ref={successRef} tabIndex={-1} role="status" aria-live="polite" className="outline-none">
        <span className="grid size-14 place-items-center bg-signal text-white">
          <Check className="size-7" strokeWidth={3} aria-hidden="true" />
        </span>
        {mode === "sent" ? (
          <>
            <h3 className="mt-6 font-display text-2xl font-extrabold text-navy sm:text-3xl">Request received.</h3>
            <p className="mt-3 max-w-md text-navy/80">
              Thank you{firstName ? `, ${firstName}` : ""}. Your security request has been sent to Tenya Security and
              we will be in touch soon. For anything urgent, call{" "}
              <a className="font-bold underline decoration-signal decoration-2 underline-offset-4" href={SITE.phoneHref}>
                {SITE.phone}
              </a>
              .
            </p>
            <button type="button" onClick={reset} className="btn btn-outline-dark mt-8">
              Send another request
            </button>
          </>
        ) : (
          <>
            <h3 className="mt-6 font-display text-2xl font-extrabold text-navy sm:text-3xl">
              Your request is ready to send.
            </h3>
            <p className="mt-3 max-w-md text-navy/80">
              Thank you{firstName ? `, ${firstName}` : ""}. Choose how you would like to send it to Tenya Security. Your
              details are pre-filled, so it takes one tap.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href={whatsappLink(summary)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-red"
              >
                <WhatsAppIcon className="size-4" />
                Send on WhatsApp
              </a>
              <a
                href={`${SITE.emailHref}?subject=${encodeURIComponent(`Security quote request: ${values.service}`)}&body=${encodeURIComponent(summary)}`}
                className="btn btn-outline-dark"
              >
                <Mail className="size-4" aria-hidden="true" />
                Send by email
              </a>
            </div>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-6 inline-flex min-h-11 items-center gap-2 font-display text-sm font-bold tracking-wide text-navy hover:text-signal"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Edit my request
            </button>
          </>
        )}
      </div>
    );
  }

  /* -------------------------------- Form -------------------------------- */
  const errorList = FIELD_ORDER.filter((f) => errors[f]);

  return (
    <form onSubmit={onSubmit} noValidate aria-describedby={formError ? "cf-form-error" : undefined} autoComplete="on">
      {showSummary && errorList.length > 0 && (
        <div role="alert" className="mb-6 border-l-4 border-signal bg-mist p-4 text-sm text-navy">
          <p className="font-display font-bold">
            Please fix {errorList.length === 1 ? "1 field" : `${errorList.length} fields`} before sending:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {errorList.map((f) => (
              <li key={f}>
                <a href={`#${fieldId(f)}`} className="font-semibold underline underline-offset-2">
                  {LABELS[f]}
                </a>
                : {errors[f]}
              </li>
            ))}
          </ul>
        </div>
      )}

      {formError && (
        <div
          id="cf-form-error"
          role="alert"
          className="mb-6 flex items-start gap-3 border-l-4 border-signal bg-mist p-4 text-sm font-medium text-navy"
        >
          <CircleAlert className="mt-0.5 size-5 shrink-0 text-signal" aria-hidden="true" />
          <p>{formError}</p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field name="fullName" required error={errors.fullName}>
          <input
            {...aria("fullName")}
            type="text"
            value={values.fullName}
            onChange={update("fullName")}
            autoComplete="name"
            maxLength={LIMITS.nameMax + 20}
            required
            aria-required="true"
            placeholder="Your full name"
            className={inputClass(!!errors.fullName)}
          />
        </Field>

        <Field name="organization" error={errors.organization}>
          <input
            {...aria("organization")}
            type="text"
            value={values.organization}
            onChange={update("organization")}
            autoComplete="organization"
            maxLength={LIMITS.orgMax + 20}
            placeholder="Company or organization"
            className={inputClass(!!errors.organization)}
          />
        </Field>

        <Field name="phone" required error={errors.phone}>
          <input
            {...aria("phone")}
            type="tel"
            inputMode="tel"
            value={values.phone}
            onChange={update("phone")}
            autoComplete="tel"
            maxLength={24}
            required
            aria-required="true"
            placeholder="+254 7XX XXX XXX"
            className={inputClass(!!errors.phone)}
          />
        </Field>

        <Field name="email" required error={errors.email}>
          <input
            {...aria("email")}
            type="email"
            inputMode="email"
            value={values.email}
            onChange={update("email")}
            autoComplete="email"
            maxLength={LIMITS.emailMax}
            required
            aria-required="true"
            placeholder="you@company.com"
            className={inputClass(!!errors.email)}
          />
        </Field>

        <Field name="service" required error={errors.service} className="sm:col-span-2">
          <div className="relative">
            <select
              {...aria("service")}
              value={values.service}
              onChange={update("service")}
              required
              aria-required="true"
              className={cn(inputClass(!!errors.service), "appearance-none pr-12", !values.service && "text-navy/60")}
            >
              <option value="" disabled>
                Select a service
              </option>
              {SERVICE_OPTIONS.map((s) => (
                <option key={s} value={s} className="text-navy">
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-navy"
              aria-hidden="true"
            />
          </div>
        </Field>

        <Field
          name="message"
          required
          error={errors.message}
          hint={`${values.message.length}/${LIMITS.messageMax} characters. Tell us about your site, location and requirements.`}
          className="sm:col-span-2"
        >
          <textarea
            {...aria("message", true)}
            rows={5}
            value={values.message}
            onChange={update("message")}
            maxLength={LIMITS.messageMax + 100}
            required
            aria-required="true"
            placeholder="What would you like to protect, and what do you need?"
            className={cn(inputClass(!!errors.message), "min-h-36 resize-y")}
          />
        </Field>

        {/* Honeypot: hidden from people and assistive tech, attractive to bots */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="cf-website">Leave this field empty</label>
          <input
            id="cf-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className="btn btn-red w-full sm:w-auto" aria-disabled={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              Sending…
            </>
          ) : (
            <>
              Send Security Request
              <Send className="size-4" aria-hidden="true" />
            </>
          )}
        </button>
        <p className="max-w-xs text-xs leading-relaxed text-navy/65">
          We use your details only to respond to your enquiry. Fields marked <span aria-hidden="true">*</span>
          <span className="sr-only">with an asterisk</span> are required.
        </p>
      </div>
    </form>
  );
}
