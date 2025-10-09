import { Patient, MedicalRecord, Cost } from '../types';

export const mockPatients: Patient[] = [
  {
    id: '1',
    fullName: 'Nguyễn Văn An',
    dateOfBirth: '1980-05-15',
    idNumber: '123456789012',
    department: 'Nội',
    roomNumber: '101',
    bedNumber: 'A1',
    status: 'treating',
    admissionDate: '2024-01-10'
  },
  {
    id: '2',
    fullName: 'Trần Thị Bình',
    dateOfBirth: '1975-08-22',
    idNumber: '987654321098',
    department: 'Sản',
    roomNumber: '205',
    bedNumber: 'B2',
    status: 'preparing_discharge',
    admissionDate: '2024-01-08'
  },
  {
    id: '3',
    fullName: 'Lê Văn Cường',
    dateOfBirth: '1990-12-03',
    idNumber: '456789123456',
    department: 'Ngoại',
    roomNumber: '302',
    bedNumber: 'C3',
    status: 'treating',
    admissionDate: '2024-01-12'
  },
  {
    id: '4',
    fullName: 'Phạm Thị Dung',
    dateOfBirth: '1985-03-18',
    idNumber: '654321987654',
    department: 'Nhi',
    roomNumber: '108',
    bedNumber: 'D1',
    status: 'discharged',
    admissionDate: '2024-01-05'
  },
  {
    id: '5',
    fullName: 'Hoàng Văn Đức',
    dateOfBirth: '1972-11-30',
    idNumber: '789123456789',
    department: 'Nội',
    roomNumber: '103',
    bedNumber: 'A3',
    status: 'treating',
    admissionDate: '2024-01-11'
  }
];

export const mockMedicalRecords: MedicalRecord[] = [
  {
    id: '1',
    patientId: '1',
    recordCode: 'EMR001',
    medicalHistory: 'Tiền sử tăng huyết áp, đái tháo đường type 2',
    initialDiagnosis: 'Nhồi máu cơ tim cấp',
    treatmentPlan: 'Thuốc chống đông máu, stent mạch vành, theo dõi chức năng tim',
    testResults: ['ECG: ST elevation', 'Troponin: 15.2 ng/mL', 'CK-MB: 45 U/L'],
    doctorNotes: 'Bệnh nhân đáp ứng tốt với điều trị. Cần theo dõi chức năng tim.',
    nurseNotes: 'Theo dõi dấu hiệu sinh tồn 4h/lần. Bệnh nhân tỉnh táo.',
    createdDate: '2024-01-10',
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    patientId: '2',
    recordCode: 'EMR002',
    medicalHistory: 'Sinh con lần 2, tiền sử sinh thường lần 1',
    initialDiagnosis: 'Thai 38 tuần, sản phụ khỏe mạnh',
    treatmentPlan: 'Theo dõi diễn biến chuyển dạ, hỗ trợ sinh thường',
    testResults: ['CTG: Nhịp tim thai bình thường', 'Siêu âm: Thai nhi phát triển tốt'],
    doctorNotes: 'Sản phụ sẵn sàng sinh. Chuẩn bị ra viện sau sinh.',
    nurseNotes: 'Hướng dẫn chăm sóc em bé và sau sinh cho sản phụ.',
    createdDate: '2024-01-08',
    lastUpdated: '2024-01-14'
  }
];

export const mockCosts: Cost[] = [
  {
    id: '1',
    patientId: '1',
    medicationCost: 5500000,
    testCost: 2300000,
    bedCost: 1200000,
    advancePayment: 8000000,
    remainingPayment: 1000000,
    totalCost: 9000000,
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    patientId: '2',
    medicationCost: 800000,
    testCost: 1500000,
    bedCost: 2100000,
    advancePayment: 4000000,
    remainingPayment: 400000,
    totalCost: 4400000,
    lastUpdated: '2024-01-14'
  },
  {
    id: '3',
    patientId: '3',
    medicationCost: 3200000,
    testCost: 1800000,
    bedCost: 1500000,
    advancePayment: 5000000,
    remainingPayment: 1500000,
    totalCost: 6500000,
    lastUpdated: '2024-01-15'
  }
];