import AnimatedCard from "@/components/ui/AnimatedCard";
import ContactForm from "./contact/ContactForm";
import ContactInfo from "./contact/ContactInfo";
import SocialLinks from "./contact/SocialLinks";

const Contact = () => {
  return (
    <section id="contact" className="py-20 md:py-28 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="chip mb-4">Get In Touch</span>
          <h2 className="section-title">Contact Me</h2>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          <AnimatedCard className="glass-card rounded-2xl p-8 order-2 lg:order-1">
            <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
            <ContactForm />
          </AnimatedCard>

          <div className="space-y-8 order-1 lg:order-2">
            <AnimatedCard className="glass-card rounded-2xl p-9">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <ContactInfo />
            </AnimatedCard>

            <AnimatedCard className="glass-card rounded-2xl p-9">
              <h3 className="text-xl font-bold mb-4">Connect With Me</h3>
              <p className="text-foreground/70 mb-6">
                Find me on professional networks and platforms.
              </p>
              <SocialLinks />
            </AnimatedCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
