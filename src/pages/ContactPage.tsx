import { useEffect } from "react";
import { FileDown } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import ContactForm from "@/components/contact/ContactForm";
import Pass from "@/components/Pass";
import { profile } from "@/data/profile";

const ContactPage = () => {

  const rows: [string, React.ReactNode][] = [
    ["Email", <a href={`mailto:${profile.email}`} className="hover:text-yousaf break-all">{profile.email}</a>],
    ["Phone", <span>{profile.phone} (UAE)<br />{profile.phoneAlt} (IN)</span>],
    ["LinkedIn", <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-yousaf">in/yousafkhamza</a>],
    ["Medium", <a href={profile.medium} target="_blank" rel="noopener noreferrer" className="hover:text-yousaf">@yousaf.k.hamza</a>],
    ["GitHub", <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-yousaf">yousafkhamza</a>],
    ["Based in", `Dubai, UAE · GMT+4`],
    ["Residency", profile.residency],
  ];

  return (
    <div>
      <PageHero
        path="contact"
        title="Let's talk."
        description="Hiring for a DevOps, platform or SRE role, or want a session? The form lands straight in my inbox."
      />
      <section className="rule-t">
        <div className="wrap py-12 sm:py-16 grid lg:grid-cols-[1.4fr_1fr] gap-6 lg:gap-8">
          <Pass
            as="div"
            tone="sign"
            label="Check-in · send a message"
            code="Lands in my inbox"
            className="self-start"
            main={
              <div className="p-5 sm:p-7">
                <ContactForm />
              </div>
            }
          />
          <Pass
            as="aside"
            className="self-start"
            label="Ground crew · contact"
            code="GMT+4"
            main={
              <dl className="divide-y divide-border">
                {rows.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[100px_1fr] gap-4 px-5 py-3.5 text-[15px]">
                    <dt className="label pt-0.5">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            }
            stub={
              <div className="p-4">
                <a href={profile.resume} target="_blank" rel="noopener" className="btn-primary w-full">
                  <FileDown className="w-4 h-4" /> Download resume (PDF)
                </a>
              </div>
            }
          />
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
