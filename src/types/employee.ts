/** Core status values for employee lifecycle */
export type EmployeeStatus = 'active' | 'inactive' | 'on-leave' | 'probation';

/** Employment classification */
export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'intern';

/** Performance rating scale (1–5) */
export type PerformanceRating = 1 | 2 | 3 | 4 | 5;

/** Direction of recent performance change */
export type PerformanceTrend = 'improving' | 'stable' | 'declining';

/** Current state of an employee's periodic review */
export type ReviewStatus = 'completed' | 'pending' | 'overdue' | 'not-started';

/** Seniority band used for compensation and role mapping */
export type Band = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7';

/** Physical or emergency contact address */
export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

/** Emergency contact record */
export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

/** Project assignment (current or historical) */
export interface ProjectAssignment {
  name: string;
  role: string;
  startDate: string;
  endDate?: string;
}

/** Profile completeness tracking for HR data quality */
export interface ProfileCompleteness {
  percentage: number;
  missingFields: string[];
}

/**
 * The canonical Employee model.
 * Every employee in the system is represented by this shape.
 * Optional fields allow for real-world data gaps.
 */
export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  designation: string;
  band: Band;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  dateOfJoining: string;
  location: string;
  managerId: string | null;
  teamName: string;
  currentProject: ProjectAssignment | null;
  previousProjects: ProjectAssignment[];
  performanceRating: PerformanceRating | null;
  performanceTrend: PerformanceTrend | null;
  reviewStatus: ReviewStatus;
  avatar: string | null;
  address: Address | null;
  emergencyContact: EmergencyContact | null;
  notes: string | null;
  profileCompleteness: ProfileCompleteness;
}

/** A lightweight node for org-chart rendering */
export interface OrgNode {
  employee: Employee;
  children: OrgNode[];
}

/** Shape of the HR summary metrics shown on the dashboard */
export interface HRMetrics {
  totalEmployees: number;
  activeEmployees: number;
  managers: number;
  teams: number;
  underReview: number;
  departments: number;
}

/** Payload for a promote / demote action */
export interface RoleChangePayload {
  employeeId: string;
  newDesignation: string;
  newBand: Band;
  newRole: string;
  effectiveDate: string;
}
