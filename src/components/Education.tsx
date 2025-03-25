import AnimatedCard from "@/components/ui/AnimatedCard";
import { GraduationCap, MapPin, Calendar } from "lucide-react";

const Education = () => {
  return (
    <section id="education" className="py-20 md:py-28 relative bg-accent/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="chip mb-4">My Academic Background</span>
          <h2 className="section-title">Education</h2>
        </div>

        <div className="max-w-5xl mx-auto">
          <AnimatedCard className="glass-card rounded-2xl p-8 lg:p-10">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex-shrink-0 flex items-center justify-center">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-accent flex items-center justify-center">
                  <img
                    src="/bu.png"
                    alt="Bharathiar University"
                    className="w-20 h-20 md:w-28 md:h-28 object-contain"
                  />
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 text-foreground">
                  MSc Computer Science
                </h3>
                <div className="flex items-center text-yousaf mb-2">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  <span className="font-medium">
                    Bharathiar University, India
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 mb-4 text-sm text-foreground/70">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    <span>2021 - 2023</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1.5" />
                    <span>India</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard className="glass-card rounded-2xl p-8 lg:p-10 mt-6">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex-shrink-0 flex items-center justify-center">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-accent flex items-center justify-center">
                  <img
                    src="/neftu.png"
                    alt="North East Frontier Technical University"
                    className="w-20 h-20 md:w-28 md:h-28 object-contain"
                  />
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 text-foreground">
                  BTech Computer Science
                </h3>
                <div className="flex items-center text-yousaf mb-2">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  <span className="font-medium">
                    North East Frontier Technical University, India
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 mb-4 text-sm text-foreground/70">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    <span>2014 - 2018</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1.5" />
                    <span>India</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </div>
    </section>
  );
};

export default Education;
