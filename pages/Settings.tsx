
import React, { useState } from 'react';
import { 
  Clock, 
  Save, 
  MapPin, 
  Plus, 
  Navigation, 
  Trash2, 
  Settings as SettingsIcon,
  Crosshair
} from 'lucide-react';
import { SHIFT_DEFINITIONS, DEFAULT_SETTINGS } from '../constants';
import { ShiftType, ShiftDefinition } from '../types';

const Settings: React.FC = () => {
  const [shifts, setShifts] = useState<ShiftDefinition[]>(SHIFT_DEFINITIONS.filter(s => s.type !== ShiftType.LIBUR));
  const [geoSettings, setGeoSettings] = useState(DEFAULT_SETTINGS);

  const handleShiftChange = (index: number, field: keyof ShiftDefinition, value: string) => {
    const updated = [...shifts];
    updated[index] = { ...updated[index], [field]: value };
    setShifts(updated);
  };

  const handleAddShift = () => {
    const newShift: ShiftDefinition = {
      type: ShiftType.REGULER,
      name: 'Shift Baru',
      startTime: '08:00',
      endTime: '17:00',
      color: 'bg-slate-500'
    };
    setShifts([...shifts, newShift]);
  };

  const handleDeleteShift = (index: number) => {
    if (shifts.length <= 1) return;
    setShifts(shifts.filter((_, i) => i !== index));
  };

  const handleGeoChange = (field: keyof typeof geoSettings, value: number) => {
    setGeoSettings(prev => ({ ...prev, [field]: value }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setGeoSettings(prev => ({
          ...prev,
          officeLat: pos.coords.latitude,
          officeLng: pos.coords.longitude
        }));
      });
    } else {
      alert("Geolocation tidak didukung browser ini.");
    }
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Seluruh konfigurasi (Maps & Shift) berhasil disimpan!");
  };

  return (
    <div className="space-y-8 mt-16 lg:mt-0 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Konfigurasi Sistem</h2>
          <p className="text-slate-500 font-medium">Atur parameter lokasi presensi dan manajemen jam kerja perusahaan.</p>
        </div>
        <button 
          onClick={handleSaveAll}
          className="bg-indigo-600 text-white font-black px-8 py-4 rounded-2xl flex items-center gap-2 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
        >
          <Save size={20} />
          SIMPAN SEMUA PERUBAHAN
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* MAPS & GEOFENCING CONFIGURATION */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col transition-all hover:shadow-2xl">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl">
                <MapPin size={28} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Titik Lokasi Kantor</h3>
            </div>
            <button 
              onClick={getCurrentLocation}
              className="p-3 bg-slate-50 text-slate-500 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all group"
              title="Ambil Lokasi Saat Ini"
            >
              <Crosshair size={20} className="group-hover:rotate-90 transition-transform duration-500" />
            </button>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Latitude</label>
                <div className="relative">
                   <input 
                    type="number" 
                    step="any"
                    value={geoSettings.officeLat}
                    onChange={(e) => handleGeoChange('officeLat', parseFloat(e.target.value))}
                    className="w-full px-6 py-5 bg-slate-50 border-none rounded-[1.5rem] focus:ring-2 focus:ring-rose-200 outline-none font-bold text-slate-700"
                  />
                  <Navigation className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Longitude</label>
                <div className="relative">
                  <input 
                    type="number" 
                    step="any"
                    value={geoSettings.officeLng}
                    onChange={(e) => handleGeoChange('officeLng', parseFloat(e.target.value))}
                    className="w-full px-6 py-5 bg-slate-50 border-none rounded-[1.5rem] focus:ring-2 focus:ring-rose-200 outline-none font-bold text-slate-700"
                  />
                  <Navigation className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 rotate-90" size={18} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Radius Izin Presensi (Meter)</label>
              <input 
                type="range" 
                min="10" 
                max="2000" 
                step="10"
                value={geoSettings.radiusMeters}
                onChange={(e) => handleGeoChange('radiusMeters', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between items-center mt-2 px-1">
                <span className="text-sm font-black text-rose-600 bg-rose-50 px-4 py-1 rounded-full">{geoSettings.radiusMeters} Meter</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Aman Hingga 2KM</span>
              </div>
            </div>

            <div className="p-8 rounded-[2rem] bg-slate-900 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                <MapPin size={100} />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Preview Radius</p>
              <p className="text-sm leading-relaxed text-slate-300 italic">
                "Karyawan hanya dapat melakukan presensi jika berada dalam radius <span className="text-white font-black underline">{geoSettings.radiusMeters} meter</span> dari koordinat yang ditentukan di atas."
              </p>
            </div>
          </div>
        </div>

        {/* SHIFT TIME CONFIGURATION */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col transition-all hover:shadow-2xl">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-500 rounded-2xl">
                <Clock size={28} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Manajemen Jam Kerja</h3>
            </div>
            <button 
              onClick={handleAddShift}
              className="flex items-center gap-2 px-5 py-3 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-sm hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95"
            >
              <Plus size={18} />
              TAMBAH SHIFT
            </button>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {shifts.map((shift, idx) => (
              <div key={idx} className="group p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:border-indigo-100 hover:shadow-lg transition-all space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${shift.color} shadow-sm shadow-black/10`}></div>
                    <input 
                      type="text"
                      value={shift.name}
                      onChange={(e) => handleShiftChange(idx, 'name', e.target.value)}
                      className="bg-transparent border-none font-black text-slate-800 focus:ring-0 w-32 outline-none"
                    />
                  </div>
                  <button 
                    onClick={() => handleDeleteShift(idx)}
                    className="p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Jam Masuk</label>
                    <input 
                      type="time"
                      value={shift.startTime}
                      onChange={(e) => handleShiftChange(idx, 'startTime', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none font-black text-slate-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Jam Pulang</label>
                    <input 
                      type="time"
                      value={shift.endTime}
                      onChange={(e) => handleShiftChange(idx, 'endTime', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none font-black text-slate-700"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-indigo-50/50 rounded-[2rem] border border-indigo-100 flex gap-4">
            <div className="shrink-0 p-2 bg-indigo-100 text-indigo-600 rounded-xl h-fit">
              <SettingsIcon size={20} />
            </div>
            <p className="text-xs text-indigo-700 font-bold leading-relaxed">
              Anda kini dapat mengelola jam kerja fleksibel termasuk tipe <span className="underline">Reguler</span> dan <span className="underline">Daytime</span> dalam satu panel kontrol terpusat.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
