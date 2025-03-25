import { useState } from "react";
import { Check, Send } from "lucide-react";

const ContactForm = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Reset form
      setFormState({
        name: "",
        email: "",
        message: "",
      });

      // Reset submission status after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }, 1500);
  };

  return (
    <>
      {isSubmitted ? (
        <div className="bg-primary/10 text-primary p-4 rounded-lg flex items-center space-x-3 animate-fade-in">
          <Check className="w-5 h-5" />
          <span>Thank you! Your message has been sent successfully.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-foreground/80 mb-1"
            >
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formState.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-border bg-white/50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Yousaf K H"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground/80 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-border bg-white/50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="yousaf.k.hamza@gmail.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-foreground/80 mb-1"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formState.message}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-3 rounded-lg border border-border bg-white/50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              placeholder="Write your message here..."
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-lg transition-all ${
              isSubmitting
                ? "bg-primary/70 cursor-wait"
                : "bg-primary hover:bg-primary-dark"
            } text-white`}
          >
            {isSubmitting ? (
              <>
                <span className="animate-pulse">Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </>
            )}
          </button>
        </form>
      )}
    </>
  );
};

export default ContactForm;
