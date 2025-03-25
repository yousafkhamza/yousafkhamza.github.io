import AnimatedCard from "@/components/ui/AnimatedCard";
import { CalendarClock, Globe, Users } from "lucide-react";

const Volunteering = () => {
  return (
    <section id="volunteering" className="py-20 md:py-28 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="chip mb-4">Community Contributions</span>
          <h2 className="section-title">Tool Building & Knowledge Sharing</h2>
        </div>

        <div className="max-w-5xl mx-auto space-y-8">
          {/* Medium Publications */}
          <AnimatedCard className="glass-card rounded-2xl p-8 lg:p-10">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2 text-foreground">
                Technical Writing & Tool Building
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
                <h4 className="text-lg font-semibold mb-2">Recent Articles</h4>
                <ul className="space-y-2 list-disc list-inside">
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
                      Domain Monitor: Effortlessly Track Your Website’s Uptime
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
              </div>
            </div>
          </AnimatedCard>
        </div>
      </div>
    </section>
  );
};

export default Volunteering;
