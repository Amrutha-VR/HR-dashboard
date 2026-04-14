import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, ShieldCheck, Layers, AlertCircle, Building2, CalendarPlus } from 'lucide-react';
import { useEmployees } from '../hooks';
import {
  MetricCard,
  SearchBar,
  FilterBar,
  EmployeeTable,
  QuoteWidget,
  DepartmentChart,
  StatusChart,
} from '../components';
import {
  computeHRMetrics,
  filterEmployees,
  sortEmployees,
  recentJoiners,
  formatDate,
  emptyFilters,
  type EmployeeFilters,
  type SortField,
  type SortDirection,
} from '../utils';
import Avatar from '../components/Avatar';
import { StatusBadge } from '../components/Badge';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { employees } = useEmployees();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<EmployeeFilters>(emptyFilters);
  const [sortField, setSortField] = useState<SortField>('fullName');
  const [sortDir, setSortDir] = useState<SortDirection>('asc');

  const metrics = useMemo(() => computeHRMetrics(employees), [employees]);

  const filtered = useMemo(() => filterEmployees(employees, filters), [employees, filters]);
  const sorted = useMemo(() => sortEmployees(filtered, sortField, sortDir), [filtered, sortField, sortDir]);

  const joiners = useMemo(() => recentJoiners(employees, 365), [employees]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const handleSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-end justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 tracking-tight">Employee Directory</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Manage your workforce — {employees.length} employees across {metrics.departments} departments
          </p>
        </div>
      </motion.div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard label="Total" value={metrics.totalEmployees} icon={<Users size={18} />} />
        <MetricCard label="Active" value={metrics.activeEmployees} icon={<UserCheck size={18} />} accent="text-emerald-700" />
        <MetricCard label="Managers" value={metrics.managers} icon={<ShieldCheck size={18} />} />
        <MetricCard label="Teams" value={metrics.teams} icon={<Layers size={18} />} />
        <MetricCard label="Under Review" value={metrics.underReview} icon={<AlertCircle size={18} />} accent="text-amber-600" />
        <MetricCard label="Departments" value={metrics.departments} icon={<Building2 size={18} />} />
      </div>

      {/* Quote + Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <QuoteWidget />
          <StatusChart employees={employees} />
        </div>
        <div className="lg:col-span-1">
          <DepartmentChart employees={employees} />
        </div>
        {/* Recent joiners */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-neutral-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] h-full">
            <div className="flex items-center gap-2 mb-4">
              <CalendarPlus size={15} className="text-neutral-500" />
              <h3 className="text-sm font-semibold text-neutral-700">Recent Joiners</h3>
            </div>
            <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
              {joiners.length === 0 && (
                <p className="text-xs text-neutral-400 py-4 text-center">No recent joiners</p>
              )}
              {joiners.slice(0, 8).map((emp) => (
                <div
                  key={emp.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-stone-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/employee/${emp.id}`)}
                >
                  <Avatar firstName={emp.firstName} lastName={emp.lastName} id={emp.id} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-neutral-700 truncate">{emp.fullName}</p>
                    <p className="text-xs text-neutral-400">{emp.designation}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[11px] text-neutral-400">{formatDate(emp.dateOfJoining)}</p>
                    <StatusBadge status={emp.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-xl border border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="px-5 pt-5 pb-3 space-y-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <SearchBar value={filters.search} onChange={handleSearch} />
            <p className="text-xs text-neutral-400 font-medium">
              {sorted.length} of {employees.length} employees
            </p>
          </div>
          <FilterBar filters={filters} onChange={setFilters} employees={employees} />
        </div>

        {/* Employee table */}
        <EmployeeTable employees={sorted} sortField={sortField} sortDir={sortDir} onSort={handleSort} />
      </div>
    </div>
  );
}
