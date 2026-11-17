import { useEffect } from "react";
import { FileDown } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import ContactForm from "@/components/contact/ContactForm";
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
        <div className="wrap py-12 sm:py-16 grid lg:grid-cols-[1.4fr_1fr] gap-12">
          <ContactForm />
          <aside>
            <dl className="panel divide-y divide-border">
              {rows.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[110px_1fr] gap-4 px-5 py-3.5 text-[14.5px]">
                  <dt className="font-mono text-[12px] text-muted-foreground pt-0.5">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <a href={profile.resume} target="_blank" rel="noopener" className="btn-ghost mt-5 w-full">
              <FileDown className="w-4 h-4" /> Download resume (PDF)
            </a>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
