
export type UserRole = 'admin' | 'manager' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  managerId?: string;
}

export type CycleStatus = 'open' | 'closed';
export type ReviewFrequency = 'quarterly' | 'half-yearly';

export interface ReviewCycle {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  frequency: ReviewFrequency;
  status: CycleStatus;
}

export interface ReviewWindow {
  id: string;
  cycleId: string;
  label: string;
  openDate: Date;
  closeDate: Date;
}

export interface Assignment {
  id: string;
  employeeId: string;
  cycleId: string;
  kra: string;
  kpi: string;
  target: string;
  unit: string;
  weight: number;
}

export type RaterType = 'self' | 'manager';

export type ReviewRating = 'excellent' | 'good' | 'average' | 'requires_improvement';

export type KraStatus = 'pending_validation' | 'validated' | 'rejected';
export type KpiStatus = 'not_started' | 'in_progress' | 'completed';
export type ImportanceLevel = 'high' | 'medium' | 'low';
export type UrgencyLevel = 'high' | 'medium' | 'low';

export interface Kra {
  id: string;
  employeeId: string;
  cycleId: string;
  title: string;
  description?: string;
  status: KraStatus;
  importance: ImportanceLevel;
  urgency: UrgencyLevel;
  endDate: Date;
  progress: number;
  kpis: Kpi[];
}

export interface Kpi {
  id: string;
  kraId: string;
  description: string;
  target: string;
  unit: string;
  weight: number;
  progress: number;
  status: KpiStatus;
}

export interface Rating {
  id: string;
  assignmentId: string;
  raterId: string;
  raterType: RaterType;
  score: number;
  comment: string;
  windowId: string;
  createdAt: Date;
}

export interface CycleCreationFormData {
  name: string;
  startDate: Date | string;
  endDate: Date | string;
  frequency: ReviewFrequency;
}

export interface GoalAssignmentFormData {
  employeeId: string;
  cycleId: string;
  kras: {
    title: string;
    kpis: {
      description: string;
      target: string;
      unit: string;
      weight: number;
    }[];
  }[];
}

export interface SelfReviewFormData {
  ratings: {
    assignmentId: string;
    score: number;
    comment: string;
  }[];
}

export interface ManagerReviewFormData {
  ratings: {
    assignmentId: string;
    selfScore: number;
    selfComment: string;
    managerScore: number;
    managerComment: string;
  }[];
}

export interface DashboardStats {
  employeesWithGoals: number;
  totalEmployees: number;
  completedReviews: number;
  pendingReviews: number;
  activeCycle: ReviewCycle | null;
  activeWindow: ReviewWindow | null;
}

// Mock authentication state until we integrate with a backend
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
