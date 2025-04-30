
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
