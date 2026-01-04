
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  Star, 
  Search, 
  Users, 
  Clock, 
  Filter,
  ArrowRightLeft,
  LayoutGrid,
  List,
  CalendarDays,
  Save
} from 'lucide-react';
import { User, UserRole, ShiftGroup } from '../types';
import { MOCK_USERS } from '../constants';

// Data Hari Libur Nasional (Simulasi DB)
const HOLIDAYS_DB: Record<string, string> = {
  "2024-01-01": "Tahun Baru 2024",
  "2024-02-08": "Isra Mi'raj",
  "2024-02-09": "Cuti Bersama Imlek",
  "2024-02-10": "Tahun Baru Imlek",
  "2024-03-11": "Hari Suci Nyepi",
  "2024-03-29": "Wafat Yesus Kristus",
  "2024-03-31": "Hari Paskah",
  "2024-04-10": "Idul Fitri 1445 H",
  "2024-04-11": "Idul Fitri 1445 H",
  "2024-05-01": "Hari Buruh",
  "2024-05-09": "Kenaikan Yesus Kristus",
  "2024-05-23": "Hari Raya Waisak",
  "2024-06-01": "Hari Lahir Pancasila",
  "2024-06-17": "Idul Adha",
  "2024-08-17": "Hari Kemerdekaan RI",
  "2024-12-25": "Hari Raya Natal",
  "2025-01-01": "Tahun Baru 2025",
  "2026-01-01": "Tahun Baru 2026"
};

const SHIFT_TYPES = ['PAGI', 'MALAM', 'SORE', 'LIBUR'];
const GROUPS = ['A', 'B', 'C', 'D'];

interface ScheduleProps {
  user: User;
}

const Schedule: React.FC<ScheduleProps> = ({ user }) => {
  const isAdmin = user.role === UserRole.ADMIN;
  const [viewDate, setViewDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [adminTab, setAdminTab] = useState<'ROSTER' | 'EMPLOYEES'>('ROSTER');
  
  // State untuk menyimpan data roster yang bisa di-edit
  const [rosterMatrix, setRosterMatrix] = useState<Record<string, string>>({});

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentYear, currentMonth]);

  const monthLabel = useMemo(() => {
    return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(viewDate);
  }, [viewDate]);

  const daysArray = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [daysInMonth]);

  const firstDayOfMonth = useMemo(() => {
    return new Date(currentYear, currentMonth, 1).getDay();
  }, [currentYear, currentMonth]);

  const calendarDays = useMemo(() => {
    const emptySlots = Array(firstDayOfMonth).fill(null);
    return [...emptySlots, ...daysArray];
  }, [firstDayOfMonth, daysArray]);

  // Inisialisasi data roster saat bulan/tahun berubah
  useEffect(() => {
    const initialMatrix: Record<string, string> = {};
    const cycle = ['A', 'B', 'C', 'D'];
    
    SHIFT_TYPES.forEach((type, tIdx) => {
      daysArray.forEach(day => {
        const key = `${type}-${day}`;
        // Logika rotasi default (bisa diubah manual via dropdown)
        const offset = tIdx === 0 ? 0 : tIdx === 1 ? 1 : tIdx === 2 ? 2 : 3;
        initialMatrix[key] = cycle[(day + offset + currentMonth) % 4];
      });
    });
    setRosterMatrix(initialMatrix);
  }, [currentYear, currentMonth, daysInMonth]);

  const isDayHoliday = (day: number) => {
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dateObj = new Date(currentYear, currentMonth, day);
    const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6; // Minggu=0, Sabtu=6
    const holidayName = HOLIDAYS_DB[dateKey];
    return { isHoliday: !!holidayName || isWeekend, name: holidayName || (dateObj.getDay() === 0 ? "Minggu" : "Sabtu") };
  };

  const handleRosterChange = (type: string, day: number, value: string) => {
    setRosterMatrix(prev => ({
      ...prev,
      [`${type}-${day}`]: value
    }));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(parseInt(e.target.value));
    setViewDate(newDate);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = new Date(viewDate);
    newDate.setFullYear(parseInt(e.target.value));
    setViewDate(newDate);
  };

  const filteredEmployees = useMemo(() => {
    return MOCK_USERS.filter(emp => 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      emp.division.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const yearsRange = useMemo(() => {
    const startYear = 2020;
    const endYear = new Date().getFullYear() + 5;
    const years = [];
    for (let y = startYear; y <= endYear; y++) years.push(y);
    return years;
  }, []);

  // --- ADMIN VIEW ---
  if (isAdmin) {
    return (
      <div className="space-y-8 mt-16 lg:mt-0 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Manajemen Roster & Jadwal</h2>
            <p className="text-slate-500 font-medium mt-1">Konfigurasi rotasi shift grup dan penugasan karyawan.</p>
          </div>
          <div className="flex bg-white p-1.5 rounded-[1.5rem] border border-slate-100 shadow-sm">
             <button 
               onClick={() => setAdminTab('ROSTER')}
               className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${adminTab === 'ROSTER' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
             >
                <LayoutGrid size={16} /> Matriks Roster
             </button>
             <button 
               onClick={() => setAdminTab('EMPLOYEES')}
               className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${adminTab === 'EMPLOYEES' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
             >
                <List size={16} /> Daftar Karyawan
             </button>
          </div>
        </div>

        {adminTab === 'ROSTER' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             {/* THE EDITABLE MATRIX */}
             <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
                <div className="bg-amber-400 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                   <div className="flex items-center gap-4">
                      <div className="bg-white/20 p-3 rounded-2xl">
                        <CalendarDays className="text-slate-900" size={24} />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{monthLabel}</h3>
                   </div>
                   
                   <div className="flex flex-wrap items-center gap-3">
                      <div className="flex bg-white/30 p-1.5 rounded-2xl border border-white/20">
                         <select 
                           value={currentMonth} 
                           onChange={handleMonthChange}
                           className="bg-transparent border-none text-[10px] font-black text-slate-900 uppercase focus:ring-0 cursor-pointer"
                         >
                            {Array.from({length: 12}, (_, i) => (
                               <option key={i} value={i}>{new Intl.DateTimeFormat('id-ID', {month: 'long'}).format(new Date(2000, i))}</option>
                            ))}
                         </select>
                         <select 
                           value={currentYear} 
                           onChange={handleYearChange}
                           className="bg-transparent border-none text-[10px] font-black text-slate-900 uppercase focus:ring-0 cursor-pointer border-l border-white/20"
                         >
                            {yearsRange.map(y => (
                               <option key={y} value={y}>{y}</option>
                            ))}
                         </select>
                      </div>

                      <div className="flex gap-2">
                         <button 
                           onClick={() => setViewDate(new Date(currentYear, currentMonth - 1))}
                           className="p-3 bg-white/20 rounded-xl hover:bg-white/40 transition-all text-slate-900 shadow-sm"
                         >
                            <ChevronLeft size={20}/>
                         </button>
                         <button 
                           onClick={() => setViewDate(new Date(currentYear, currentMonth + 1))}
                           className="p-3 bg-white/20 rounded-xl hover:bg-white/40 transition-all text-slate-900 shadow-sm"
                         >
                            <ChevronRight size={20}/>
                         </button>
                      </div>
                      <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg">
                        <Save size={16} /> Simpan Roster
                      </button>
                   </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                   <table className="w-full text-center border-collapse">
                      <thead>
                         <tr className="bg-amber-400">
                            <th className="px-8 py-5 border-r border-amber-500/30 text-xs font-black text-slate-900 uppercase sticky left-0 z-10 bg-amber-400">Shift</th>
                            {daysArray.map(day => {
                               const { isHoliday } = isDayHoliday(day);
                               return (
                                 <th 
                                   key={day} 
                                   className={`px-4 py-5 border-r border-amber-500/30 text-[11px] font-black min-w-[55px] transition-colors
                                     ${isHoliday ? 'bg-rose-600 text-white' : 'text-slate-900'}
                                   `}
                                 >
                                    {day}
                                 </th>
                               )
                            })}
                         </tr>
                      </thead>
                      <tbody>
                         {SHIFT_TYPES.map((type) => (
                            <tr key={type} className="hover:bg-slate-50 transition-colors">
                               <td className="px-8 py-6 border-r border-slate-100 text-[11px] font-black text-slate-700 uppercase bg-white sticky left-0 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                                  {type}
                               </td>
                               {daysArray.map((day) => {
                                  const value = rosterMatrix[`${type}-${day}`] || '-';
                                  const { isHoliday } = isDayHoliday(day);
                                  return (
                                    <td 
                                      key={day} 
                                      className={`p-0 border-r border-slate-100 transition-all group
                                        ${isHoliday ? 'bg-rose-500 text-white' : 'text-slate-600'}
                                      `}
                                    >
                                       <select 
                                         value={value}
                                         onChange={(e) => handleRosterChange(type, day, e.target.value)}
                                         className={`w-full h-full bg-transparent border-none text-sm font-black text-center focus:ring-2 focus:ring-indigo-500/30 cursor-pointer appearance-none py-6
                                           ${isHoliday ? 'text-white' : value === 'A' ? 'text-indigo-600' : value === 'B' ? 'text-emerald-600' : value === 'C' ? 'text-amber-500' : 'text-rose-600'}
                                         `}
                                       >
                                          <option value="-">-</option>
                                          {GROUPS.map(g => (
                                            <option key={g} value={g} className="text-slate-900 font-bold">{g}</option>
                                          ))}
                                       </select>
                                    </td>
                                  )
                               })}
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {GROUPS.map(group => (
                  <div key={group} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all">
                     <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white shadow-lg transition-transform group-hover:rotate-12 ${group === 'A' ? 'bg-indigo-600' : group === 'B' ? 'bg-emerald-600' : group === 'C' ? 'bg-amber-500' : 'bg-rose-600'}`}>
                           {group}
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shift</p>
                           <p className="text-base font-black text-slate-800 tracking-tight">{group}</p>
                        </div>
                     </div>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">42 Staff</span>
                  </div>
                ))}
             </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex flex-col md:flex-row gap-6">
               <div className="flex-1 relative group">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={24} />
                 <input 
                   type="text" 
                   placeholder="CARI NAMA KARYAWAN ATAU DIVISI..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-16 pr-6 py-5 bg-white border border-slate-200 rounded-[2rem] focus:ring-4 focus:ring-indigo-50 outline-none font-black text-xs uppercase tracking-widest transition-all shadow-sm"
                 />
               </div>
               <div className="bg-white border border-slate-200 rounded-[2rem] px-8 py-5 flex items-center gap-4 shadow-sm">
                  <Filter size={20} className="text-slate-400" />
                  <select className="bg-transparent border-none text-xs font-black text-slate-600 uppercase tracking-widest outline-none cursor-pointer">
                     <option>Semua Unit Kerja</option>
                     <option>Kantor Pusat</option>
                  </select>
               </div>
             </div>

             <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-xl overflow-hidden">
                <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                         <Users size={24} />
                      </div>
                      <h3 className="font-black text-slate-800 tracking-tight text-sm uppercase">Penempatan Grup Shift</h3>
                   </div>
                   <button className="flex items-center gap-3 px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl">
                      <ArrowRightLeft size={16} /> Rotasi Grup
                   </button>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-slate-50">
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Karyawan</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Divisi</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Grup</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Aksi</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {filteredEmployees.map((emp) => (
                            <tr key={emp.id} className="hover:bg-indigo-50/30 transition-colors group">
                               <td className="px-10 py-8">
                                  <div className="flex items-center gap-5">
                                     <img src={emp.avatar} className="w-12 h-12 rounded-2xl object-cover border-4 border-white shadow-sm" alt="" />
                                     <div>
                                        <p className="text-base font-black text-slate-800 leading-none mb-1.5">{emp.name}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{emp.nid}</p>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-10 py-8">
                                  <span className="text-sm font-black text-slate-700 uppercase">{emp.division}</span>
                               </td>
                               <td className="px-10 py-8">
                                  <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
                                     emp.shiftGroup.includes('A') ? 'bg-indigo-100 text-indigo-700' :
                                     emp.shiftGroup.includes('B') ? 'bg-emerald-100 text-emerald-700' :
                                     emp.shiftGroup.includes('C') ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                                  }`}>
                                     {emp.shiftGroup}
                                  </span>
                               </td>
                               <td className="px-10 py-8 text-right">
                                  <button className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest">Ubah Grup</button>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        )}
      </div>
    );
  }

  // --- EMPLOYEE VIEW (NATIONAL CALENDAR) ---
  return (
    <div className="space-y-8 mt-16 lg:mt-0 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Kalender Nasional</h2>
          <p className="text-slate-500 font-medium mt-1">Informasi hari libur resmi dan agenda perusahaan.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth()-1))} className="p-4 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm">
            <ChevronLeft size={24} />
          </button>
          <div className="bg-white border border-slate-200 px-8 py-4 rounded-2xl shadow-sm">
            <span className="text-sm font-black text-slate-800 uppercase tracking-widest">{monthLabel}</span>
          </div>
          <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth()+1))} className="p-4 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="grid grid-cols-7 gap-4 mb-8">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d, i) => (
              <div key={d} className={`text-center text-[11px] font-black uppercase tracking-[0.2em] ${i === 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                {d}
              </div>
            ))}
            {calendarDays.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`}></div>;
              const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const holiday = HOLIDAYS_DB[dateKey];
              const isToday = new Date().toDateString() === new Date(currentYear, currentMonth, day).toDateString();
              const isSunday = i % 7 === 0;

              return (
                <div 
                  key={day} 
                  className={`relative aspect-square flex flex-col items-center justify-center rounded-[1.5rem] border-2 transition-all cursor-default group
                    ${holiday || isSunday ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-slate-50/30 border-slate-50 text-slate-700'}
                    ${isToday ? 'ring-4 ring-indigo-500/20 border-indigo-500' : ''}
                    hover:scale-110 hover:shadow-2xl hover:bg-white hover:z-20
                  `}
                >
                  <span className={`text-lg font-black ${isToday ? 'text-indigo-600' : ''}`}>{day}</span>
                  {holiday && <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>}
                  {holiday && (
                    <div className="absolute inset-0 bg-rose-600 text-white p-2 text-[8px] font-bold opacity-0 group-hover:opacity-100 rounded-[1.3rem] flex items-center justify-center text-center transition-all duration-300">
                      {holiday}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
             <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                <Info size={20} />
             </div>
             <p className="text-[11px] font-bold text-slate-500 uppercase leading-relaxed">
               Hari libur nasional bersifat mengikat. Karyawan yang bertugas pada hari libur akan dihitung sebagai lembur.
             </p>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                 <CalendarIcon size={120} />
              </div>
              <h3 className="text-xl font-black tracking-tight mb-8 uppercase flex items-center gap-3">
                 <Star className="text-amber-400" size={20} /> Hari Libur Bulan Ini
              </h3>
              <div className="space-y-6">
                 {Object.entries(HOLIDAYS_DB)
                   .filter(([key]) => key.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`))
                   .map(([date, name]) => (
                     <div key={date} className="flex gap-5 items-start bg-white/5 p-5 rounded-2xl border border-white/10">
                        <div className="bg-rose-500/20 text-rose-400 px-4 py-2 rounded-xl text-xs font-black">
                           {date.split('-')[2]}
                        </div>
                        <div>
                           <p className="text-sm font-black text-white">{name}</p>
                           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Libur Nasional</p>
                        </div>
                     </div>
                 ))}
                 {Object.entries(HOLIDAYS_DB).filter(([key]) => key.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`)).length === 0 && (
                   <p className="text-slate-500 font-bold italic text-sm text-center py-4 uppercase tracking-widest">Tidak ada hari libur resmi.</p>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
