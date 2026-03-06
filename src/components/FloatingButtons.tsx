import { Phone, MessageCircle, Mail } from 'lucide-react';
import { motion } from 'motion/react';

export default function FloatingButtons() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-4">
      {/* WhatsApp Button */}
      <motion.a
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        href="https://wa.me/1234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:bg-green-600 transition-colors"
        aria-label="Contact on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </motion.a>

      {/* Call Button */}
      <motion.a
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        href="tel:+1234567890"
        className="bg-primary text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:bg-primary-dark transition-colors"
        aria-label="Call Us"
      >
        <Phone className="h-6 w-6" />
      </motion.a>

      {/* Contact Button */}
      <motion.a
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        href="/contact"
        className="bg-stone-900 text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:bg-stone-800 transition-colors md:hidden"
        aria-label="Contact Form"
      >
        <Mail className="h-6 w-6" />
      </motion.a>
    </div>
  );
}
