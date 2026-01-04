
import React, { useState, useMemo } from 'react';
import { 
  Wallet, 
  Download, 
  Eye, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight, 
  Banknote, 
  Calendar,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  X,
  CreditCard,
  Send,
  Check
} from 'lucide-react';
import { User, UserRole, PayrollRecord } from '../types';
import { MOCK_USERS, MOCK_PAYROLLS } from '../constants';

interface PayrollProps {
  user: User;
}

const Payroll: React.FC<PayrollProps> = ({ user }) => {
  const isAdmin = user.role === UserRole.ADMIN;
  const [selectedMonth, setSelectedMonth] = useState("2024-10");
  const [viewingSlip, setViewingSlip] = useState<PayrollRecord | null>(null);
  const [processingUser, setProcessingUser] = useState<User | null>(null);
  
  // Local state for payrolls to simulate real-time updates
  const [localPayrolls, setLocalPayrolls] = useState<PayrollRecord[]>(MOCK_PAYROLLS);

  const displayData = useMemo(() => {
    if (isAdmin) {
      return MOCK_USERS.map(u => {
        const pay = localPayrolls.find(p => p.userId === u.id && p.month === selectedMonth);
        return { user: u, payroll: pay };
      });
    } else {
      return localPayrolls.filter(p => p.userId === user.id).sort((a, b) => b.month.localeCompare(a.month));
    }
  }, [isAdmin, user.id, selectedMonth, localPayrolls]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getMonthName = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(date);
  };

  const handleProcessPayment = (employee: User) => {
    setProcessingUser(employee);
  };

  const confirmPayment = () => {
    if(!processingUser) return;
    
    const newPayroll: PayrollRecord = {
      id: `pay_${Date.now()}`,
      userId: processingUser.id,
      month: selectedMonth,
      basicSalary: 5000000, // Mock fixed salary
      allowance: 1200000,
      deduction: 0,
      netSalary: 6200000,
      paymentDate: new Date().toISOString().split('T')[0],
      status: 'PAID'
    };
    
    setLocalPayrolls([newPayroll, ...localPayrolls]);
    setProcessingUser(null);
    alert(`Gaji untuk ${processingUser.name} telah berhasil ditransfer.`);
  };

  const PayrollSlipModal = ({ slip, onClose }: { slip: PayrollRecord, onClose: () => void }) => {
    const slipUser = MOCK_USERS.find(u => u.id === slip.userId) || user;
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
          <div className="bg-slate-900 p-10 text-white relative">
            <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={24} />
            </button>
            <div className="flex items-center gap-5 mb-8">
              <div className="bg-indigo-600 p-4 rounded-3xl shadow-xl shadow-indigo-500/20">
                <Banknote size={36} />
              </div>
              <div>
                <h3 className="text-3xl font-black tracking-tight">PAYSLIP DIGITAL</h3>
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">{getMonthName(slip.month)}</p>
              </div>
            </div>
            <div className="flex justify-between items-end border-t border-white/10 pt-8">
              <div>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Penerima</p>
                <h4 className="text-2xl font-black">{slipUser.name}</h4>
                <p className="text-sm font-medium text-slate-400">{slipUser.position} • {slipUser.nid}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Status Transaksi</p>
                <span className="bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">Sukses</span>
              </div>
            </div>
          </div>

          <div className="p-10 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-5">
                <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
                   <ArrowUpRight size={14} className="text-emerald-500" /> Penerimaan
                </h5>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-500">Gaji Pokok</span>
                    <span className="text-slate-800">{formatCurrency(slip.basicSalary)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-500">Tunjangan Jabatan</span>
                    <span className="text-slate-800">{formatCurrency(slip.allowance)}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-5">
                <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
                   <ArrowDownRight size={14} className="text-rose-500" /> Potongan
                </h5>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-500">Keterlambatan / PPH</span>
                    <span className="text-rose-600">({formatCurrency(slip.deduction)})</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Take Home Pay</p>
                <h3 className="text-4xl font-black text-indigo-700">{formatCurrency(slip.netSalary)}</h3>
              </div>
              <div className="text-center md:text-right">
                <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase mb-1">
                   <CreditCard size={14} /> Bank Transfer
                </div>
                <p className="text-xs font-bold text-slate-400 italic">Dibayarkan pada {slip.paymentDate}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest">
                <Download size={20} /> Unduh PDF
              </button>
              <button className="flex-1 py-5 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest">
                <Printer size={20} /> Cetak
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 mt-16 lg:mt-0 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Gaji & Benefit</h2>
          <p className="text-slate-500 font-medium">
            {isAdmin ? "Manajemen keuangan dan penggajian karyawan terpusat." : "Lihat histori pendapatan dan rincian slip gaji elektronik Anda."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-sm group">
             <Calendar size={20} className="text-indigo-600 group-hover:rotate-12 transition-transform" />
             <input 
              type="month" 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent border-none text-sm font-black text-slate-700 focus:ring-0 outline-none cursor-pointer uppercase tracking-tight"
             />
          </div>
          {isAdmin && (
             <button className="bg-indigo-600 text-white font-black px-8 py-4 rounded-2xl flex items-center gap-2 shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all transform active:scale-95 uppercase text-xs tracking-widest">
                <ArrowUpRight size={20} /> Post Massal
             </button>
          )}
        </div>
      </div>

      {isAdmin ? (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl group">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <ArrowUpRight size={24} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Pengeluaran</p>
                <h4 className="text-3xl font-black text-slate-900">{formatCurrency(152400000)}</h4>
                <div className="mt-4 flex items-center gap-2 text-emerald-600 font-black text-xs">
                   <CheckCircle2 size={14} /> Anggaran Tersedia
                </div>
             </div>
             <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl group">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <Clock size={24} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Pembayaran</p>
                <h4 className="text-3xl font-black text-amber-600">Pending</h4>
                <p className="mt-4 text-slate-400 font-bold text-xs uppercase">124 dari 168 Terbayar</p>
             </div>
             <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-slate-200 transition-all hover:scale-[1.02] group">
                <div className="flex items-center justify-between mb-8">
                   <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Auto-Payment</p>
                   <div className="w-10 h-5 bg-slate-700 rounded-full p-1 cursor-pointer">
                      <div className="w-3 h-3 bg-white/20 rounded-full"></div>
                   </div>
                </div>
                <h4 className="text-2xl font-black mb-1">System Standby</h4>
                <p className="text-xs text-slate-400 font-medium">Pembayaran otomatis dinonaktifkan untuk bulan ini.</p>
             </div>
          </div>

          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
            <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50">
               <div>
                  <h3 className="font-black text-slate-800 text-xl tracking-tight uppercase">Daftar Payroll Karyawan</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Periode: {getMonthName(selectedMonth)}</p>
               </div>
               <div className="relative w-full md:w-80 group">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                 <input className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-xs font-black focus:ring-4 focus:ring-indigo-100 outline-none transition-all" placeholder="CARI NAMA / NID..." />
               </div>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Karyawan</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Gaji</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                      <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Aksi Manajemen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(displayData as {user: User, payroll?: PayrollRecord}[]).map((item, idx) => (
                      <tr key={idx} className="hover:bg-indigo-50/30 transition-colors group">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-5">
                            <img src={item.user.avatar} className="w-12 h-12 rounded-2xl object-cover border-4 border-slate-50 shadow-sm" alt="" />
                            <div>
                              <p className="text-base font-black text-slate-800 leading-none mb-1.5">{item.user.name}</p>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.user.nid} • {item.user.position}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <span className="text-base font-black text-slate-700">{item.payroll ? formatCurrency(item.payroll.netSalary) : 'Belum Dihitung'}</span>
                        </td>
                        <td className="px-10 py-8">
                          {item.payroll ? (
                            <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">Sudah Dibayar</span>
                          ) : (
                            <span className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">Menunggu</span>
                          )}
                        </td>
                        <td className="px-10 py-8 text-right">
                          {item.payroll ? (
                            <button 
                              onClick={() => setViewingSlip(item.payroll!)} 
                              className="p-3 bg-white text-indigo-600 border border-indigo-100 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                            >
                              <Eye size={20} />
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleProcessPayment(item.user)}
                              className="text-xs font-black text-indigo-600 bg-indigo-50 px-5 py-3 rounded-xl hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-widest"
                            >
                              Review & Bayar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main List */}
          <div className="lg:col-span-8 space-y-8">
            {(displayData as PayrollRecord[]).map((pay) => (
              <div 
                key={pay.id} 
                onClick={() => setViewingSlip(pay)}
                className="group bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all cursor-pointer flex flex-col md:flex-row items-center justify-between gap-8 transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-6">
                   <div className="p-6 bg-indigo-50 text-indigo-600 rounded-[2rem] group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-lg shadow-indigo-100 group-hover:shadow-indigo-200">
                      <Wallet size={32} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Periode Penggajian</p>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight">{getMonthName(pay.month)}</h4>
                      <p className="text-xs font-black text-emerald-600 flex items-center gap-2 mt-1.5">
                        <CheckCircle2 size={16} />
                        Lunas Ditransfer • {pay.paymentDate}
                      </p>
                   </div>
                </div>
                
                <div className="text-center md:text-right flex flex-col md:items-end">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Net Income</p>
                   <h3 className="text-3xl font-black text-indigo-600 tracking-tight">{formatCurrency(pay.netSalary)}</h3>
                   <div className="mt-3 flex items-center gap-3">
                      <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-4 py-1.5 rounded-full uppercase tracking-widest border border-slate-100">Slip e-Sign</span>
                      <ChevronRight size={20} className="text-slate-300 group-hover:translate-x-2 transition-transform" />
                   </div>
                </div>
              </div>
            ))}

            {displayData.length === 0 && (
              <div className="bg-white p-24 rounded-[3.5rem] border border-slate-100 text-center shadow-sm">
                <div className="bg-slate-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-slate-300 transform -rotate-12">
                  <Banknote size={48} />
                </div>
                <h4 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Belum ada data gaji</h4>
                <p className="text-slate-400 font-bold mt-3 max-w-sm mx-auto uppercase tracking-widest text-[10px]">Data penggajian akan muncul otomatis setelah Admin HR melakukan otorisasi pembayaran.</p>
              </div>
            )}
          </div>

          {/* Side Info */}
          <div className="lg:col-span-4 space-y-10">
             <div className="bg-slate-900 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-indigo-100">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <Banknote size={140} />
                </div>
                <h3 className="text-xl font-black tracking-tight mb-8 uppercase text-indigo-400">Analitik Pendapatan</h3>
                <div className="space-y-8">
                   <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400 shadow-inner">
                        <ArrowUpRight size={28} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Average Salary</p>
                        <p className="text-lg font-black">{formatCurrency(5250000)}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-rose-400 shadow-inner">
                        <ArrowDownRight size={28} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Deductions</p>
                        <p className="text-lg font-black">{formatCurrency(50000)}</p>
                      </div>
                   </div>
                </div>
                <div className="mt-12 pt-8 border-t border-white/10">
                  <button className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-black/20 uppercase tracking-widest text-xs">
                    LAPORKAN KETIDAKSESUAIAN
                  </button>
                </div>
             </div>

             <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <Clock size={24} />
                  </div>
                  <h4 className="font-black text-slate-800 tracking-tight uppercase">Siklus Pembayaran</h4>
                </div>
                <div className="space-y-8 relative">
                  <div className="absolute left-[11px] top-0 bottom-0 w-[2px] bg-indigo-50"></div>
                  {[
                    { label: 'Tutup Absensi', date: '20 Okt', status: 'DONE' },
                    { label: 'Review Payroll', date: '22 Okt', status: 'IN_PROGRESS' },
                    { label: 'Transfer Dana', date: '25 Okt', status: 'WAITING' },
                  ].map((step, i) => (
                    <div key={i} className="flex gap-6 relative">
                       <div className={`w-6 h-6 rounded-full z-10 flex items-center justify-center shadow-sm border-2 border-white ${
                         step.status === 'DONE' ? 'bg-emerald-500' : 
                         step.status === 'IN_PROGRESS' ? 'bg-indigo-600 animate-pulse' : 'bg-slate-200'
                       }`}>
                         {step.status === 'DONE' && <Check size={12} className="text-white" />}
                       </div>
                       <div>
                         <p className="text-xs font-black text-slate-800 uppercase tracking-widest">{step.label}</p>
                         <p className="text-[10px] font-bold text-slate-400 mt-1">{step.date} 2024</p>
                       </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Admin */}
      {processingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-lg rounded-[3.5rem] p-12 shadow-2xl animate-in zoom-in duration-300 text-center">
              <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner shadow-indigo-100">
                 <CreditCard size={48} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-4">Proses Gaji</h3>
              <p className="text-slate-500 font-bold leading-relaxed mb-8">
                Anda akan mengirimkan gaji sebesar <span className="text-indigo-600 underline">Rp 6.200.000</span> kepada <span className="text-slate-800 font-black">{processingUser.name}</span> untuk periode <span className="text-slate-800 font-black">{getMonthName(selectedMonth)}</span>.
              </p>
              <div className="flex gap-4">
                 <button onClick={() => setProcessingUser(null)} className="flex-1 py-5 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs">Batalkan</button>
                 <button onClick={confirmPayment} className="flex-1 py-5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
                    <Send size={18} /> Konfirmasi
                 </button>
              </div>
           </div>
        </div>
      )}

      {viewingSlip && <PayrollSlipModal slip={viewingSlip} onClose={() => setViewingSlip(null)} />}
    </div>
  );
};

export default Payroll;
