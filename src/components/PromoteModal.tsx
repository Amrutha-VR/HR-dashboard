import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import type { Employee, Band, RoleChangePayload } from '../types';
import { BandBadge } from './Badge';

interface PromoteModalProps {
  employee: Employee;
  onConfirm: (payload: RoleChangePayload) => void;
  onClose: () => void;
  mode: 'promote' | 'demote';
}

const bandLevels: Band[] = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'];

const roleOptions = ['Individual Contributor', 'Team Lead', 'Manager', 'Executive'];

export default function PromoteModal({ employee, onConfirm, onClose, mode }: PromoteModalProps) {
  const currentBandIndex = bandLevels.indexOf(employee.band);
  const suggestedBand = mode === 'promote'
    ? bandLevels[Math.min(currentBandIndex + 1, bandLevels.length - 1)]
    : bandLevels[Math.max(currentBandIndex - 1, 0)];

  const [newDesignation, setNewDesignation] = useState(employee.designation);
  const [newBand, setNewBand] = useState<Band>(suggestedBand);
  const [newRole, setNewRole] = useState(employee.role);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      employeeId: employee.id,
      newDesignation,
      newBand,
      newRole,
      effectiveDate: new Date().toISOString().split('T')[0],
    });
  };

  const isPromote = mode === 'promote';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-xl shadow-xl border border-neutral-200 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              {isPromote ? (
                <ArrowUpCircle size={18} className="text-emerald-600" />
              ) : (
                <ArrowDownCircle size={18} className="text-red-500" />
              )}
              <h3 className="text-base font-semibold text-neutral-800">
                {isPromote ? 'Promote' : 'Demote'} Employee
              </h3>
            </div>
            <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {/* Current info */}
            <div className="bg-stone-50 rounded-lg px-4 py-3 space-y-1">
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Current</p>
              <p className="text-sm text-neutral-800 font-medium">{employee.fullName}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-neutral-500">{employee.designation}</span>
                <BandBadge band={employee.band} />
              </div>
            </div>

            {/* New designation */}
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">New Designation</label>
              <input
                type="text"
                value={newDesignation}
                onChange={(e) => setNewDesignation(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300/60 focus:border-stone-300"
                required
              />
            </div>

            {/* New band */}
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">New Band</label>
              <select
                value={newBand}
                onChange={(e) => setNewBand(e.target.value as Band)}
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300/60 focus:border-stone-300 appearance-none cursor-pointer"
              >
                {bandLevels.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* New role */}
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">New Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-300/60 focus:border-stone-300 appearance-none cursor-pointer"
              >
                {roleOptions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  isPromote
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                Confirm {isPromote ? 'Promotion' : 'Demotion'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
