import { useState, useEffect } from "react";
import AnimatedCard from "@/components/ui/AnimatedCard";
import { CalendarClock, Globe, Users } from "lucide-react";

const Volunteering = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Using rss2json API to convert Medium RSS feed to JSON (avoids CORS issues)
        const mediumRssUrl = "https://medium.com/feed/@yousaf.k.hamza";
        const rss2jsonApiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(mediumRssUrl)}`;
        
        const response = await fetch(rss2jsonApiUrl);
        
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }

        const data = await response.json();
        
        if (data.status !== 'ok') {
          throw new Error(data.message || 'Failed to parse feed');
        }
        
        // Get recent articles (limit to 4-5)
        const fetchedArticles = data.items.slice(0, 5).map(item => ({
          title: item.title,
          link: item.link,
        }));
        
        setArticles(fetchedArticles);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <section id="volunteering" className="py-20 md:py-28 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="chip mb-4">Community Contributions</span>
          <h2 className="section-title">Blogging & Knowledge Sharing</h2>
        </div>

        <div className="max-w-5xl mx-auto space-y-8">
          {/* Medium Publications */}
          <AnimatedCard className="glass-card rounded-2xl p-8 lg:p-10">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex-shrink-0 flex items-center justify-center">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center p-4">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/e/ec/Medium_logo_Monogram.svg"
                    alt="Medium Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 text-foreground">
                  Technical Writing & Blogging
                </h3>
                <div className="flex items-center text-yousaf mb-2">
                  <Users className="w-5 h-5 mr-2" />
                  <span className="font-medium">Medium Publications</span>
                </div>

                <div className="flex flex-wrap gap-4 mb-4 text-sm text-foreground/70">
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-1.5" />
                    <a
                      href="https://medium.com/@yousaf.k.hamza"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-yousaf transition-colors"
                    >
                      medium.com/@yousaf.k.hamza
                    </a>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-lg font-semibold mb-2">
                    Recent Articles
                  </h4>
                  {loading ? (
                    <p className="text-foreground/70">Loading articles...</p>
                  ) : error ? (
                    <ul className="space-y-2 list-disc list-inside">
                      {/* Fallback to hardcoded articles if API fails */}
                      <li>
                        <a
                          href="https://medium.com/@yousaf.k.hamza/tofuswitch-simplify-opentofu-version-management-7055f7f696c0"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-yousaf transition-colors"
                        >
                          TofuSwitch: Simplify OpenTofu Version Management
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://medium.com/@yousaf.k.hamza/domain-monitor-effortlessly-track-your-websites-uptime-348f3ab85844"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-yousaf transition-colors"
                        >
                          Domain Monitor: Effortlessly Track Your Website's Uptime
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://medium.com/@yousaf.k.hamza/enhancing-security-with-observatory-cli-why-site-score-checks-matter-for-internal-domains-997d57b2c4fc"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-yousaf transition-colors"
                        >
                          Enhancing Security with Observatory CLI
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://medium.com/@yousaf.k.hamza/enhancing-kubernetes-deployment-quality-with-kube-score-b21eb8e85fe9"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-yousaf transition-colors"
                        >
                          Enhancing Kubernetes Deployment Quality with Kube-Score
                        </a>
                      </li>
                    </ul>
                  ) : (
                    <ul className="space-y-2 list-disc list-inside">
                      {articles.map((article, index) => (
                        <li key={index}>
                          <a
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-yousaf transition-colors"
                          >
                            {article.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </div>
    </section>
  );
};

export default Volunteering;
