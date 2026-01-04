
import React, { useState } from 'react';
import { Calendar, Filter, Download, MapPin, Eye, Clock, Search } from 'lucide-react';
import { User, UserRole } from '../types';

interface HistoryProps {
  user: User;
}

const History: React.FC<HistoryProps> = ({ user }) => {
  const isAdmin = user.role === UserRole.ADMIN;
  const [filterDate, setFilterDate] = useState("");

  const mockHistory = [
    { id: 1, date: '20 Okt 2024', name: 'Siti Karyawan', in: '07:25', out: '15:35', status: 'PRESENT', loc: 'Kantor Pusat', shift: 'Pagi' },
    { id: 2, date: '19 Okt 2024', name: 'Siti Karyawan', in: '15:45', out: '23:30', status: 'LATE', loc: 'Kantor Pusat', shift: 'Sore' },
    { id: 3, date: '18 Okt 2024', name: 'Siti Karyawan', in: '07:15', out: '15:30', status: 'PRESENT', loc: 'Kantor Pusat', shift: 'Pagi' },
    { id: 4, date: '17 Okt 2024', name: 'Siti Karyawan', in: '-', out: '-', status: 'LEAVE', loc: '-', shift: '-' },
    { id: 5, date: '16 Okt 2024', name: 'Siti Karyawan', in: '23:30', out: '07:35', status: 'PRESENT', loc: 'Kantor Pusat', shift: 'Malam' },
  ];

  return (
    <div className="space-y-8 mt-16 lg:mt-0 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            {isAdmin ? 'Log Presensi Global' : 'Riwayat Presensi'}
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            {isAdmin ? 'Rekapitulasi data kehadiran seluruh karyawan secara real-time.' : 'Daftar aktivitas masuk dan pulang yang tercatat di sistem.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-sm group">
            <Calendar size={20} className="text-indigo-600" />
            <input 
              type="date" 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-transparent border-none text-xs font-black text-slate-700 focus:ring-0 outline-none uppercase"
            />
          </div>
          {isAdmin && (
            <button className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
              <Download size={20} />
              Ekspor Laporan
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
           <h3 className="font-black text-slate-800 tracking-tight text-xs uppercase">Rincian Aktivitas Presensi</h3>
           <div className="relative w-64">
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
             <input className="w-full pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase outline-none focus:ring-4 focus:ring-indigo-50 transition-all" placeholder="Cari data..." />
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Waktu & Shift</th>
                {isAdmin && <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Karyawan</th>}
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Jam Masuk</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Jam Pulang</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockHistory.map((item) => (
                <tr key={item.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <div className="p-4 bg-indigo-50 text-indigo-600 rounded-[1.3rem] group-hover:scale-110 transition-transform shadow-sm">
                        <Calendar size={22} />
                      </div>
                      <div>
                        <span className="text-base font-black text-slate-800 block leading-tight">{item.date}</span>
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">{item.shift}</span>
                      </div>
                    </div>
                  </td>
                  {isAdmin && (
                    <td className="px-10 py-8">
                      <span className="text-sm font-black text-slate-700">{item.name}</span>
                    </td>
                  )}
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-emerald-500" />
                      <span className="text-sm font-black text-slate-700">{item.in}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-rose-400" />
                      <span className="text-sm font-black text-slate-700">{item.out}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                      item.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-700' : 
                      item.status === 'LATE' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button className="p-3 text-slate-300 hover:text-indigo-600 transition-all hover:bg-white rounded-xl shadow-sm">
                      <Eye size={22} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
