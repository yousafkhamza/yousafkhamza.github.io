import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Check, Send, AlertCircle } from "lucide-react";
import { profile, services } from "@/data/profile";

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

  useEffect(() => {
    const t = params.get("topic");
    if (t && topics.some((x) => x.id === t)) setForm((f) => ({ ...f, topic: t }));
  }, [params]);

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const topicLabel = topics.find((t) => t.id === form.topic)?.label ?? form.topic;
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          topic: topicLabel,
          message: form.message,
          _subject: `[${topicLabel}] ${form.name} via portfolio`,
          _template: "table",
          _captcha: "false",
        }),
      });
      if (!res.ok) throw new Error("submit failed");
      setStatus("sent");
      setForm({ name: "", email: "", company: "", topic: form.topic, message: "" });
    } catch {
      setStatus("error");
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
          <AlertCircle className="w-4 h-4" /> Could not send. Please try again, or email {CONTACT_EMAIL}.
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
      <button type="submit" disabled={status === "sending"} className="btn-primary w-full sm:w-auto disabled:opacity-60">
        <Send className="w-4 h-4" />
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
};

export default ContactForm;
