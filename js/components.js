
import { UserRole } from './data.js';

export const renderSidebar = (user, activePath) => {
    const isAdmin = user.role === UserRole.ADMIN;

    const menuItems = [
        { name: 'Dashboard', icon: 'layout-dashboard', path: 'dashboard.html' },
        { name: 'Presensi', icon: 'camera', path: 'attendance.html' },
        { name: 'Jadwal', icon: 'calendar', path: 'schedule.html' },
        { name: 'Gaji', icon: 'wallet', path: 'payroll.html' },
        { name: 'Riwayat', icon: 'history', path: 'history.html' },
        { name: 'Izin & Cuti', icon: 'calendar-days', path: 'leave.html' },
        { name: 'Pelanggaran', icon: 'alert-triangle', path: 'violations.html' },
        { name: 'Informasi SPPD', icon: 'file-text', path: 'sppd.html' },
        { name: 'Profil Saya', icon: 'user-circle', path: 'profile.html' },
    ];

    if (isAdmin) {
        menuItems.push({ name: 'Karyawan', icon: 'users', path: 'employees.html' });
        menuItems.push({ name: 'Pengaturan', icon: 'settings', path: 'settings.html' });
    }

    const navLinks = menuItems.map(item => {
        const isActive = activePath.endsWith(item.path);
        const activeClass = isActive
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
            : 'text-slate-600 hover:bg-slate-100';

        return `
            <a href="${item.path}" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeClass}">
                <i data-lucide="${item.icon}" width="20" height="20"></i>
                <span class="font-medium">${item.name}</span>
            </a>
        `;
    }).join('');

    const sidebarHTML = `
        <div class="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 border-r border-white/20 bg-white/80 backdrop-blur-md flex-col z-30">
            <div class="flex flex-col h-full bg-transparent">
                <div class="p-6">
                    <h1 class="text-2xl font-bold text-indigo-600 tracking-tight">PresensiKita</h1>
                    <p class="text-xs text-slate-400 mt-1 uppercase font-semibold">Enterprise Hub</p>
                </div>

                <nav class="flex-1 px-4 space-y-1">
                    ${navLinks}
                </nav>

                <div class="p-4 border-t border-slate-100">
                    <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 mb-4">
                        <img src="${user.avatar}" alt="${user.name}" class="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                        <div class="overflow-hidden">
                            <p class="text-sm font-semibold text-slate-900 truncate">${user.name}</p>
                            <p className="text-xs text-slate-500 truncate">${user.nid}</p>
                        </div>
                    </div>
                    <button id="logout-btn" class="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                        <i data-lucide="log-out" width="20" height="20"></i>
                        <span class="font-medium">Keluar</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile Header (Broadcast Style) -->
        <div class="lg:hidden fixed top-0 left-0 right-0 h-16 z-40 shadow-lg flex items-center justify-between px-6 overflow-hidden" 
             style="background: linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #3b82f6 100%); border-bottom: 2px solid white;">
            
            <!-- Red Accent Block (Skewed) -->
            <div class="absolute top-0 right-[-30px] h-full w-32 bg-[#DC143C] transform -skew-x-[20deg] border-l-4 border-white/30 shadow-lg"></div>
            
            <!-- Light Glare Effect -->
            <div class="absolute top-0 left-[-50%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform skew-x-[20deg]"></div>

            <div class="z-10 relative flex items-center gap-1">
                <div class="w-1 h-6 bg-[#DC143C]"></div>
                <h1 class="text-xl font-black text-white italic tracking-wider drop-shadow-md">
                    PRESENSI<span class="text-sky-300">KITA</span>
                </h1>
            </div>

            <button id="mobile-menu-btn" class="relative z-10 p-2 text-white hover:bg-white/10 rounded-full transition-colors">
                <i data-lucide="menu" width="24" height="24" class="drop-shadow-sm"></i>
            </button>
        </div>

        <!-- Mobile Bottom Nav (Broadcast Style) -->
        <div class="lg:hidden fixed bottom-4 left-4 right-4 h-18 rounded-2xl z-40 shadow-2xl flex items-center justify-around px-2 overflow-hidden border border-white/20"
             style="background: linear-gradient(180deg, #1e40af 0%, #0f172a 100%);">
            
            <!-- Red Accent Top Bar using Clip Path for Angles -->
            <div class="absolute top-0 left-4 right-4 h-1 bg-[#DC143C] shadow-[0_0_10px_rgba(220,20,60,0.8)]"></div>
            
             ${menuItems.slice(0, 5).map(item => {
        const isActive = activePath.endsWith(item.path);
        const activeClass = isActive ? 'text-white scale-110' : 'text-slate-400 hover:text-sky-200';
        // Active indicator uses a glossy backdrop
        const activeBg = isActive ? 'bg-gradient-to-b from-white/10 to-transparent shadow-inner border-t border-white/20' : '';

        return `
                    <a href="${item.path}" class="relative flex flex-col items-center justify-center w-full h-full gap-1 transition-all ${activeClass} ${activeBg} group">
                        ${isActive ? '<div class="absolute top-0 w-8 h-1 bg-sky-400 shadow-[0_0_8px_cyan] rounded-full"></div>' : ''}
                        <i data-lucide="${item.icon}" width="${isActive ? 22 : 20}" height="${isActive ? 22 : 20}" class="${isActive ? 'drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]' : ''}"></i>
                        <span class="text-[9px] font-bold tracking-widest uppercase ${isActive ? 'text-sky-300' : 'text-slate-400'}">${item.name}</span>
                    </a>
                 `;
    }).join('')}
        </div>
        
        <!-- Mobile Sidebar Overlay (Hidden by default) -->
        <div id="mobile-sidebar-overlay" class="hidden fixed inset-0 bg-black/50 z-50 lg:hidden">
             <div class="absolute right-0 top-0 bottom-0 w-64 bg-white animate-in slide-in-from-right duration-300">
                <div class="flex justify-end p-4">
                   <button id="close-mobile-sidebar" class="p-2 text-slate-600">
                     <i data-lucide="x" width="24" height="24"></i>
                   </button>
                </div>
                <div class="flex flex-col h-full">
                     <div class="p-6 pt-0">
                        <h1 class="text-2xl font-bold text-indigo-600 tracking-tight">PresensiKita</h1>
                     </div>
                     <nav class="flex-1 px-4 space-y-1">
                        ${navLinks}
                     </nav>
                </div>
             </div>
        </div>
    `;


    return sidebarHTML;
};

export const getDesktopHeader = (user, title = 'PANEL ADMIN') => {
    return `
        <!-- Desktop Header (Broadcast Style) -->
        <div class="hidden lg:flex fixed top-0 left-64 right-0 h-16 z-30 items-center justify-between px-8 shadow-lg" 
                style="background: linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #3b82f6 100%); border-bottom: 2px solid white;">
            
                <!-- Red Accent Block -->
            <div class="absolute top-0 right-[-30px] h-full w-40 bg-[#DC143C] transform -skew-x-[20deg] border-l-4 border-white/30 shadow-lg"></div>
            <div class="absolute top-0 left-[-20px] h-full w-4 bg-[#DC143C] transform skew-x-[20deg] border-r border-white/30 opacity-50"></div>

            <div class="relative z-10 flex items-center gap-3">
                    <div class="p-1.5 bg-white/10 rounded-lg border border-white/20 backdrop-blur-sm">
                    <i data-lucide="layout-dashboard" class="text-sky-300" width="20" height="20"></i>
                </div>
                <h1 class="text-xl font-black text-white italic tracking-wider drop-shadow-md uppercase">
                    ${title.replace(' ', '<span class="text-sky-300">')}</span>
                </h1>
            </div>

            <div class="relative z-10 flex items-center gap-4">
                    <div class="text-right hidden xl:block">
                    <p class="text-[10px] text-sky-200 font-bold uppercase tracking-widest">${user.role === 'admin' ? 'Administrator' : 'Karyawan'}</p>
                    <p class="text-sm text-white font-bold">${user.name}</p>
                </div>
                <div class="h-8 w-[2px] bg-white/20 mx-2 rotate-12"></div>
                    <button class="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors relative group">
                    <i data-lucide="bell" width="20" height="20"></i>
                    <span class="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-white/50"></span>
                </button>
            </div>
        </div>
        <!-- Spacer for fixed header -->
        <div class="hidden lg:block h-10"></div>
    `;
};

export const getDesktopFooter = () => {
    return `
        <!-- Desktop Footer (Broadcast Style) -->
        <div class="hidden lg:flex fixed bottom-0 left-64 right-0 h-10 z-30 items-center justify-between px-6 shadow-[0_-5px_15px_rgba(0,0,0,0.1)]" 
            style="background: linear-gradient(180deg, #1e40af 0%, #0f172a 100%); border-top: 1px solid white/20;">
            
            <!-- Red Accent Top Line -->
            <div class="absolute top-0 left-0 right-0 h-1 bg-[#DC143C]"></div>

            <div class="flex items-center gap-2 text-white/60">
                <span class="text-[10px] font-black uppercase tracking-widest">© 2024 PRESENSIKITA PRO</span>
                <span class="text-white/20">|</span>
                <span class="text-[10px] font-medium">Versi 2.4.0</span>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                        <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span class="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Sistem Online</span>
                </div>
            </div>
        </div>
        <!-- Footer Spacer -->
        <div class="hidden lg:block h-8"></div>
    `;
};
