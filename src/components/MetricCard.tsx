import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  accent?: string;
}

export default function MetricCard({ label, value, icon, accent = 'text-neutral-700' }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="bg-white rounded-xl border border-neutral-200/80 px-5 py-4 flex items-center gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
    >
      <div className="w-10 h-10 rounded-lg bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-500 shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-neutral-500 font-medium tracking-wide uppercase">{label}</p>
        <p className={`text-xl font-bold mt-0.5 ${accent}`}>{value}</p>
      </div>
    </motion.div>
  );
}
