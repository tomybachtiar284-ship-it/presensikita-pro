
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE'
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  LATE = 'LATE',
  ABSENT = 'ABSENT',
  LEAVE = 'LEAVE',
  SICK = 'SICK',
  BUSINESS_TRIP = 'BUSINESS_TRIP'
}

export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum ShiftGroup {
  SHIFT_A = 'Shift A',
  SHIFT_B = 'Shift B',
  SHIFT_C = 'Shift C',
  SHIFT_D = 'Shift D',
  DAYTIME = 'Daytime',
  REGULER = 'Reguler'
}

export enum ShiftType {
  PAGI = 'PAGI',
  SORE = 'SORE',
  MALAM = 'MALAM',
  LIBUR = 'LIBUR',
  REGULER = 'REGULER',
  DAYTIME = 'DAYTIME'
}

export interface User {
  id: string;
  nid: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  division: string;
  position: string;
  workUnit: string;
  shiftGroup: ShiftGroup;
  joinDate: string; // ISO format YYYY-MM-DD
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: AttendanceStatus;
  location: { lat: number; lng: number };
  selfieUrl: string;
  lateMinutes: number;
}

export interface PayrollRecord {
  id: string;
  userId: string;
  month: string; // YYYY-MM
  basicSalary: number;
  allowance: number;
  deduction: number;
  netSalary: number;
  paymentDate?: string;
  status: 'PAID' | 'PENDING';
}

export interface DayAssignment {
  date: string; // ISO format YYYY-MM-DD
  shiftType: ShiftType;
}

export interface ShiftDefinition {
  type: ShiftType;
  name: string;
  startTime: string;
  endTime: string;
  color: string;
}

export interface AppSettings {
  officeLat: number;
  officeLng: number;
  radiusMeters: number;
}
