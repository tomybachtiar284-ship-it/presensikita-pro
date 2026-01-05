
// Enums
export const UserRole = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  EMPLOYEE: 'EMPLOYEE'
};

export const AttendanceStatus = {
  PRESENT: 'PRESENT',
  LATE: 'LATE',
  ABSENT: 'ABSENT',
  LEAVE: 'LEAVE',
  SICK: 'SICK',
  BUSINESS_TRIP: 'BUSINESS_TRIP'
};

export const RequestStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

export const ShiftGroup = {
  SHIFT_A: 'Shift A',
  SHIFT_B: 'Shift B',
  SHIFT_C: 'Shift C',
  SHIFT_D: 'Shift D',
  DAYTIME: 'Daytime',
  REGULER: 'Reguler'
};

export const ShiftType = {
  PAGI: 'PAGI',
  SORE: 'SORE',
  MALAM: 'MALAM',
  LIBUR: 'LIBUR',
  REGULER: 'REGULER',
  DAYTIME: 'DAYTIME'
};

export const APP_NAME = 'PresensiKita';

export const DEFAULT_SETTINGS = {
  officeLat: 1.5709993,
  officeLng: 127.8087693,
  radiusMeters: 500
};

export const SHIFT_DEFINITIONS = [
  { type: ShiftType.PAGI, name: 'Shift Pagi', startTime: '07:30', endTime: '15:30', color: 'bg-emerald-500' },
  { type: ShiftType.SORE, name: 'Shift Sore', startTime: '15:30', endTime: '23:30', color: 'bg-orange-500' },
  { type: ShiftType.MALAM, name: 'Shift Malam', startTime: '23:30', endTime: '07:30', color: 'bg-indigo-500' },
  { type: ShiftType.REGULER, name: 'Reguler', startTime: '08:00', endTime: '17:00', color: 'bg-blue-500' },
  { type: ShiftType.DAYTIME, name: 'Daytime', startTime: '09:00', endTime: '18:00', color: 'bg-cyan-500' },
  { type: ShiftType.LIBUR, name: 'Libur', startTime: '00:00', endTime: '00:00', color: 'bg-slate-400' },
];

// --- Local Storage Management ---

const STORAGE_KEYS = {
  USERS: 'PK_USERS_V2',
  PAYROLLS: 'PK_PAYROLLS',
  ATTENDANCE: 'PK_ATTENDANCE',
  REQUESTS: 'PK_REQUESTS', // For Izin/Cuti
  SCHEDULE_OVERRIDES: 'SCHEDULE_OVERRIDES',
  VIOLATIONS: 'PK_VIOLATIONS',
  SPPD: 'PK_SPPD',
  NOTIFICATIONS: 'PK_NOTIFICATIONS',
  SETTINGS: 'PK_SETTINGS'
};

const DEFAULT_ADMIN = {
  id: 'admin_1',
  nid: 'ADM001',
  name: 'Administrator',
  email: 'admin@presensi.com',
  role: UserRole.ADMIN,
  avatar: 'https://ui-avatars.com/api/?name=Admin&background=4f46e5&color=fff',
  division: 'IT & System',
  position: 'Super Admin',
  workUnit: 'Pusat',
  shiftGroup: ShiftGroup.REGULER,
  joinDate: '2020-01-01'
};

// Initialize Storage if Empty or Missing Admin
const initStorage = () => {
  let users = [];
  try {
    users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  } catch (e) {
    users = [];
  }

  // Ensure at least one admin exists
  const hasAdmin = users.some(u => u.role === UserRole.ADMIN);
  if (!hasAdmin) {
    users.unshift(DEFAULT_ADMIN);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  // Initialize other keys
  if (!localStorage.getItem(STORAGE_KEYS.PAYROLLS)) {
    localStorage.setItem(STORAGE_KEYS.PAYROLLS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SCHEDULE_OVERRIDES)) {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE_OVERRIDES, JSON.stringify({}));
  }
  if (!localStorage.getItem(STORAGE_KEYS.VIOLATIONS)) {
    localStorage.setItem(STORAGE_KEYS.VIOLATIONS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
  }
};

initStorage();

// Data Accessors (replacing const MOCK_XXXX calls)
export const getUsers = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
export const saveUsers = (users) => localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

export const getPayrolls = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYROLLS) || '[]');
export const savePayrolls = (payrolls) => localStorage.setItem(STORAGE_KEYS.PAYROLLS, JSON.stringify(payrolls));

export const getAttendance = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE) || '[]');
export const saveAttendance = (data) => localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(data));

export const getRequests = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || '[]');
export const saveRequests = (data) => localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(data));

export const getOverrides = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.SCHEDULE_OVERRIDES) || '{}');
export const saveOverrides = (overrides) => localStorage.setItem(STORAGE_KEYS.SCHEDULE_OVERRIDES, JSON.stringify(overrides));

export const getViolations = () => {
  const data = localStorage.getItem(STORAGE_KEYS.VIOLATIONS);
  return data ? JSON.parse(data) : [];
};

export const saveViolations = (data) => {
  localStorage.setItem(STORAGE_KEYS.VIOLATIONS, JSON.stringify(data));
};

export const getSPPD = () => {
  const data = localStorage.getItem(STORAGE_KEYS.SPPD);
  return data ? JSON.parse(data) : [];
};

export const saveSPPD = (data) => {
  localStorage.setItem(STORAGE_KEYS.SPPD, JSON.stringify(data));
};
export const getNotifications = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
export const saveNotifications = (data) => localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(data));

// Helper: Add Notification
export const addNotification = (userId, title, message, type = 'INFO') => {
  const list = getNotifications();
  list.push({
    id: 'NOTIF-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    userId,
    title,
    message,
    type,
    isRead: false,
    createdAt: new Date().toISOString()
  });
  saveNotifications(list);
};

export const markReadNotification = (id) => {
  const list = getNotifications();
  const idx = list.findIndex(n => n.id === id);
  if (idx !== -1) {
    list[idx].isRead = true;
    saveNotifications(list);
  }
};

// Helper Class to Group Operations
export class StorageManager {
  static getUsers() { return getUsers(); }
  static saveUsers(data) { saveUsers(data); return data; }

  static getPayrolls() { return getPayrolls(); }
  static savePayrolls(data) { savePayrolls(data); return data; }

  static getAttendance() { return getAttendance(); }
  static saveAttendance(data) { saveAttendance(data); return data; }

  static getRequests() { return getRequests(); }
  static saveRequests(data) { saveRequests(data); return data; }

  static getViolations() { return getViolations(); }
  static saveViolations(data) { saveViolations(data); return data; }

  static getSPPD() { return getSPPD(); }
  static saveSPPD(data) { saveSPPD(data); return data; }

  static getNotifications() { return getNotifications(); }
  static saveNotifications(data) { saveNotifications(data); return data; }
  static addNotification(userId, title, message, type) { addNotification(userId, title, message, type); }
  static markReadNotification(id) { markReadNotification(id); }

  static upsertUser(user) {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) users[idx] = user;
    else users.push(user);
    saveUsers(users);
    return users;
  }

  static deleteUser(id) {
    const users = getUsers().filter(u => u.id !== id);
    saveUsers(users);
    return users;
  }
}
