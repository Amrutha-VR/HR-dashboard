import type { Employee, OrgNode, HRMetrics, Band, RoleChangePayload } from '../types';

// ─── Hierarchy ────────────────────────────────────────

/**
 * Builds a forest of OrgNode trees from a flat employee list.
 * Employees whose managerId is null or references a non-existent
 * employee are treated as root nodes.
 */
export function buildOrgTree(employees: Employee[]): OrgNode[] {
  const map = new Map<string, OrgNode>();
  const roots: OrgNode[] = [];

  // Create a node for every employee
  for (const emp of employees) {
    map.set(emp.id, { employee: emp, children: [] });
  }

  // Wire parent → child relationships
  for (const emp of employees) {
    const node = map.get(emp.id)!;
    if (emp.managerId && map.has(emp.managerId)) {
      map.get(emp.managerId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

/**
 * Returns the direct reports of a given employee.
 */
export function getDirectReports(employees: Employee[], managerId: string): Employee[] {
  return employees.filter((e) => e.managerId === managerId);
}

/**
 * Returns the manager Employee for a given employee, or null.
 */
export function getManager(employees: Employee[], managerId: string | null): Employee | null {
  if (!managerId) return null;
  return employees.find((e) => e.id === managerId) ?? null;
}

// ─── Filtering ────────────────────────────────────────

export interface EmployeeFilters {
  search: string;
  department: string;
  role: string;
  status: string;
  location: string;
  manager: string;
  team: string;
}

export const emptyFilters: EmployeeFilters = {
  search: '',
  department: '',
  role: '',
  status: '',
  location: '',
  manager: '',
  team: '',
};

/**
 * Applies all active filters to the employee list.
 * Search matches against fullName, employeeCode, and email.
 */
export function filterEmployees(employees: Employee[], filters: EmployeeFilters): Employee[] {
  const q = filters.search.toLowerCase().trim();

  return employees.filter((emp) => {
    // Free-text search
    if (q) {
      const haystack = `${emp.fullName} ${emp.employeeCode} ${emp.email}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    if (filters.department && emp.department !== filters.department) return false;
    if (filters.role && emp.role !== filters.role) return false;
    if (filters.status && emp.status !== filters.status) return false;
    if (filters.location && emp.location !== filters.location) return false;
    if (filters.manager && emp.managerId !== filters.manager) return false;
    if (filters.team && emp.teamName !== filters.team) return false;

    return true;
  });
}

// ─── Sorting ──────────────────────────────────────────

export type SortField = 'fullName' | 'department' | 'designation' | 'dateOfJoining' | 'status' | 'band';
export type SortDirection = 'asc' | 'desc';

const bandOrder: Record<Band, number> = { L1: 1, L2: 2, L3: 3, L4: 4, L5: 5, L6: 6, L7: 7 };

export function sortEmployees(list: Employee[], field: SortField, dir: SortDirection): Employee[] {
  const sorted = [...list].sort((a, b) => {
    let cmp = 0;
    if (field === 'band') {
      cmp = bandOrder[a.band] - bandOrder[b.band];
    } else if (field === 'dateOfJoining') {
      cmp = new Date(a.dateOfJoining).getTime() - new Date(b.dateOfJoining).getTime();
    } else {
      cmp = (a[field] ?? '').localeCompare(b[field] ?? '');
    }
    return dir === 'asc' ? cmp : -cmp;
  });
  return sorted;
}

// ─── Metrics ──────────────────────────────────────────

export function computeHRMetrics(employees: Employee[]): HRMetrics {
  const active = employees.filter((e) => e.status === 'active').length;
  const managers = new Set(employees.filter((e) => e.role === 'Manager' || e.role === 'Team Lead').map((e) => e.id)).size;
  const teams = new Set(employees.map((e) => e.teamName)).size;
  const underReview = employees.filter((e) => e.reviewStatus === 'pending' || e.reviewStatus === 'overdue').length;
  const departments = new Set(employees.map((e) => e.department)).size;

  return {
    totalEmployees: employees.length,
    activeEmployees: active,
    managers,
    teams,
    underReview,
    departments,
  };
}

// ─── Promote / Demote ─────────────────────────────────

/**
 * Returns a new employee list with the given role change applied.
 * This is a pure function — it does not mutate the original array.
 */
export function applyRoleChange(employees: Employee[], payload: RoleChangePayload): Employee[] {
  return employees.map((emp) => {
    if (emp.id !== payload.employeeId) return emp;
    return {
      ...emp,
      designation: payload.newDesignation,
      band: payload.newBand,
      role: payload.newRole,
    };
  });
}

// ─── Performance helpers ──────────────────────────────

/** Average performance rating for a list of employees (ignores nulls) */
export function averageRating(employees: Employee[]): number | null {
  const rated = employees.filter((e) => e.performanceRating !== null);
  if (rated.length === 0) return null;
  return parseFloat((rated.reduce((sum, e) => sum + e.performanceRating!, 0) / rated.length).toFixed(1));
}

/** Department distribution for chart rendering */
export function departmentDistribution(employees: Employee[]): { name: string; count: number }[] {
  const map = new Map<string, number>();
  for (const emp of employees) {
    map.set(emp.department, (map.get(emp.department) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/** Status distribution for chart rendering */
export function statusDistribution(employees: Employee[]): { name: string; count: number }[] {
  const map = new Map<string, number>();
  for (const emp of employees) {
    map.set(emp.status, (map.get(emp.status) ?? 0) + 1);
  }
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
}

// ─── Unique value extractors for filter dropdowns ─────

export function uniqueValues(employees: Employee[], key: keyof Employee): string[] {
  const vals = new Set<string>();
  for (const emp of employees) {
    const v = emp[key];
    if (typeof v === 'string') vals.add(v);
  }
  return Array.from(vals).sort();
}

export function uniqueManagerOptions(employees: Employee[]): { id: string; label: string }[] {
  const managerIds = new Set(employees.map((e) => e.managerId).filter(Boolean) as string[]);
  return employees
    .filter((e) => managerIds.has(e.id))
    .map((e) => ({ id: e.id, label: e.fullName }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

// ─── Date formatting ──────────────────────────────────

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** Calculates tenure in years and months from a joining date */
export function tenure(dateStr: string): string {
  const start = new Date(dateStr);
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }
  if (years === 0) return `${months}mo`;
  if (months === 0) return `${years}y`;
  return `${years}y ${months}mo`;
}

// ─── Avatar fallback ──────────────────────────────────

/** Generates initials from first and last name */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/** Deterministic pastel background for avatar, based on employee id */
export function avatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 35%, 78%)`;
}

// ─── Recent joiners ──────────────────────────────────

/** Returns employees who joined in the last N days, sorted newest first */
export function recentJoiners(employees: Employee[], days: number = 180): Employee[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return employees
    .filter((e) => new Date(e.dateOfJoining) >= cutoff)
    .sort((a, b) => new Date(b.dateOfJoining).getTime() - new Date(a.dateOfJoining).getTime());
}
