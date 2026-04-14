import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import type { Employee } from '../types';
import type { SortField, SortDirection } from '../utils';
import Avatar from './Avatar';
import { StatusBadge, BandBadge } from './Badge';
import { formatDate } from '../utils';

interface EmployeeTableProps {
  employees: Employee[];
  sortField: SortField;
  sortDir: SortDirection;
  onSort: (field: SortField) => void;
}

interface SortHeaderProps {
  label: string;
  field: SortField;
  active: SortField;
  direction: SortDirection;
  onSort: (field: SortField) => void;
  className?: string;
}

function SortHeader({ label, field, active, direction, onSort, className = '' }: SortHeaderProps) {
  const isActive = active === field;
  return (
    <th
      className={`text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider py-3 px-4 cursor-pointer select-none hover:text-neutral-700 transition-colors ${className}`}
      onClick={() => onSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {isActive ? (
          direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
        ) : (
          <ArrowUpDown size={11} className="opacity-30" />
        )}
      </span>
    </th>
  );
}

export default function EmployeeTable({ employees, sortField, sortDir, onSort }: EmployeeTableProps) {
  const navigate = useNavigate();

  if (employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-3 opacity-40">
          <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
          <path d="M16 20h16M16 28h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <p className="text-sm font-medium">No employees match your criteria</p>
        <p className="text-xs mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b border-neutral-100">
            <SortHeader label="Employee" field="fullName" active={sortField} direction={sortDir} onSort={onSort} className="pl-5" />
            <SortHeader label="Department" field="department" active={sortField} direction={sortDir} onSort={onSort} />
            <SortHeader label="Designation" field="designation" active={sortField} direction={sortDir} onSort={onSort} />
            <SortHeader label="Band" field="band" active={sortField} direction={sortDir} onSort={onSort} />
            <SortHeader label="Status" field="status" active={sortField} direction={sortDir} onSort={onSort} />
            <SortHeader label="Joined" field="dateOfJoining" active={sortField} direction={sortDir} onSort={onSort} />
            <th className="text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider py-3 px-4">Location</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp, i) => (
            <motion.tr
              key={emp.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: Math.min(i * 0.02, 0.3) }}
              onClick={() => navigate(`/employee/${emp.id}`)}
              className="border-b border-neutral-50 hover:bg-stone-50/60 cursor-pointer transition-colors group"
            >
              <td className="py-3 px-5">
                <div className="flex items-center gap-3">
                  <Avatar firstName={emp.firstName} lastName={emp.lastName} id={emp.id} avatar={emp.avatar} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-neutral-800 truncate group-hover:text-neutral-950 transition-colors">
                      {emp.fullName}
                    </p>
                    <p className="text-xs text-neutral-400 truncate">{emp.employeeCode} · {emp.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className="text-sm text-neutral-600">{emp.department}</span>
              </td>
              <td className="py-3 px-4">
                <span className="text-sm text-neutral-600 truncate block max-w-[200px]" title={emp.designation}>
                  {emp.designation}
                </span>
              </td>
              <td className="py-3 px-4">
                <BandBadge band={emp.band} />
              </td>
              <td className="py-3 px-4">
                <StatusBadge status={emp.status} />
              </td>
              <td className="py-3 px-4">
                <span className="text-sm text-neutral-500">{formatDate(emp.dateOfJoining)}</span>
              </td>
              <td className="py-3 px-4">
                <span className="text-sm text-neutral-500">{emp.location}</span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
