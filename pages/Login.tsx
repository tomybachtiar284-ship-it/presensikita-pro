
import React, { useState } from 'react';
import { MOCK_USERS } from '../constants';
import { User } from '../types';
import { LogIn, Lock, Mail, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = MOCK_USERS.find(u => u.email === email);
    if (user && password === 'password123') { // Simple mock validation
      onLogin(user);
    } else {
      setError('Email atau password salah (Gunakan: password123)');
    }
  };

  const loginAs = (user: User) => {
    setEmail(user.email);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Decoration */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-500 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-700 rounded-full opacity-50 blur-3xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white tracking-tight">PresensiKita Pro</h1>
          <p className="text-indigo-100 mt-2 text-lg">Solusi Manajemen Kehadiran Berbasis AI & Geofencing.</p>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="flex gap-4 items-start">
            <div className="bg-white/10 p-3 rounded-2xl">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <div>
              <h4 className="font-bold text-white">Keamanan Terjamin</h4>
              <p className="text-indigo-100 text-sm">Validasi lokasi presisi dan proteksi data karyawan standar tinggi.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="bg-white/10 p-3 rounded-2xl">
              <LogIn className="text-white" size={24} />
            </div>
            <div>
              <h4 className="font-bold text-white">Real-time Dashboard</h4>
              <p className="text-indigo-100 text-sm">Pantau kehadiran secara langsung dari mana saja.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-indigo-200 text-xs">
          © 2024 PresensiKita Enterprise. All rights reserved.
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 md:bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Selamat Datang</h2>
            <p className="text-slate-500 mt-2">Silakan masuk untuk mengakses portal karyawan.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                  type="email"
                  placeholder="Email Perusahaan"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent border focus:bg-white focus:border-indigo-600 focus:ring-0 rounded-2xl transition-all"
                  required
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                  type="password"
                  placeholder="Kata Sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent border focus:bg-white focus:border-indigo-600 focus:ring-0 rounded-2xl transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-xl border border-red-100">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 transform active:scale-[0.98] transition-all"
            >
              Masuk Sekarang
            </button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-semibold tracking-wider">Akses Demo Cepat</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {MOCK_USERS.map(u => (
              <button
                key={u.id}
                onClick={() => loginAs(u)}
                className="flex flex-col items-center gap-2 p-3 border border-slate-100 rounded-2xl hover:bg-slate-50 hover:border-indigo-200 transition-all group"
              >
                <img src={u.avatar} alt={u.role} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" />
                <span className="text-[10px] font-bold text-slate-600 uppercase group-hover:text-indigo-600">{u.role}</span>
              </button>
            ))}
          </div>

          <p className="text-center text-slate-400 text-xs">
            Lupa kata sandi? <a href="#" className="text-indigo-600 font-bold hover:underline">Hubungi HR</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
