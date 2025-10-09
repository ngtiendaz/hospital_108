// Types cho ứng dụng quản lý bệnh nhân
export interface Patient {
  id: string;
  fullName: string;
  dateOfBirth: string;
  idNumber: string;
  department: string;
  roomNumber: string;
  bedNumber: string;
  status: 'treating' | 'preparing_discharge' | 'discharged';
  admissionDate: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  recordCode: string;
  medicalHistory: string;
  initialDiagnosis: string;
  treatmentPlan: string;
  testResults: string[];
  doctorNotes: string;
  nurseNotes: string;
  createdDate: string;
  lastUpdated: string;
}

export interface Cost {
  id: string;
  patientId: string;
  medicationCost: number;
  testCost: number;
  bedCost: number;
  advancePayment: number;
  remainingPayment: number;
  totalCost: number;
  lastUpdated: string;
}

export interface DashboardStats {
  totalPatients: number;
  treatingPatients: number;
  preparingDischarge: number;
  dischargedPatients: number;
  totalRevenue: number;
  pendingPayments: number;
}