import { certifications } from "@/data/certifications";
import { education } from "@/data/education";
import Pass from "@/components/Pass";

/** certifications as connection passes: the core ones a recruiter filters on get the yellow header */
export const CertPasses = () => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {certifications.map((c) => (
      <Pass
        key={c.id}
        as="div"
        tone={c.core ? "sign" : "plain"}
        label={c.core ? "Core · connection" : "Connection"}
        code={c.date}
        main={
          <div className="p-4 sm:p-5 flex items-start gap-3">
            <img src={c.logo} alt="" loading="lazy" className="w-10 h-10 shrink-0 rounded-lg object-contain bg-white border border-border p-1" />
            <div className="min-w-0">
              <div className={c.core ? "text-[16px] font-bold leading-snug" : "text-[15px] font-semibold leading-snug"}>{c.title}</div>
              <div className="text-[14px] text-muted-foreground mt-1">{c.organization}</div>
            </div>
          </div>
        }
      />
    ))}
  </div>
);

export const EducationPasses = () => (
  <div className="grid sm:grid-cols-2 gap-5">
    {education.map((e) => (
      <Pass
        key={e.degree}
        as="div"
        row="md"
        stubWidth="150px"
        label="Education"
        code={e.period}
        main={
          <div className="p-5 sm:p-6 flex items-start gap-4">
            <img src={e.logo} alt="" loading="lazy" className="w-12 h-12 shrink-0 rounded-lg object-contain bg-white border border-border p-1" />
            <div>
              <div className="font-display text-[22px] font-bold uppercase leading-tight">{e.degree}</div>
              <div className="text-[15px] text-muted-foreground mt-1">{e.school}</div>
            </div>
          </div>
        }
        stub={
          <div className="p-5 sm:p-6 h-full flex md:flex-col justify-between gap-2">
            <div>
              <div className="label">From</div>
              <div className="font-display text-[20px] font-bold">{e.period.split(" - ")[0]}</div>
            </div>
            <div>
              <div className="label">To</div>
              <div className="font-display text-[20px] font-bold">{e.period.split(" - ")[1]}</div>
            </div>
          </div>
        }
      />
    ))}
  </div>
);
