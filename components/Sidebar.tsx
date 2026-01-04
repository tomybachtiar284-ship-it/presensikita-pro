
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Camera, 
  History, 
  CalendarDays, 
  Users, 
  Settings,
  Calendar,
  LogOut, 
  X,
  Menu,
  Wallet
} from 'lucide-react';
import { User, UserRole } from '../types';

interface SidebarProps {
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Presensi', icon: Camera, path: '/attendance' },
    { name: 'Jadwal', icon: Calendar, path: '/schedule' },
    { name: 'Gaji', icon: Wallet, path: '/payroll' },
    { name: 'Riwayat', icon: History, path: '/history' },
    { name: 'Izin & Cuti', icon: CalendarDays, path: '/leave' },
  ];

  if (user.role === UserRole.ADMIN) {
    menuItems.push({ name: 'Karyawan', icon: Users, path: '/employees' });
    menuItems.push({ name: 'Pengaturan', icon: Settings, path: '/settings' });
  }

  const NavContent = () => (
    <div className="flex flex-col h-full bg-white lg:bg-transparent">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-indigo-600 tracking-tight">PresensiKita</h1>
        <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Enterprise Hub</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 mb-4">
          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.nid}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Keluar</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 z-40">
        <h1 className="text-xl font-bold text-indigo-600">PresensiKita</h1>
        <button onClick={() => setIsOpen(true)} className="p-2 text-slate-600">
          <Menu size={24} />
        </button>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-100 flex items-center justify-around px-2 z-40">
        {menuItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                isActive ? 'text-indigo-600' : 'text-slate-400'
              }`
            }
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>

      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 border-r border-slate-200 bg-white flex-col z-30">
        <NavContent />
      </aside>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white animate-in slide-in-from-right duration-300">
            <div className="flex justify-end p-4">
              <button onClick={() => setIsOpen(false)} className="p-2 text-slate-600">
                <X size={24} />
              </button>
            </div>
            <NavContent />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
