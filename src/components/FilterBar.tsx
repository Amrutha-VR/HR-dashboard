import { Filter, X } from 'lucide-react';
import type { EmployeeFilters } from '../utils';
import type { Employee } from '../types';
import { uniqueValues, uniqueManagerOptions } from '../utils';

interface FilterBarProps {
  filters: EmployeeFilters;
  onChange: (filters: EmployeeFilters) => void;
  employees: Employee[];
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-sm bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-neutral-700 focus:outline-none focus:ring-2 focus:ring-stone-300/60 focus:border-stone-300 transition-shadow appearance-none cursor-pointer min-w-[120px]"
      title={label}
    >
      <option value="">{label}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export default function FilterBar({ filters, onChange, employees }: FilterBarProps) {
  const departments = uniqueValues(employees, 'department').map((v) => ({ value: v, label: v }));
  const roles = uniqueValues(employees, 'role').map((v) => ({ value: v, label: v }));
  const statuses = uniqueValues(employees, 'status').map((v) => ({
    value: v,
    label: v === 'on-leave' ? 'On Leave' : v.charAt(0).toUpperCase() + v.slice(1),
  }));
  const locations = uniqueValues(employees, 'location').map((v) => ({ value: v, label: v }));
  const managers = uniqueManagerOptions(employees).map((m) => ({ value: m.id, label: m.label }));
  const teams = uniqueValues(employees, 'teamName').map((v) => ({ value: v, label: v }));

  const activeCount = Object.values(filters).filter((v) => v !== '').length;
  const hasSearchActive = filters.search !== '';
  const filterOnlyCount = activeCount - (hasSearchActive ? 1 : 0);

  const clearAll = () => {
    onChange({ search: filters.search, department: '', role: '', status: '', location: '', manager: '', team: '' });
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1.5 text-neutral-500">
        <Filter size={14} />
        <span className="text-xs font-medium">Filters</span>
      </div>

      <FilterSelect label="Department" value={filters.department} options={departments} onChange={(v) => onChange({ ...filters, department: v })} />
      <FilterSelect label="Role" value={filters.role} options={roles} onChange={(v) => onChange({ ...filters, role: v })} />
      <FilterSelect label="Status" value={filters.status} options={statuses} onChange={(v) => onChange({ ...filters, status: v })} />
      <FilterSelect label="Location" value={filters.location} options={locations} onChange={(v) => onChange({ ...filters, location: v })} />
      <FilterSelect label="Manager" value={filters.manager} options={managers} onChange={(v) => onChange({ ...filters, manager: v })} />
      <FilterSelect label="Team" value={filters.team} options={teams} onChange={(v) => onChange({ ...filters, team: v })} />

      {filterOnlyCount > 0 && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium transition-colors ml-1"
        >
          <X size={12} /> Clear ({filterOnlyCount})
        </button>
      )}
    </div>
  );
}
