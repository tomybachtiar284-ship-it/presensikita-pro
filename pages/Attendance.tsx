
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Camera, MapPin, CheckCircle2, AlertTriangle, RefreshCw, Clock, Sparkles } from 'lucide-react';
import { User, AttendanceStatus, AttendanceRecord, ShiftType } from '../types';
import { DEFAULT_SETTINGS, SHIFT_DEFINITIONS } from '../constants';

interface AttendanceProps {
  user: User;
}

const Attendance: React.FC<AttendanceProps> = ({ user }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [isInside, setIsInside] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mendapatkan shift user saat ini
  const userShift = useMemo(() => {
    // Sesuai logika Dashboard, kita cari shift yang dijadwalkan hari ini
    // Untuk demo presensi, kita asumsikan user masuk di shift PAGI atau REGULER sebagai default
    const type = user.shiftGroup.includes('Shift') ? ShiftType.PAGI : ShiftType.REGULER;
    return SHIFT_DEFINITIONS.find(s => s.type === type);
  }, [user]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; 
  };

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
      setError(null);
    } catch (err) {
      setError("Gagal mengakses kamera. Mohon berikan izin kamera pada browser Anda.");
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung oleh perangkat Anda.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(pos.coords);
        const dist = calculateDistance(pos.coords.latitude, pos.coords.longitude, DEFAULT_SETTINGS.officeLat, DEFAULT_SETTINGS.officeLng);
        setDistance(dist);
        setIsInside(dist <= DEFAULT_SETTINGS.radiusMeters);
      },
      (err) => {
        setError("Gagal mengambil koordinat. Pastikan GPS aktif dan izin lokasi diberikan.");
      }
    );
  };

  useEffect(() => {
    startCamera();
    getLocation();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      stopCamera();
      clearInterval(timer);
    };
  }, []);

  const handleAction = async (type: 'MASUK' | 'PULANG') => {
    if (!isInside) {
      setError(`Sistem mengunci tombol. Anda berada ${Math.round(distance || 0)}m dari titik pusat (Radius Max: ${DEFAULT_SETTINGS.radiusMeters}m).`);
      return;
    }

    setLoading(true);
    
    // Logika Deteksi Keterlambatan
    let status = 'HADIR';
    let lateMin = 0;
    if (type === 'MASUK' && userShift) {
      const [sh, sm] = userShift.startTime.split(':').map(Number);
      const shiftStartTime = new Date();
      shiftStartTime.setHours(sh, sm, 0);
      
      if (currentTime > shiftStartTime) {
        status = 'TERLAMBAT';
        lateMin = Math.floor((currentTime.getTime() - shiftStartTime.getTime()) / 60000);
      }
    }

    setTimeout(() => {
      setSuccess({
        type,
        time: currentTime.toLocaleTimeString('id-ID'),
        status,
        lateMin
      });
      setLoading(false);
      stopCamera();
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 mt-16 lg:mt-0 max-w-xl mx-auto">
        <div className="relative mb-12">
          <div className="bg-emerald-100 p-8 rounded-full text-emerald-600 animate-bounce shadow-xl shadow-emerald-50">
            <CheckCircle2 size={80} />
          </div>
          <div className="absolute -top-4 -right-4 bg-white p-3 rounded-2xl shadow-lg animate-pulse">
            <Sparkles size={24} className="text-amber-400" />
          </div>
        </div>
        
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl w-full text-center space-y-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Presensi {success.type} Berhasil!</h2>
            <p className="text-slate-400 font-bold mt-2">Data Anda telah aman tersimpan di server.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-6 rounded-[2rem]">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Waktu</p>
               <p className="text-xl font-black text-indigo-600">{success.time}</p>
            </div>
            <div className={`p-6 rounded-[2rem] ${success.status === 'TERLAMBAT' ? 'bg-rose-50' : 'bg-emerald-50'}`}>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
               <p className={`text-xl font-black ${success.status === 'TERLAMBAT' ? 'text-rose-600' : 'text-emerald-600'}`}>
                 {success.status}
               </p>
            </div>
          </div>

          {success.lateMin > 0 && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-700">
               <AlertTriangle size={20} />
               <p className="text-sm font-bold uppercase tracking-tight">Terlambat: {success.lateMin} Menit</p>
            </div>
          )}

          <button 
            onClick={() => { setSuccess(null); startCamera(); getLocation(); }}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all uppercase tracking-widest text-sm"
          >
            Selesai & Tutup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 mt-16 lg:mt-0 pb-12">
      <div className="text-center">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Presensi Real-time</h2>
        <div className="flex items-center justify-center gap-4 mt-2">
           <p className="text-slate-500 font-bold">Jadwal: <span className="text-indigo-600 uppercase">{userShift?.name || 'TIDAK ADA'}</span></p>
           <span className="text-slate-300">|</span>
           <p className="text-indigo-600 font-black font-mono">{currentTime.toLocaleTimeString('id-ID')}</p>
        </div>
      </div>

      <div className="relative group overflow-hidden rounded-[3rem] border-8 border-white shadow-2xl bg-slate-200 aspect-square md:aspect-video flex items-center justify-center transition-all hover:scale-[1.01]">
        {stream ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover scale-x-[-1]"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <RefreshCw className="animate-spin text-indigo-400" size={48} />
            <p className="font-black uppercase tracking-widest text-xs">Menunggu Akses Kamera...</p>
          </div>
        )}
        
        {/* Scanning Overlay */}
        <div className="absolute inset-0 pointer-events-none border-[30px] border-black/5"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-indigo-500 rounded-tl-3xl m-6"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-indigo-500 rounded-br-3xl m-6"></div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
           <div className="w-48 h-48 border-2 border-white/50 rounded-full animate-[ping_2s_infinite]"></div>
           <div className="absolute w-64 h-64 border border-indigo-400/30 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-[2rem] flex items-center gap-5 border shadow-sm transition-all ${isInside ? 'bg-emerald-50 border-emerald-100 shadow-emerald-50' : 'bg-rose-50 border-rose-100 shadow-rose-50'}`}>
          <div className={`p-4 rounded-2xl ${isInside ? 'bg-emerald-500' : 'bg-rose-500'} text-white shadow-lg`}>
            <MapPin size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pengecekan Lokasi</p>
            <p className={`text-lg font-black ${isInside ? 'text-emerald-700' : 'text-rose-700'}`}>
              {isInside ? 'Radius Aman' : 'Di Luar Radius'}
            </p>
            {distance !== null && (
              <p className="text-[10px] font-bold text-slate-500 uppercase">Jarak: {Math.round(distance)}m</p>
            )}
          </div>
        </div>

        <div className="p-6 rounded-[2rem] flex items-center gap-5 bg-indigo-50 border border-indigo-100 shadow-sm shadow-indigo-50">
          <div className="p-4 bg-indigo-500 rounded-2xl text-white shadow-lg">
            <Camera size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Validasi Selfie</p>
            <p className="text-lg font-black text-indigo-700">{stream ? 'Kamera Aktif' : 'Menunggu...'}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase">AI Face Tracking: ON</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-5 bg-amber-50 border border-amber-200 rounded-3xl flex gap-4 text-amber-800 text-sm font-bold shadow-sm animate-in fade-in duration-500">
          <AlertTriangle size={24} className="shrink-0 text-amber-500" />
          <p className="leading-relaxed">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 pb-20">
        <button
          disabled={loading || !isInside || !stream}
          onClick={() => handleAction('MASUK')}
          className={`py-6 rounded-3xl font-black transition-all flex items-center justify-center gap-3 text-lg tracking-tighter shadow-2xl transform active:scale-95 ${
            loading || !isInside || !stream 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed grayscale' 
              : 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700'
          }`}
        >
          {loading ? <RefreshCw className="animate-spin" size={24} /> : <CheckCircle2 size={24} />}
          ABSEN MASUK
        </button>
        <button
          disabled={loading || !isInside || !stream}
          onClick={() => handleAction('PULANG')}
          className={`py-6 rounded-3xl font-black border-4 transition-all flex items-center justify-center gap-3 text-lg tracking-tighter transform active:scale-95 ${
            loading || !isInside || !stream 
              ? 'border-slate-100 text-slate-300 cursor-not-allowed grayscale' 
              : 'border-indigo-600 text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          {loading ? <RefreshCw className="animate-spin" size={24} /> : <Clock size={24} />}
          ABSEN PULANG
        </button>
      </div>
    </div>
  );
};

export default Attendance;
