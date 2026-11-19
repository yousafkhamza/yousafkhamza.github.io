import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/layout/Section";
import { services, yearsOfExperience } from "@/data/profile";
import Price from "@/components/Price";
import Pass from "@/components/Pass";
import { useAedRate } from "@/hooks/useAedRate";

const steps = [
  ["Send a request", "Use the contact form and pick the service. Add a line about where you are and what you want out of it."],
  ["We agree the details", "I reply by email to agree a time, what to prepare, and anything else we need to settle first."],
  ["The session", "A video call (Google Meet or Zoom), or an async written review for resumes."],
  ["Follow-up notes", "You get the key points in writing so you are not relying on memory."],
];

const ServicesPage = () => {
  const { live } = useAedRate();

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
            <Pass
              key={s.id}
              id={s.id}
              tone="sign"
              row="lg"
              stubWidth="220px"
              className="scroll-mt-28"
              label={`Office hours · ${String(i + 1).padStart(2, "0")}`}
              code={s.format}
              main={
                <div className="p-6 sm:p-7">
                  <h2 className="font-display text-[30px] font-bold leading-[1.05]">{s.title}</h2>
                  <p className="mt-3 text-[15.5px] text-muted-foreground leading-relaxed">{s.who}</p>
                  <ul className="mt-5 space-y-2">
                    {s.what.map((w) => (
                      <li key={w} className="relative pl-5 text-[15.5px]">
                        <span className="absolute left-0 font-bold text-yousaf">→</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              }
              stub={
                <div className="p-6 h-full flex lg:flex-col items-end lg:items-start justify-between gap-5">
                  <div>
                    <div className="label mb-1">Fare</div>
                    <Price usd={s.priceUsd} unit={s.unit} />
                  </div>
                  <div className="lg:mt-auto w-full sm:w-auto lg:w-full">
                    <div className="label mb-1 hidden lg:block">Format</div>
                    <div className="hidden lg:block font-display text-[17px] font-bold uppercase mb-4">{s.format}</div>
                    <Link to={`/contact?topic=${s.id}`} className="btn-primary h-11 w-full">
                      Ask about this <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              }
            />
          ))}
        </div>
      </section>

      <div className="wrap -mt-6 mb-4 text-[14px] text-muted-foreground">
        Prices in USD. AED shown {live ? "at today's live rate" : "at the fixed USD peg (3.6725)"}. Payment details are shared by email when we confirm the session.
      </div>

      <Section label="Process" title="How it works">
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map(([t, d], i) => (
            <li key={t} className="panel p-5 sm:p-6">
              <div className="flex items-center gap-2.5">
                <span className="inline-grid place-items-center w-9 h-9 rounded-full bg-sign text-ink font-display text-[17px] font-bold">{i + 1}</span>
                <span className="label">Step {i + 1}</span>
              </div>
              <div className="mt-4 font-display text-[22px] font-bold leading-[1.1]">{t}</div>
              <p className="mt-2 text-[15px] text-muted-foreground leading-relaxed">{d}</p>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
};

export default ServicesPage;
