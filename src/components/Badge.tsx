import type { EmployeeStatus, ReviewStatus, PerformanceTrend } from '../types';

// ─── Status Badge ─────────────────────────────────────

const statusStyles: Record<EmployeeStatus, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  inactive: 'bg-red-50 text-red-600 border-red-200',
  'on-leave': 'bg-amber-50 text-amber-700 border-amber-200',
  probation: 'bg-sky-50 text-sky-700 border-sky-200',
};

export function StatusBadge({ status }: { status: EmployeeStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border ${statusStyles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-emerald-500' : status === 'inactive' ? 'bg-red-400' : status === 'on-leave' ? 'bg-amber-500' : 'bg-sky-500'}`} />
      {status === 'on-leave' ? 'On Leave' : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ─── Review Status Badge ──────────────────────────────

const reviewStyles: Record<ReviewStatus, string> = {
  completed: 'bg-emerald-50 text-emerald-700',
  pending: 'bg-amber-50 text-amber-700',
  overdue: 'bg-red-50 text-red-600',
  'not-started': 'bg-neutral-100 text-neutral-500',
};

export function ReviewBadge({ status }: { status: ReviewStatus }) {
  const label = status === 'not-started' ? 'Not Started' : status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full ${reviewStyles[status]}`}>
      {label}
    </span>
  );
}

// ─── Performance Trend Badge ──────────────────────────

const trendStyles: Record<PerformanceTrend, { color: string; icon: string }> = {
  improving: { color: 'text-emerald-600', icon: '↑' },
  stable: { color: 'text-neutral-500', icon: '→' },
  declining: { color: 'text-red-500', icon: '↓' },
};

export function TrendBadge({ trend }: { trend: PerformanceTrend | null }) {
  if (!trend) return <span className="text-xs text-neutral-400">—</span>;
  const { color, icon } = trendStyles[trend];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${color}`}>
      {icon} {trend.charAt(0).toUpperCase() + trend.slice(1)}
    </span>
  );
}

// ─── Band Badge ───────────────────────────────────────

export function BandBadge({ band }: { band: string }) {
  return (
    <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-neutral-100 text-neutral-600 border border-neutral-200">
      {band}
    </span>
  );
}

// ─── Employment Type Badge ────────────────────────────

export function EmploymentTypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-stone-100 text-stone-600">
      {type.replace('-', ' ')}
    </span>
  );
}
