
import React, { useState } from 'react';
import { CalendarCheck, Plus, Clock, CheckCircle2, XCircle, User, Check, X, FileText, Send, AlertCircle, Calendar } from 'lucide-react';
import { User as UserType, UserRole, RequestStatus } from '../types';

interface LeaveRequestsProps {
  user: UserType;
}

// Data Izin Ketentuan PP berdasarkan Gambar Aturan Perusahaan
const RULES_PP = [
  { id: 'a', label: 'Karyawan menikah', days: 3 },
  { id: 'b', label: 'Anak Karyawan menikah', days: 2 },
  { id: 'c', label: 'Istri sah melahirkan atau keguguran', days: 2 },
  { id: 'd', label: 'Suami/Istri/Anak/Menantu/Ortu/Mertua meninggal dunia', days: 2 },
  { id: 'e', label: 'Anak Karyawan dikhitan/dibaptis', days: 2 },
  { id: 'f', label: 'Anggota keluarga dalam satu rumah meninggal dunia', days: 1 },
  { id: 'g', label: 'Musibah/Bencana alam yang tidak mungkin dihindari', days: 2 },
];

const LeaveRequests: React.FC<LeaveRequestsProps> = ({ user }) => {
  const isAdmin = user.role === UserRole.ADMIN;
  const [activeTab, setActiveTab] = useState<'MY' | 'TEAM'>(isAdmin ? 'TEAM' : 'MY');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<any>(null);

  // Form states
  const [selectedType, setSelectedType] = useState('CUTI');
  const [selectedPPRule, setSelectedPPRule] = useState('');

  const [myRequests, setMyRequests] = useState([
    { id: '1', type: 'CUTI TAHUNAN', start: '2024-10-25', end: '2024-10-27', reason: 'Acara Keluarga', status: 'PENDING', createdAt: '2024-10-15' },
  ]);

  const [teamRequests, setTeamRequests] = useState([
    { id: '101', user: 'Siti Karyawan', type: 'CUTI TAHUNAN', start: '2024-10-28', end: '2024-10-30', reason: 'Kebutuhan Pribadi', status: 'PENDING', createdAt: '2024-10-18' },
    { id: '102', user: 'Budi Manager', type: 'SAKIT', start: '2024-10-22', end: '2024-10-23', reason: 'Pemulihan Kesehatan', status: 'APPROVED', createdAt: '2024-10-20' },
  ]);

  const handleApprove = (id: string) => {
    setTeamRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
  };

  const handleReject = (id: string) => {
    setTeamRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r));
  };

  const handleCreateRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const type = formData.get('type') as string;
    const ruleId = formData.get('ppRule') as string;
    
    let finalTypeLabel = type === 'CUTI' ? 'CUTI TAHUNAN' : type === 'LEMBUR' ? 'REQ LEMBUR' : type === 'SAKIT' ? 'SAKIT' : type === 'DINAS' ? 'DINAS LUAR' : 'IZIN PP';
    
    if(type === 'PP' && ruleId) {
      const rule = RULES_PP.find(r => r.id === ruleId);
      finalTypeLabel = `IZIN PP: ${rule?.label}`;
    }

    const newReq = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      type: finalTypeLabel.toUpperCase(),
      start: formData.get('start') as string,
      end: formData.get('end') as string,
      reason: formData.get('reason') as string,
      status: 'PENDING',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setMyRequests([newReq, ...myRequests]);
    setShowAddModal(false);
    setSelectedType('CUTI');
    setSelectedPPRule('');
  };

  const renderRequestCard = (req: any, isTeam: boolean) => (
    <div key={req.id} className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group">
      <div className="flex items-start justify-between mb-8">
        <div className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
          req.type.includes('CUTI') ? 'bg-indigo-100 text-indigo-700' :
          req.type.includes('SAKIT') ? 'bg-rose-100 text-rose-700' : 
          req.type.includes('PP') ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {req.type}
        </div>
        <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
          req.status === 'APPROVED' ? 'text-emerald-600' :
          req.status === 'REJECTED' ? 'text-rose-600' : 'text-amber-600'
        }`}>
          {req.status === 'PENDING' ? <Clock size={16} /> : 
           req.status === 'APPROVED' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          {req.status}
        </div>
      </div>

      <div className="space-y-6">
        {isTeam && (
          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
              <User size={18} className="text-indigo-500" />
            </div>
            <div>
               <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{req.user}</p>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Karyawan Aktif</p>
            </div>
          </div>
        )}
        <h4 className="text-xl font-bold text-slate-800 leading-tight">{req.reason}</h4>
        <div className="flex items-center gap-3 text-slate-500 text-xs font-black bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 w-fit uppercase">
          <CalendarCheck size={18} className="text-indigo-400" />
          <span>{req.start} <span className="text-slate-300 mx-1">—</span> {req.end}</span>
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between">
        <button onClick={() => setShowDetailModal(req)} className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">Data Pendukung</button>
        {isTeam && req.status === 'PENDING' && (
          <div className="flex gap-3">
            <button onClick={() => handleApprove(req.id)} className="p-4 bg-emerald-50 text-emerald-600 rounded-[1.3rem] hover:bg-emerald-600 hover:text-white transition-all shadow-sm"><Check size={20} /></button>
            <button onClick={() => handleReject(req.id)} className="p-4 bg-rose-50 text-rose-600 rounded-[1.3rem] hover:bg-rose-600 hover:text-white transition-all shadow-sm"><X size={20} /></button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 mt-16 lg:mt-0 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Layanan Izin & Cuti</h2>
          <p className="text-slate-500 font-medium mt-1">Sistem pengajuan otomatis berbasis Peraturan Perusahaan (PP).</p>
        </div>
        {!isAdmin && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black hover:bg-indigo-700 shadow-2xl shadow-indigo-100 transform active:scale-95 transition-all text-xs tracking-widest uppercase"
          >
            <Plus size={24} /> Pengajuan Baru
          </button>
        )}
      </div>

      <div className="flex border-b border-slate-200">
        <button onClick={() => setActiveTab('MY')} className={`px-12 py-6 text-[11px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'MY' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
          Pribadi
          {activeTab === 'MY' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full"></div>}
        </button>
        {isAdmin && (
          <button onClick={() => setActiveTab('TEAM')} className={`px-12 py-6 text-[11px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'TEAM' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
            Daftar Approval
            <span className="ml-3 bg-rose-500 text-white text-[9px] px-2.5 py-1 rounded-full shadow-sm">{teamRequests.filter(r => r.status === 'PENDING').length}</span>
            {activeTab === 'TEAM' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full"></div>}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {activeTab === 'MY' ? myRequests.map(req => renderRequestCard(req, false)) : teamRequests.map(req => renderRequestCard(req, true))}
      </div>

      {/* Modal Add Request */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[4rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
             <div className="bg-indigo-950 p-12 text-white flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <FileText size={160} />
                </div>
                <div className="flex items-center gap-6 z-10">
                   <div className="p-5 bg-indigo-600 rounded-[2rem] shadow-2xl">
                      <FileText size={32} />
                   </div>
                   <div>
                     <h3 className="text-3xl font-black uppercase tracking-tight">Formulir Digital</h3>
                     <p className="text-indigo-400 font-bold text-xs uppercase tracking-widest">Input Data Pengajuan Karyawan</p>
                   </div>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-4 text-white/30 hover:text-white transition-colors z-10"><X size={32} /></button>
             </div>
             <form onSubmit={handleCreateRequest} className="p-12 space-y-10 max-h-[65vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Pilih Kategori Izin</label>
                   <select 
                    name="type" 
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-8 py-5 bg-slate-50 border-none rounded-[2rem] font-black text-sm uppercase focus:ring-4 focus:ring-indigo-50 outline-none transition-all cursor-pointer" 
                    required
                   >
                      <option value="CUTI">CUTI TAHUNAN</option>
                      <option value="SAKIT">SAKIT</option>
                      <option value="LEMBUR">REQUEST LEMBUR</option>
                      <option value="DINAS">DINAS LUAR KANTOR</option>
                      <option value="PP">IZIN KETENTUAN PP (KHUSUS)</option>
                   </select>
                </div>

                {selectedType === 'PP' && (
                  <div className="space-y-5 p-10 bg-emerald-50 rounded-[3rem] border border-emerald-100 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-3 text-emerald-800">
                       <AlertCircle size={22} className="text-emerald-500" />
                       <h5 className="font-black text-xs uppercase tracking-widest">Detail Ketentuan PP (Poin a-g)</h5>
                    </div>
                    <select 
                      name="ppRule" 
                      value={selectedPPRule}
                      onChange={(e) => setSelectedPPRule(e.target.value)}
                      className="w-full px-8 py-5 bg-white border-2 border-emerald-100 rounded-[1.5rem] font-bold text-xs uppercase outline-none focus:border-emerald-500 transition-all shadow-sm" 
                      required
                    >
                       <option value="">-- PILIH BERDASARKAN GAMBAR PERATURAN --</option>
                       {RULES_PP.map(rule => (
                         <option key={rule.id} value={rule.id}>({rule.id}) {rule.label} — {rule.days} Hari</option>
                       ))}
                    </select>
                    {selectedPPRule && (
                      <div className="bg-emerald-600 text-white px-6 py-4 rounded-2xl flex items-center justify-between shadow-lg shadow-emerald-200">
                         <div className="flex items-center gap-3">
                            <Calendar size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Hak Durasi Izin PP:</span>
                         </div>
                         <span className="text-xl font-black">{RULES_PP.find(r => r.id === selectedPPRule)?.days} HARI KERJA</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Mulai Tanggal</label>
                     <input name="start" type="date" className="w-full px-8 py-5 bg-slate-50 border-none rounded-[2rem] font-black text-xs focus:ring-4 focus:ring-indigo-50 outline-none" required />
                   </div>
                   <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Sampai Tanggal</label>
                     <input name="end" type="date" className="w-full px-8 py-5 bg-slate-50 border-none rounded-[2rem] font-black text-xs focus:ring-4 focus:ring-indigo-50 outline-none" required />
                   </div>
                </div>

                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Deskripsi Lengkap Alasan</label>
                   <textarea name="reason" rows={4} className="w-full px-10 py-6 bg-slate-50 border-none rounded-[2.5rem] font-bold text-sm focus:ring-4 focus:ring-indigo-50 outline-none resize-none" placeholder="Tuliskan keterangan detail di sini..." required></textarea>
                </div>

                <div className="flex gap-6 pt-4">
                   <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-6 bg-slate-100 text-slate-500 font-black rounded-[2rem] hover:bg-slate-200 transition-all uppercase tracking-widest text-xs">Batalkan</button>
                   <button type="submit" className="flex-1 py-6 bg-indigo-600 text-white font-black rounded-[2rem] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest text-xs flex items-center justify-center gap-4">
                      <Send size={20} /> Kirim Berkas
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}

      {showDetailModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-xl rounded-[4rem] p-16 text-center shadow-2xl animate-in zoom-in duration-300">
              <div className="w-28 h-28 bg-indigo-50 text-indigo-600 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
                 <FileText size={56} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">Dokumen Izin</h3>
              <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.3em] mb-12">REF ID: {showDetailModal.id}</p>
              
              <div className="space-y-6 text-left mb-12">
                 <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Alasan / Penjelasan</p>
                    <p className="text-base font-bold text-slate-800 leading-relaxed italic">"{showDetailModal.reason}"</p>
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="bg-indigo-50 p-6 rounded-[2rem] text-center border border-indigo-100">
                       <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2">Tgl Mulai</p>
                       <p className="text-sm font-black text-indigo-700">{showDetailModal.start}</p>
                    </div>
                    <div className="bg-indigo-50 p-6 rounded-[2rem] text-center border border-indigo-100">
                       <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2">Tgl Akhir</p>
                       <p className="text-sm font-black text-indigo-700">{showDetailModal.end}</p>
                    </div>
                 </div>
              </div>

              <button onClick={() => setShowDetailModal(null)} className="w-full py-6 bg-slate-900 text-white font-black rounded-[2rem] hover:bg-slate-800 transition-all uppercase tracking-widest text-xs">Tutup Dokumen</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRequests;
