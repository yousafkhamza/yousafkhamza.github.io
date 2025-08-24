import { useState } from "react";
import { Check, Send, AlertCircle } from "lucide-react";

const ContactForm = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Method 1: Try Formspree (you need to replace with your actual endpoint)
      // For now, we'll use a mailto fallback

      // Create mailto link as backup
      const subject = encodeURIComponent(
        `Portfolio Contact from ${formState.name}`
      );
      const body = encodeURIComponent(`
Name: ${formState.name}
Email: ${formState.email}

Message:
${formState.message}
      `);

      // Try modern approach first, fallback to mailto
      try {
        const response = await fetch(
          "https://formsubmit.co/yousaf.k.hamza@gmail.com",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: formState.name,
              email: formState.email,
              message: formState.message,
              _subject: `Portfolio Contact from ${formState.name}`,
              _captcha: "false",
              _template: "table",
            }),
          }
        );

        if (response.ok) {
          setIsSubmitted(true);
          // Reset form
          setFormState({
            name: "",
            email: "",
            message: "",
          });

          // Reset submission status after 5 seconds
          setTimeout(() => {
            setIsSubmitted(false);
          }, 5000);
        } else {
          throw new Error("Service unavailable");
        }
      } catch (serviceError) {
        // Fallback to mailto
        window.location.href = `mailto:yousaf.k.hamza@gmail.com?subject=${subject}&body=${body}`;

        setIsSubmitted(true);
        setFormState({
          name: "",
          email: "",
          message: "",
        });

        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      }
    } catch (err) {
      setError(
        "Please use your email client or contact me directly at yousafkhamza@gmail.com"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg flex items-center space-x-3 animate-fade-in mb-6">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {isSubmitted ? (
        <div className="bg-primary/10 text-primary p-4 rounded-lg flex items-center space-x-3 animate-fade-in">
          <Check className="w-5 h-5" />
          <span>
            Thank you! Your message has been sent successfully to
            yousafkhamza@gmail.com
          </span>
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
              placeholder="John Doe"
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
              placeholder="john@example.com"
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
