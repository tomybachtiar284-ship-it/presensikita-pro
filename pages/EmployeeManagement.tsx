
import React, { useState } from 'react';
import { UserPlus, Search, MoreVertical, Mail, Building, Fingerprint, FileSpreadsheet, Calendar, History, Trash2, Edit2, X } from 'lucide-react';
import { User, ShiftGroup } from '../types';
import { MOCK_USERS } from '../constants';

interface EmployeeManagementProps {
  user: User;
}

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ user }) => {
  const [employees, setEmployees] = useState<User[]>(MOCK_USERS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<User | null>(null);

  const calculateTenure = (joinDateStr: string) => {
    const joinDate = new Date(joinDateStr);
    const now = new Date();
    let years = now.getFullYear() - joinDate.getFullYear();
    let months = now.getMonth() - joinDate.getMonth();
    if (months < 0 || (months === 0 && now.getDate() < joinDate.getDate())) {
      years--;
      months += 12;
    }
    return `${years} Tahun ${months} Bulan`;
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(dateStr));
  };

  const handleDeleteEmployee = (id: string) => {
    if(confirm("Apakah Anda yakin ingin menghapus karyawan ini dari sistem? Semua data historis akan diarsipkan.")) {
      setEmployees(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleSaveEmployee = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = editingEmployee?.id || Math.random().toString(36).substr(2, 9);
    
    const newEmp: User = {
      id,
      nid: formData.get('nid') as string,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: editingEmployee?.role || (formData.get('role') as any),
      avatar: editingEmployee?.avatar || `https://picsum.photos/seed/${id}/200`,
      division: formData.get('division') as string,
      position: formData.get('position') as string,
      workUnit: formData.get('workUnit') as string,
      shiftGroup: formData.get('shiftGroup') as any,
      joinDate: formData.get('joinDate') as string,
    };

    if(editingEmployee) {
      setEmployees(prev => prev.map(emp => emp.id === id ? newEmp : emp));
    } else {
      setEmployees([newEmp, ...employees]);
    }
    
    setShowAddModal(false);
    setEditingEmployee(null);
  };

  return (
    <div className="space-y-10 mt-16 lg:mt-0 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Database Karyawan</h2>
          <p className="text-slate-500 font-medium mt-1">Mengelola akses, divisi, dan status kepegawaian secara digital.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => alert("Impor file template sedang diproses...")}
            className="flex items-center gap-3 px-8 py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-50 transition-all uppercase text-xs tracking-widest shadow-sm"
          >
            <FileSpreadsheet size={20} className="text-emerald-600" />
            Impor Excel
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 shadow-2xl shadow-indigo-100 transition-all uppercase text-xs tracking-widest transform active:scale-95"
          >
            <UserPlus size={20} />
            Daftar Manual
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Shift A', count: 12, color: 'bg-indigo-500' },
          { label: 'Shift B', count: 10, color: 'bg-blue-500' },
          { label: 'Shift C', count: 8, color: 'bg-amber-500' },
          { label: 'Reguler', count: 45, color: 'bg-rose-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between shadow-sm transition-all hover:shadow-lg">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{stat.label}</span>
              <span className="text-2xl font-black text-slate-900">{stat.count} <span className="text-xs text-slate-400 font-bold uppercase">Orang</span></span>
            </div>
            <div className={`w-3 h-3 rounded-full ${stat.color} shadow-sm animate-pulse`}></div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={24} />
          <input 
            type="text" 
            placeholder="CARI NID, NAMA, ATAU DIVISI..."
            className="w-full pl-16 pr-6 py-5 bg-white border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-50 outline-none font-black text-xs uppercase tracking-widest transition-all"
          />
        </div>
        <select className="bg-white border border-slate-200 rounded-[1.5rem] px-8 py-5 text-xs font-black text-slate-600 uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-50 transition-all">
          <option>SEMUA SHIFT</option>
          {Object.values(ShiftGroup).map(sg => <option key={sg} value={sg}>{sg.toUpperCase()}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {employees.map((emp) => (
          <div key={emp.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 space-y-2 opacity-0 group-hover:opacity-100 transition-all">
               <button onClick={() => { setEditingEmployee(emp); setShowAddModal(true); }} className="p-3 bg-white text-indigo-600 border border-indigo-100 rounded-xl hover:bg-indigo-600 hover:text-white shadow-xl transition-all block">
                 <Edit2 size={16} />
               </button>
               <button onClick={() => handleDeleteEmployee(emp.id)} className="p-3 bg-white text-rose-600 border border-rose-100 rounded-xl hover:bg-rose-600 hover:text-white shadow-xl transition-all block">
                 <Trash2 size={16} />
               </button>
            </div>

            <div className="flex gap-6 items-start mb-8">
              <div className="relative">
                <img src={emp.avatar} alt={emp.name} className="w-20 h-20 rounded-[1.5rem] object-cover border-4 border-slate-50 shadow-xl" />
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white shadow-sm"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xl font-black text-slate-900 leading-tight truncate">{emp.name}</h4>
                <div className="flex items-center gap-2 mt-2 text-indigo-600 font-mono text-[10px] font-black uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full w-fit">
                  <Fingerprint size={12} />
                  <span>{emp.nid}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-[1.5rem]">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Jabatan</p>
                <p className="text-xs font-black text-slate-700 truncate">{emp.position}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-[1.5rem]">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Shift</p>
                <p className="text-xs font-black text-indigo-700 truncate uppercase">{emp.shiftGroup}</p>
              </div>
            </div>

            <div className="p-6 bg-indigo-50/30 rounded-[2rem] border border-indigo-100/30 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Calendar size={18} className="text-indigo-500" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Data Kepegawaian</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-widest">Tgl Masuk</span>
                  <span className="font-black text-slate-700">{formatDate(emp.joinDate)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-widest">Masa Kerja</span>
                  <span className="font-black text-indigo-700 bg-indigo-100 px-4 py-1.5 rounded-full">{calculateTenure(emp.joinDate)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-50">
              <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                <Building size={16} className="text-slate-300" />
                <span>UNIT: {emp.workUnit.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                <Mail size={16} className="text-slate-300" />
                <span className="truncate">{emp.email.toUpperCase()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit Employee */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="bg-slate-900 p-10 text-white flex justify-between items-center">
               <div className="flex items-center gap-5">
                  <div className="p-4 bg-indigo-600 rounded-3xl">
                     <UserPlus size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight">{editingEmployee ? 'Edit Profil' : 'Karyawan Baru'}</h3>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Lengkapi metadata kepegawaian</p>
                  </div>
               </div>
               <button onClick={() => { setShowAddModal(false); setEditingEmployee(null); }} className="p-2 text-slate-500 hover:text-white transition-colors">
                  <X size={28} />
               </button>
            </div>
            
            <form onSubmit={handleSaveEmployee} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nomor Induk (NID)</label>
                    <input name="nid" defaultValue={editingEmployee?.nid} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-black focus:ring-4 focus:ring-indigo-50 outline-none uppercase text-xs" placeholder="KRY-000" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                    <input name="name" defaultValue={editingEmployee?.name} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-black focus:ring-4 focus:ring-indigo-50 outline-none text-xs uppercase" placeholder="Input Nama" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alamat Email</label>
                    <input name="email" type="email" defaultValue={editingEmployee?.email} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-black focus:ring-4 focus:ring-indigo-50 outline-none text-xs" placeholder="email@perusahaan.com" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Jabatan / Posisi</label>
                    <input name="position" defaultValue={editingEmployee?.position} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-black focus:ring-4 focus:ring-indigo-50 outline-none text-xs uppercase" placeholder="Supervisor" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Grup Shift Utama</label>
                    <select name="shiftGroup" defaultValue={editingEmployee?.shiftGroup} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-black focus:ring-4 focus:ring-indigo-50 outline-none text-xs uppercase" required>
                      {Object.values(ShiftGroup).map(sg => <option key={sg} value={sg}>{sg}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Divisi / Departemen</label>
                    <input name="division" defaultValue={editingEmployee?.division} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-black focus:ring-4 focus:ring-indigo-50 outline-none text-xs uppercase" placeholder="Operational" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unit Kerja</label>
                    <input name="workUnit" defaultValue={editingEmployee?.workUnit} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-black focus:ring-4 focus:ring-indigo-50 outline-none text-xs uppercase" placeholder="Kantor Pusat" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tanggal Bergabung</label>
                    <input name="joinDate" type="date" defaultValue={editingEmployee?.joinDate} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-black focus:ring-4 focus:ring-indigo-50 outline-none text-xs" required />
                  </div>
               </div>

               <div className="flex gap-6 pt-6">
                  <button type="button" onClick={() => { setShowAddModal(false); setEditingEmployee(null); }} className="flex-1 py-5 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs">Batalkan</button>
                  <button type="submit" className="flex-1 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest text-xs">Simpan Data Karyawan</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
