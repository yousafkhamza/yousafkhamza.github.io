import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import Section from "@/components/layout/Section";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";
import SocialLinks from "@/components/contact/SocialLinks";

const fallbackArticles = [
  { title: "TofuSwitch: Simplify OpenTofu Version Management", link: "https://medium.com/@yousaf.k.hamza/tofuswitch-simplify-opentofu-version-management-7055f7f696c0" },
  { title: "Domain Monitor: Effortlessly Track Your Website's Uptime", link: "https://medium.com/@yousaf.k.hamza/domain-monitor-effortlessly-track-your-websites-uptime-348f3ab85844" },
  { title: "Enhancing Security with Observatory CLI", link: "https://medium.com/@yousaf.k.hamza/enhancing-security-with-observatory-cli-why-site-score-checks-matter-for-internal-domains-997d57b2c4fc" },
];

const ContactPage = () => {
  const [articles, setArticles] = useState<{ title: string; link: string }[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    document.title = "Contact | Yousaf K Hamza";
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const mediumRssUrl = "https://medium.com/feed/@yousaf.k.hamza";
        const rss2jsonApiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(mediumRssUrl)}`;
        const response = await fetch(rss2jsonApiUrl);
        if (!response.ok) throw new Error("failed");
        const data = await response.json();
        if (data.status !== "ok") throw new Error("failed");
        setArticles(data.items.slice(0, 3).map((item: any) => ({ title: item.title, link: item.link })));
      } catch {
        setError(true);
      }
    };
    fetchArticles();
  }, []);

  const items = error || articles.length === 0 ? fallbackArticles : articles;

  return (
    <div>
      <PageHero
        eyebrow="Get In Touch"
        title="Let's talk infrastructure."
        description="Open to senior DevOps, platform, and SRE roles, freelance infra work, or just a conversation about Kubernetes. I read everything that comes through here."
      />

      <Section border={false}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 rounded-2xl border border-border p-6 sm:p-8">
            <h2 className="text-lg font-bold mb-6">Send a message</h2>
            <ContactForm />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-border p-6 sm:p-8">
              <h2 className="text-lg font-bold mb-6">Contact information</h2>
              <ContactInfo />
            </div>

            <div className="rounded-2xl border border-border p-6 sm:p-8">
              <h2 className="text-sm font-bold mb-4">Connect</h2>
              <SocialLinks />
            </div>

            <div className="rounded-2xl border border-border p-6 sm:p-8">
              <h2 className="text-sm font-bold mb-1">Recent writing</h2>
              <a
                href="https://medium.com/@yousaf.k.hamza"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-yousaf hover:underline mb-4"
              >
                <Globe className="w-3.5 h-3.5" />
                medium.com/@yousaf.k.hamza
              </a>
              <ul className="space-y-2.5">
                {items.map((article) => (
                  <li key={article.link}>
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-foreground/75 hover:text-yousaf transition-colors leading-snug flex items-start gap-1.5"
                    >
                      <span className="text-yousaf mt-0.5 shrink-0">▸</span>
                      {article.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default ContactPage;
