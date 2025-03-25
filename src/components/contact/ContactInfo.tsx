import { Mail, MapPin, Phone } from "lucide-react";

const ContactInfo = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-4">
        <div className="bg-primary/10 text-primary p-3 rounded-full">
          <Mail className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-medium text-foreground">Email</h4>
          <a
            href="mailto:yousaf.k.hamza@gmail.com"
            className="text-primary hover:text-primary-dark transition-colors"
          >
            yousaf.k.hamza@gmail.com
          </a>
        </div>
      </div>

      <div className="flex items-start space-x-4">
        <div className="bg-primary/10 text-primary p-3 rounded-full">
          <Phone className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-medium text-foreground">Phone</h4>
          <a
            href="tel:+917736720639"
            className="text-primary hover:text-primary-dark transition-colors"
          >
            +91 7736720639
          </a>
        </div>
      </div>

      <div className="flex items-start space-x-4">
        <div className="bg-primary/10 text-primary p-3 rounded-full">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-medium text-foreground">Location</h4>
          <p className="text-foreground/70">Thrissur, Kerala, India</p>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
