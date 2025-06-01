
export interface Employee {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    ssn?: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  employment: {
    employeeId: string;
    hireDate: string;
    terminationDate?: string;
    status: 'active' | 'inactive' | 'terminated' | 'on-leave';
    department: string;
    position: string;
    employeeType: 'full-time' | 'part-time' | 'contractor' | 'temporary';
    manager?: string;
    workLocation: 'office' | 'remote' | 'hybrid' | 'field';
  };
  compensation: {
    payType: 'hourly' | 'salary';
    baseRate: number;
    overtimeRate?: number;
    currency: string;
    payFrequency: 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly';
    effectiveDate: string;
  };
  benefits: {
    healthInsurance: boolean;
    dentalInsurance: boolean;
    visionInsurance: boolean;
    retirement401k: boolean;
    paidTimeOff: number;
    sickLeave: number;
  };
  skills: string[];
  certifications: Certification[];
  performanceReviews: PerformanceReview[];
  timeTracking: {
    totalHoursWorked: number;
    overtime: number;
    currentWeekHours: number;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  documents: EmployeeDocument[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string;
  certificateNumber?: string;
  status: 'active' | 'expired' | 'pending';
}

export interface PerformanceReview {
  id: string;
  reviewDate: string;
  reviewPeriod: {
    startDate: string;
    endDate: string;
  };
  reviewer: string;
  overallRating: number;
  goals: string[];
  achievements: string[];
  areasForImprovement: string[];
  comments: string;
  nextReviewDate: string;
}

export interface EmployeeDocument {
  id: string;
  type: 'contract' | 'tax-form' | 'certification' | 'review' | 'other';
  name: string;
  uploadDate: string;
  fileUrl: string;
  isConfidential: boolean;
}

export interface Department {
  id: string;
  name: string;
  manager: string;
  budget: number;
  employeeCount: number;
  description: string;
}

export interface Payroll {
  id: string;
  employeeId: string;
  payPeriod: {
    startDate: string;
    endDate: string;
  };
  grossPay: number;
  deductions: {
    federalTax: number;
    stateTax: number;
    socialSecurity: number;
    medicare: number;
    healthInsurance: number;
    retirement401k: number;
    other: number;
  };
  netPay: number;
  payDate: string;
  status: 'draft' | 'processed' | 'paid';
}
