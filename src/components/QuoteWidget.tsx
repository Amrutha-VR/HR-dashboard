import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';
import { motivationalQuotes } from '../data';

export default function QuoteWidget() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % motivationalQuotes.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const quote = motivationalQuotes[index];

  return (
    <div className="relative bg-gradient-to-br from-stone-50 to-amber-50/40 rounded-xl border border-stone-200/60 px-6 py-5 overflow-hidden">
      <Quote size={32} className="absolute top-3 right-4 text-stone-200/80" />
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm text-neutral-600 italic leading-relaxed pr-8">
            "{quote.text}"
          </p>
          <p className="text-xs text-neutral-400 mt-2 font-medium">— {quote.author}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
