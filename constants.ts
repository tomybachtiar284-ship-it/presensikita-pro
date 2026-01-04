
import { UserRole, User, ShiftGroup, AppSettings, ShiftType, ShiftDefinition, PayrollRecord } from './types';

export const APP_NAME = 'PresensiKita';

export const DEFAULT_SETTINGS: AppSettings = {
  officeLat: -6.2000,
  officeLng: 106.8166,
  radiusMeters: 500
};

export const SHIFT_DEFINITIONS: ShiftDefinition[] = [
  { type: ShiftType.PAGI, name: 'Shift Pagi', startTime: '07:30', endTime: '15:30', color: 'bg-emerald-500' },
  { type: ShiftType.SORE, name: 'Shift Sore', startTime: '15:30', endTime: '23:30', color: 'bg-orange-500' },
  { type: ShiftType.MALAM, name: 'Shift Malam', startTime: '23:30', endTime: '07:30', color: 'bg-indigo-500' },
  { type: ShiftType.REGULER, name: 'Reguler', startTime: '08:00', endTime: '17:00', color: 'bg-blue-500' },
  { type: ShiftType.DAYTIME, name: 'Daytime', startTime: '09:00', endTime: '18:00', color: 'bg-cyan-500' },
  { type: ShiftType.LIBUR, name: 'Libur', startTime: '00:00', endTime: '00:00', color: 'bg-slate-400' },
];

export const MOCK_USERS: User[] = [
  { 
    id: '1', 
    nid: 'ADM001', 
    name: 'Admin Utama', 
    email: 'admin@presensi.com', 
    role: UserRole.ADMIN, 
    avatar: 'https://picsum.photos/seed/admin/200', 
    division: 'HR & GA', 
    position: 'HR Manager', 
    workUnit: 'Kantor Pusat', 
    shiftGroup: ShiftGroup.REGULER,
    joinDate: '2020-01-15'
  },
  { 
    id: '2', 
    nid: 'MGR022', 
    name: 'Budi Manager', 
    email: 'manager@presensi.com', 
    role: UserRole.MANAGER, 
    avatar: 'https://picsum.photos/seed/manager/200', 
    division: 'Sales', 
    position: 'Area Manager', 
    workUnit: 'Cabang Jakarta', 
    shiftGroup: ShiftGroup.DAYTIME,
    joinDate: '2021-06-10'
  },
  { 
    id: '3', 
    nid: 'STF089', 
    name: 'Siti Karyawan', 
    email: 'siti@presensi.com', 
    role: UserRole.EMPLOYEE, 
    avatar: 'https://picsum.photos/seed/siti/200', 
    division: 'Marketing', 
    position: 'Sales Officer', 
    workUnit: 'Cabang Jakarta', 
    shiftGroup: ShiftGroup.SHIFT_A,
    joinDate: '2022-03-22'
  },
];

export const MOCK_PAYROLLS: PayrollRecord[] = [
  {
    id: 'pay_1',
    userId: '3',
    month: '2024-09',
    basicSalary: 4500000,
    allowance: 750000,
    deduction: 50000,
    netSalary: 5200000,
    paymentDate: '2024-09-25',
    status: 'PAID'
  },
  {
    id: 'pay_2',
    userId: '3',
    month: '2024-08',
    basicSalary: 4500000,
    allowance: 800000,
    deduction: 0,
    netSalary: 5300000,
    paymentDate: '2024-08-26',
    status: 'PAID'
  }
];
