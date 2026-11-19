import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Check, Send, AlertCircle } from "lucide-react";
import { profile, services } from "@/data/profile";
import { useAedRate } from "@/hooks/useAedRate";
import { priceFor } from "@/components/Price";
import { browserRegion, displayCurrency, placeName, visitorLocalTime, visitorTz } from "@/lib/visitor";

// FormSubmit.co forwards submissions straight to this inbox: free, no API key,
// no signup. The very first message triggers a one-time "Activate Form" email.
const CONTACT_EMAIL = profile.email;

export const topics = [
  { id: "hiring", label: "Hiring / job opportunity" },
  ...services.map((s) => ({ id: s.id, label: s.title })),
  { id: "other", label: "Something else" },
];

const field =
  "w-full px-3.5 py-2.5 rounded-[var(--radius)] border border-input bg-card text-[15px] focus:outline-none focus:border-foreground/60 focus:ring-2 focus:ring-ring/30";

const ContactForm = () => {
  const [params] = useSearchParams();
  const initialTopic = topics.some((t) => t.id === params.get("topic")) ? params.get("topic")! : "hiring";
  const [form, setForm] = useState({ name: "", email: "", company: "", topic: initialTopic, message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [slow, setSlow] = useState(false);
  const fx = useAedRate();

  /**
   * Sent with the message, never shown on the form: where the visitor is writing
   * from and the price the site showed them, so the reply can quote the right amount.
   */
  const context = () => {
    const tz = visitorTz();
    const region = browserRegion();
    const cur = displayCurrency(tz);
    const svc = services.find((s) => s.id === form.topic);
    const seen = priceFor(svc?.priceUsd ?? 1, cur, fx.rate, fx.rates, fx.live);
    const location = `${placeName(tz)} (${tz})${region ? ` · browser region ${region}` : ""}`;
    const localTime = visitorLocalTime(tz);
    const price = svc ? `${seen.text} ${svc.unit}${seen.cur === "USD" ? "" : ` (set at $${svc.priceUsd})`}` : "";
    // where they are, short, for the subject line: "India · INR"
    const where = region || placeName(tz);
    return {
      // simple field names (no spaces), which FormSubmit passes through reliably
      fields: { location, local_time: localTime, currency: seen.cur, ...(price ? { price_seen: price } : {}) },
      // the same facts at the end of the message itself, so they show in every email client
      block: [
        "",
        "",
        "----",
        `Sent from: ${location}`,
        `Their local time: ${localTime}`,
        `Currency shown on site: ${seen.cur}`,
        ...(price ? [`Price they saw: ${price}`] : []),
      ].join("\n"),
      subjectTag: `${where} · ${seen.cur}`,
    };
  };

  useEffect(() => {
    const t = params.get("topic");
    if (t && topics.some((x) => x.id === t)) setForm((f) => ({ ...f, topic: t }));
  }, [params]);

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setSlow(false);
    const topicLabel = topics.find((t) => t.id === form.topic)?.label ?? form.topic;
    const ctx = context();
    // FormSubmit can take a while; say so after a few seconds, give up after 30
    const slowTimer = setTimeout(() => setSlow(true), 5000);
    const ctrl = new AbortController();
    const abortTimer = setTimeout(() => ctrl.abort(), 30_000);
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: "POST",
        signal: ctrl.signal,
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          topic: topicLabel,
          message: form.message + ctx.block,
          ...ctx.fields,
          _subject: `[${topicLabel}] ${form.name} · ${ctx.subjectTag}`,
          _replyto: form.email,
          _template: "table",
          _captcha: "false",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || String(data?.success) === "false") throw new Error("submit failed");
      setStatus("sent");
      setForm({ name: "", email: "", company: "", topic: form.topic, message: "" });
    } catch {
      setStatus("error");
    } finally {
      clearTimeout(slowTimer);
      clearTimeout(abortTimer);
      setSlow(false);
    }
  };

  if (status === "sent") {
    return (
      <div className="panel p-6 flex items-start gap-3">
        <Check className="w-5 h-5 text-ok mt-0.5" />
        <div>
          <div className="font-semibold">Message sent.</div>
          <p className="text-[14.5px] text-muted-foreground mt-1">It went straight to my inbox. I will reply by email.</p>
          <button onClick={() => setStatus("idle")} className="btn-link mt-3 text-[14px]">
            Send another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {status === "error" && (
        <div className="flex items-center gap-2.5 text-[14px] text-bad border border-bad/30 bg-bad/5 rounded-[var(--radius)] px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            Could not send. Please try again, or email{" "}
            <a className="underline font-semibold" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
            .
          </span>
        </div>
      )}
      <div>
        <label htmlFor="topic" className="label block mb-1.5">What is this about</label>
        <select id="topic" name="topic" value={form.topic} onChange={set} className={field}>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="label block mb-1.5">Name</label>
          <input id="name" name="name" value={form.name} onChange={set} className={field} required autoComplete="name" />
        </div>
        <div>
          <label htmlFor="email" className="label block mb-1.5">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={set} className={field} required autoComplete="email" />
        </div>
      </div>
      <div>
        <label htmlFor="company" className="label block mb-1.5">
          Company <span className="normal-case tracking-normal">(optional)</span>
        </label>
        <input id="company" name="company" value={form.company} onChange={set} className={field} autoComplete="organization" />
      </div>
      <div>
        <label htmlFor="message" className="label block mb-1.5">Message</label>
        <textarea
          id="message"
          name="message"
          value={form.message}
          onChange={set}
          rows={6}
          className={`${field} resize-y`}
          placeholder={
            form.topic === "hiring"
              ? "Role, team, location and anything else worth knowing."
              : "Where you are now and what you would like to get out of it."
          }
          required
        />
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <button type="submit" disabled={status === "sending"} className="btn-primary w-full sm:w-auto disabled:opacity-60">
          <Send className="w-4 h-4" />
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        {status === "sending" && slow && (
          <span className="text-[14px] text-muted-foreground" aria-live="polite">
            Still sending, the mail service can take up to half a minute. Please keep this page open.
          </span>
        )}
      </div>
    </form>
  );
};

export default ContactForm;
