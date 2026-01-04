
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Clock, 
  CalendarCheck, 
  AlertCircle,
  Sparkles,
  ClipboardList,
  UserCheck,
  Activity,
  History,
  Wallet
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { User, UserRole, ShiftType, ShiftGroup } from '../types';
import { SHIFT_DEFINITIONS, MOCK_PAYROLLS } from '../constants';

const MOCK_STATS_ADMIN = [
  { name: 'Sen', hadir: 120, telat: 5 },
  { name: 'Sel', hadir: 115, telat: 10 },
  { name: 'Rab', hadir: 122, telat: 2 },
  { name: 'Kam', hadir: 118, telat: 4 },
  { name: 'Jum', hadir: 110, telat: 8 },
];

const MOCK_STATS_USER = [
  { name: 'Minggu 1', jam: 40 },
  { name: 'Minggu 2', jam: 42 },
  { name: 'Minggu 3', jam: 38 },
  { name: 'Minggu 4', jam: 45 },
];

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [insights, setInsights] = useState<string>("Menganalisis performa...");
  const [currentTime, setCurrentTime] = useState(new Date());
  const isAdmin = user.role === UserRole.ADMIN;

  const calculateTenure = (joinDateStr: string) => {
    const joinDate = new Date(joinDateStr);
    const now = new Date();
    let years = now.getFullYear() - joinDate.getFullYear();
    let months = now.getMonth() - joinDate.getMonth();
    if (months < 0 || (months === 0 && now.getDate() < joinDate.getDate())) {
      years--;
      months += 12;
    }
    return `${years} th ${months} bln`;
  };

  const latestSalary = useMemo(() => {
    return MOCK_PAYROLLS.find(p => p.userId === user.id);
  }, [user.id]);

  const activeShiftNow = useMemo(() => {
    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    for (const shift of SHIFT_DEFINITIONS) {
      if (shift.type === ShiftType.LIBUR || shift.type === ShiftType.REGULER) continue;
      const [startH, startM] = shift.startTime.split(':').map(Number);
      const [endH, endM] = shift.endTime.split(':').map(Number);
      const startTotal = startH * 60 + startM;
      let endTotal = endH * 60 + endM;
      if (endTotal < startTotal) {
        if (now >= startTotal || now < endTotal) return shift;
      } else {
        if (now >= startTotal && now < endTotal) return shift;
      }
    }
    return null;
  }, [currentTime]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    setTimeout(() => {
      setInsights(isAdmin 
        ? `Sistem normal. 124 karyawan aktif hari ini. Kehadiran rata-rata 94%.`
        : `Halo ${user.name}, kehadiranmu bulan ini 98%. Pertahankan kedisiplinanmu!`);
    }, 1500);
    return () => clearInterval(timer);
  }, [isAdmin, user.name]);

  return (
    <div className="space-y-6 md:space-y-8 mt-16 lg:mt-0 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isAdmin ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {isAdmin ? 'Panel Admin' : 'Portal Karyawan'}
             </span>
             {!isAdmin && (
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                  <History size={10} /> Masa Kerja: {calculateTenure(user.joinDate)}
                </span>
             )}
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">
            {isAdmin ? 'Ringkasan Dashboard' : 'Halo, ' + user.name.split(' ')[0]}
          </h2>
        </div>
        
        <div className="bg-white border border-slate-200 px-6 py-4 rounded-[1.5rem] flex flex-col items-center justify-center shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">JAM SISTEM</p>
          <p className="text-3xl font-mono font-black text-indigo-600">
            {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            <div className="flex items-center gap-5 flex-1 z-10">
              <div className={`p-5 rounded-[1.5rem] ${activeShiftNow?.color || 'bg-slate-200'} text-white shadow-xl animate-pulse`}>
                <Activity size={32} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shift Berjalan</p>
                <h3 className="text-2xl font-black text-slate-900">{activeShiftNow?.name || 'Transition...'}</h3>
                <p className="text-slate-500 font-bold text-sm">Pukul: <span className="text-indigo-600">{activeShiftNow ? `${activeShiftNow.startTime} - ${activeShiftNow.endTime}` : '--:--'}</span></p>
              </div>
            </div>
            <div className="h-16 w-[1px] bg-slate-100 hidden md:block"></div>
            <div className="flex items-center gap-5 flex-1 z-10">
              <div className="p-4 rounded-[1.5rem] bg-indigo-600 text-white shadow-lg">
                <Users size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Database</p>
                <h3 className="text-xl font-black text-slate-800">{isAdmin ? '168 Karyawan' : user.division}</h3>
                <p className="text-slate-500 text-sm font-medium">{isAdmin ? 'Aktif Seluruh Unit' : user.position}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {isAdmin ? (
              <>
                <StatCard title="Hadir" value="124" subtitle="Hari Ini" icon={UserCheck} color="indigo" />
                <StatCard title="Telat" value="5" subtitle="Butuh Review" icon={Clock} color="amber" />
                <StatCard title="Izin" value="12" subtitle="Approval" icon={ClipboardList} color="rose" />
                <StatCard title="Total" value="168" subtitle="SDM" icon={Users} color="blue" />
              </>
            ) : (
              <>
                <StatCard title="Hadir" value="20" subtitle="Hari" icon={CalendarCheck} color="indigo" />
                <StatCard title="Telat" value="1" subtitle="15m" icon={Clock} color="amber" />
                <StatCard title="Izin" value="2" subtitle="Sisa: 10" icon={ClipboardList} color="blue" />
                <StatCard title="Gaji" value={latestSalary ? `Rp ${(latestSalary.netSalary / 1000000).toFixed(1)}jt` : '-'} subtitle="Sep" icon={Wallet} color="rose" />
              </>
            )}
          </div>

          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
            <h3 className="font-black text-slate-800 text-xl tracking-tight uppercase mb-8">Statistik Kehadiran</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={isAdmin ? MOCK_STATS_ADMIN : MOCK_STATS_USER}>
                  <defs>
                    <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 800}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 800}} />
                  <Tooltip contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey={isAdmin ? "hadir" : "jam"} stroke="#4f46e5" strokeWidth={4} fill="url(#colorMain)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-indigo-600 p-8 rounded-[3rem] text-white shadow-2xl shadow-indigo-100 flex flex-col justify-between group cursor-pointer hover:bg-indigo-700 transition-all h-fit">
              <div className="flex justify-between items-start mb-6">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">STATUS</p>
                    <h4 className="text-3xl font-black">Belum Absen</h4>
                 </div>
                 <div className="p-4 bg-white/20 rounded-2xl group-hover:scale-110 transition-transform">
                    <AlertCircle size={32} />
                 </div>
              </div>
              <button className="w-full bg-white text-indigo-700 font-black py-4 rounded-2xl shadow-xl transform active:scale-95 transition-all text-xs tracking-widest uppercase">
                 ABSEN SEKARANG
              </button>
          </div>

          <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-125 transition-transform duration-700">
              <Sparkles size={180} />
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white/10 p-2.5 rounded-xl">
                <Sparkles size={20} className="text-amber-400" />
              </div>
              <h3 className="font-black text-xl tracking-tight uppercase">AI Insights</h3>
            </div>
            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
              <p className="text-indigo-50 leading-relaxed font-bold italic text-sm">"{insights}"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; subtitle: string; icon: any; color: 'indigo' | 'amber' | 'blue' | 'rose' }> = ({ title, value, subtitle, icon: Icon, color }) => {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600',
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600',
    rose: 'bg-rose-50 text-rose-600',
  };
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
      <div className="flex items-start justify-between">
        <div className={`p-4 rounded-2xl ${colors[color]} group-hover:rotate-12 transition-transform`}>
          <Icon size={22} />
        </div>
        <span className="text-slate-400 text-[9px] font-black bg-slate-50 px-2 py-1 rounded-full uppercase tracking-widest">{subtitle}</span>
      </div>
      <div className="mt-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
        <h4 className="text-2xl font-black text-slate-900 mt-1 tracking-tighter">{value}</h4>
      </div>
    </div>
  );
};

export default Dashboard;
