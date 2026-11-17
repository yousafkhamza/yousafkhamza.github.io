import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/layout/Section";
import { services, yearsOfExperience } from "@/data/profile";

const steps = [
  ["Send a request", "Use the contact form and pick the service. Add a line about where you are and what you want out of it."],
  ["We agree the details", "I reply by email to agree a time, what to prepare, and anything else we need to settle first."],
  ["The session", "A video call (Google Meet or Zoom), or an async written review for resumes."],
  ["Follow-up notes", "You get the key points in writing so you are not relying on memory."],
];

const ServicesPage = () => {
  useEffect(() => {
    document.title = "Career guidance & reviews | Yousaf K Hamza";
  }, []);

  return (
    <div>
      <PageHero
        path="services"
        title="Office hours."
        description={`${yearsOfExperience()}+ years in DevOps, from TechOps support to leading production platforms. If you are trying to get into the field, move up a level, or get a second pair of eyes on your infrastructure, I can help.`}
      >
        <div className="mt-8">
          <Link to="/contact?topic=career" className="btn-primary">
            Request a session <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </PageHero>

      <section className="rule-t">
        <div className="wrap py-12 sm:py-16 grid md:grid-cols-2 gap-5">
          {services.map((s, i) => (
            <article key={s.id} id={s.id} className="panel p-6 sm:p-7 flex flex-col">
              <div className="flex items-center justify-between font-mono text-[12px] text-muted-foreground">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span>{s.format}</span>
              </div>
              <h2 className="mt-3 text-[22px] font-semibold tracking-[-0.01em]">{s.title}</h2>
              <p className="mt-2 text-[15px] text-muted-foreground leading-relaxed">{s.who}</p>
              <ul className="mt-5 space-y-2">
                {s.what.map((w) => (
                  <li key={w} className="relative pl-5 text-[15px]">
                    <span className="absolute left-0 font-mono text-yousaf">+</span>
                    {w}
                  </li>
                ))}
              </ul>
              <Link to={`/contact?topic=${s.id}`} className="btn-ghost mt-7 self-start">
                Ask about this <ArrowRight className="w-4 h-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <Section label="Process" title="How it works">
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-[var(--radius)] overflow-hidden">
          {steps.map(([t, d], i) => (
            <li key={t} className="bg-card p-6">
              <div className="font-mono text-[12px] text-yousaf">step {i + 1}</div>
              <div className="mt-2 text-[17px] font-semibold">{t}</div>
              <p className="mt-2 text-[14.5px] text-muted-foreground leading-relaxed">{d}</p>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
};

export default ServicesPage;
