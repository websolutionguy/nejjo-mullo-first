import { useState } from "react";
import { motion } from "motion/react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setIsSuccess(true);
        reset();
        setTimeout(() => setIsSuccess(false), 5000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-15 min-h-screen">
      {/* Header */}
      <section className="bg-primary py-20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-5xl font-bold mb-6">
            Get in <span className="text-primary-light">Touch</span>
          </h1>
          <p className="text-xl text-primary-light/80 max-w-2xl">
            Have questions about our investment projects or agricultural
            products? Our team is here to help you grow.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-12">
              <div>
                <h2 className="text-3xl font-bold mb-8">Contact Information</h2>
                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-stone-900">Call Us</p>
                      <p className="text-stone-500">+1 (234) 567-8900</p>
                      <p className="text-stone-500">+1 (234) 567-8901</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-stone-900">Email Us</p>
                      <p className="text-stone-500">hello@Nejjo Mullo.com</p>
                      <p className="text-stone-500">support@Nejjo Mullo.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-stone-900">Visit Us</p>
                      <p className="text-stone-500">
                        123 Agri Plaza, Green Valley
                      </p>
                      <p className="text-stone-500">Farm City, FC 45678</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-[2rem] bg-stone-900 text-white">
                <h3 className="text-xl font-bold mb-4">
                  Chat with us on WhatsApp
                </h3>
                <p className="text-stone-400 text-sm mb-6">
                  Our support team is available 24/7 for your queries.
                </p>
                <a
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold transition-all"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Start Chat</span>
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-stone-100">
                <h2 className="text-3xl font-bold mb-8">Send us a Message</h2>

                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 border border-green-100 p-8 rounded-3xl text-center"
                  >
                    <div className="inline-flex p-4 rounded-full bg-green-100 text-green-600 mb-4">
                      <CheckCircle2 className="h-12 w-12" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-900 mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-green-700">
                      Thank you for reaching out. We'll get back to you within
                      24 hours.
                    </p>
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="mt-6 text-green-600 font-bold hover:underline"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-stone-700 ml-1">
                          Full Name
                        </label>
                        <input
                          {...register("name")}
                          className="w-full px-6 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                          placeholder="John Doe"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1 ml-1">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-stone-700 ml-1">
                          Email Address
                        </label>
                        <input
                          {...register("email")}
                          className="w-full px-6 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                          placeholder="john@example.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1 ml-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-stone-700 ml-1">
                        Subject
                      </label>
                      <input
                        {...register("subject")}
                        className="w-full px-6 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all"
                        placeholder="Investment Inquiry"
                      />
                      {errors.subject && (
                        <p className="text-red-500 text-xs mt-1 ml-1">
                          {errors.subject.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-stone-700 ml-1">
                        Message
                      </label>
                      <textarea
                        {...register("message")}
                        rows={5}
                        className="w-full px-6 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                        placeholder="Tell us how we can help..."
                      />
                      {errors.message && (
                        <p className="text-red-500 text-xs mt-1 ml-1">
                          {errors.message.message}
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="h-5 w-5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[500px] w-full bg-stone-100 relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.819917806043!2d36.8219462!3d-1.28333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTcnMDAuMCJTIDM2wrA0OScyMC4wIkU!5e0!3m2!1sen!2ske!4v1635142271476!5m2!1sen!2ske"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Nejjo Mullo Location"
        ></iframe>
      </section>
    </div>
  );
}
