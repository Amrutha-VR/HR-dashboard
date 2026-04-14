import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, MapPin, Mail, Phone, Calendar, Briefcase, Building2,
  Users, Network, ArrowUpCircle, ArrowDownCircle, ClipboardList,
  FolderOpen, AlertTriangle, FileText,
} from 'lucide-react';
import { useEmployees } from '../hooks';
import Avatar from '../components/Avatar';
import { StatusBadge, ReviewBadge, TrendBadge, BandBadge, EmploymentTypeBadge } from '../components/Badge';
import PerformanceStars from '../components/PerformanceStars';
import PromoteModal from '../components/PromoteModal';
import { getDirectReports, getManager, formatDate, tenure, averageRating } from '../utils';
import type { RoleChangePayload, Employee } from '../types';

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon size={15} className="text-neutral-400 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">{label}</p>
        <div className="text-sm text-neutral-700 mt-0.5">{value}</div>
      </div>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="px-5 py-3.5 border-b border-neutral-100 flex items-center gap-2">
        <Icon size={15} className="text-neutral-500" />
        <h3 className="text-sm font-semibold text-neutral-700">{title}</h3>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function ProjectCard({ project, isCurrent }: { project: { name: string; role: string; startDate: string; endDate?: string }; isCurrent: boolean }) {
  return (
    <div className={`rounded-lg border px-4 py-3 ${isCurrent ? 'border-emerald-200 bg-emerald-50/30' : 'border-neutral-100 bg-stone-50/40'}`}>
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium text-neutral-800">{project.name}</p>
        {isCurrent && <span className="text-[10px] font-semibold text-emerald-600 uppercase bg-emerald-100 px-1.5 py-0.5 rounded">Current</span>}
      </div>
      <p className="text-xs text-neutral-500 mt-1">{project.role}</p>
      <p className="text-xs text-neutral-400 mt-0.5">
        {formatDate(project.startDate)} — {project.endDate ? formatDate(project.endDate) : 'Present'}
      </p>
    </div>
  );
}

export default function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employees, updateRole, getById } = useEmployees();
  const [modalMode, setModalMode] = useState<'promote' | 'demote' | null>(null);

  const employee = getById(id ?? '');
  const manager = useMemo(() => (employee ? getManager(employees, employee.managerId) : null), [employees, employee]);
  const directReports = useMemo(() => (employee ? getDirectReports(employees, employee.id) : []), [employees, employee]);
  const teamAvgRating = useMemo(() => (directReports.length > 0 ? averageRating(directReports) : null), [directReports]);

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-neutral-400">
        <AlertTriangle size={40} className="mb-3" />
        <p className="text-lg font-medium text-neutral-600">Employee not found</p>
        <p className="text-sm mt-1">The employee record you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 px-4 py-2 text-sm font-medium bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors"
        >
          Back to Directory
        </button>
      </div>
    );
  }

  const handleRoleChange = (payload: RoleChangePayload) => {
    updateRole(payload);
    setModalMode(null);
  };

  return (
    <div className="space-y-6">
      {/* Back + actions bar */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex items-center justify-between"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors font-medium"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/org-chart?highlight=${employee.id}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-neutral-200 rounded-lg text-neutral-600 hover:bg-stone-50 transition-colors"
          >
            <Network size={13} /> View in Org Chart
          </button>
          <button
            onClick={() => setModalMode('promote')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
          >
            <ArrowUpCircle size={13} /> Promote
          </button>
          <button
            onClick={() => setModalMode('demote')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            <ArrowDownCircle size={13} /> Demote
          </button>
        </div>
      </motion.div>

      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white rounded-xl border border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-6 py-5"
      >
        <div className="flex items-start gap-5">
          <Avatar firstName={employee.firstName} lastName={employee.lastName} id={employee.id} avatar={employee.avatar} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-neutral-800">{employee.fullName}</h1>
              <StatusBadge status={employee.status} />
              <EmploymentTypeBadge type={employee.employmentType} />
            </div>
            <p className="text-sm text-neutral-500 mt-1">{employee.designation}</p>
            <div className="flex items-center gap-4 mt-2 flex-wrap text-xs text-neutral-400">
              <span className="flex items-center gap-1"><Mail size={12} /> {employee.email}</span>
              <span className="flex items-center gap-1"><Phone size={12} /> {employee.phone}</span>
              <span className="flex items-center gap-1"><MapPin size={12} /> {employee.location}</span>
            </div>
          </div>
          <div className="text-right shrink-0 hidden sm:block">
            <p className="text-xs text-neutral-400">{employee.employeeCode}</p>
            <BandBadge band={employee.band} />
            {employee.profileCompleteness.percentage < 100 && (
              <div className="mt-2">
                <div className="w-20 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all"
                    style={{ width: `${employee.profileCompleteness.percentage}%` }}
                  />
                </div>
                <p className="text-[10px] text-neutral-400 mt-0.5">{employee.profileCompleteness.percentage}% complete</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Employment details */}
          <SectionCard title="Employment Details" icon={Briefcase}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
              <InfoRow icon={Building2} label="Department" value={employee.department} />
              <InfoRow icon={Users} label="Team" value={employee.teamName} />
              <InfoRow icon={Calendar} label="Date of Joining" value={formatDate(employee.dateOfJoining)} />
              <InfoRow icon={Calendar} label="Tenure" value={tenure(employee.dateOfJoining)} />
              <InfoRow
                icon={Users}
                label="Reporting Manager"
                value={
                  manager ? (
                    <Link
                      to={`/employee/${manager.id}`}
                      className="text-neutral-700 hover:text-neutral-900 underline underline-offset-2 decoration-neutral-300 hover:decoration-neutral-500 transition-colors"
                    >
                      {manager.fullName}
                    </Link>
                  ) : employee.managerId ? (
                    <span className="text-neutral-400 italic">Unknown (ID: {employee.managerId})</span>
                  ) : (
                    <span className="text-neutral-400">—</span>
                  )
                }
              />
              {directReports.length > 0 && (
                <InfoRow icon={Users} label="Direct Reports" value={`${directReports.length} employee${directReports.length > 1 ? 's' : ''}`} />
              )}
            </div>
          </SectionCard>

          {/* Projects */}
          <SectionCard title="Projects" icon={FolderOpen}>
            <div className="space-y-2.5">
              {employee.currentProject && (
                <ProjectCard project={employee.currentProject} isCurrent />
              )}
              {employee.previousProjects.length > 0 ? (
                employee.previousProjects.map((p, i) => (
                  <ProjectCard key={i} project={p} isCurrent={false} />
                ))
              ) : !employee.currentProject ? (
                <p className="text-xs text-neutral-400 py-4 text-center">No project assignments</p>
              ) : null}
            </div>
          </SectionCard>

          {/* Direct reports list */}
          {directReports.length > 0 && (
            <SectionCard title={`Direct Reports (${directReports.length})`} icon={Users}>
              <div className="space-y-2">
                {directReports.map((dr) => (
                  <DirectReportRow key={dr.id} employee={dr} navigate={navigate} />
                ))}
              </div>
              {teamAvgRating !== null && (
                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs text-neutral-500 font-medium">Team Average Rating</span>
                  <span className="text-sm font-bold text-neutral-700">{teamAvgRating} / 5</span>
                </div>
              )}
            </SectionCard>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Performance */}
          <SectionCard title="Performance" icon={ClipboardList}>
            <div className="space-y-3">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium mb-1">Rating</p>
                <PerformanceStars rating={employee.performanceRating} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium mb-1">Trend</p>
                <TrendBadge trend={employee.performanceTrend} />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium mb-1">Review Status</p>
                <ReviewBadge status={employee.reviewStatus} />
              </div>
            </div>
          </SectionCard>

          {/* Contact */}
          <SectionCard title="Contact & Address" icon={MapPin}>
            {employee.address ? (
              <div className="text-sm text-neutral-600 leading-relaxed">
                <p>{employee.address.street}</p>
                <p>{employee.address.city}, {employee.address.state} {employee.address.zip}</p>
                <p>{employee.address.country}</p>
              </div>
            ) : (
              <p className="text-xs text-neutral-400 italic">Address not provided</p>
            )}

            {employee.emergencyContact && (
              <div className="mt-4 pt-3 border-t border-neutral-100">
                <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium mb-1">Emergency Contact</p>
                <p className="text-sm text-neutral-700 font-medium">{employee.emergencyContact.name}</p>
                <p className="text-xs text-neutral-500">{employee.emergencyContact.relationship} · {employee.emergencyContact.phone}</p>
              </div>
            )}
          </SectionCard>

          {/* Notes */}
          {employee.notes && (
            <SectionCard title="Notes" icon={FileText}>
              <p className="text-sm text-neutral-600 leading-relaxed">{employee.notes}</p>
            </SectionCard>
          )}

          {/* Profile completeness */}
          {employee.profileCompleteness.missingFields.length > 0 && (
            <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl px-5 py-4">
              <p className="text-xs font-semibold text-amber-700 mb-2">
                Profile {employee.profileCompleteness.percentage}% Complete
              </p>
              <p className="text-xs text-amber-600">
                Missing: {employee.profileCompleteness.missingFields.join(', ')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Promote / Demote modal */}
      {modalMode && (
        <PromoteModal
          employee={employee}
          mode={modalMode}
          onConfirm={handleRoleChange}
          onClose={() => setModalMode(null)}
        />
      )}
    </div>
  );
}

function DirectReportRow({ employee, navigate }: { employee: Employee; navigate: ReturnType<typeof useNavigate> }) {
  return (
    <div
      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-stone-50 cursor-pointer transition-colors"
      onClick={() => navigate(`/employee/${employee.id}`)}
    >
      <Avatar firstName={employee.firstName} lastName={employee.lastName} id={employee.id} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-700 truncate">{employee.fullName}</p>
        <p className="text-xs text-neutral-400 truncate">{employee.designation}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <PerformanceStars rating={employee.performanceRating} size="sm" />
        <StatusBadge status={employee.status} />
      </div>
    </div>
  );
}
