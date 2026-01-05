
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
    ];

    if (isAdmin) {
        menuItems.push({ name: 'Karyawan', icon: 'users', path: 'employees.html' });
        menuItems.push({ name: 'Pelanggaran', icon: 'alert-triangle', path: 'violations.html' });
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
        <div class="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 border-r border-slate-200 bg-white flex-col z-30">
            <div class="flex flex-col h-full bg-white lg:bg-transparent">
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

        <!-- Mobile Header -->
        <div class="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 z-40">
            <h1 class="text-xl font-bold text-indigo-600">PresensiKita</h1>
            <button id="mobile-menu-btn" class="p-2 text-slate-600">
                <i data-lucide="menu" width="24" height="24"></i>
            </button>
        </div>

        <!-- Mobile Bottom Nav -->
        <div class="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-100 flex items-center justify-around px-2 z-40">
             ${menuItems.slice(0, 5).map(item => {
        const isActive = activePath.endsWith(item.path);
        const activeClass = isActive ? 'text-indigo-600' : 'text-slate-400';
        return `
                    <a href="${item.path}" class="flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${activeClass}">
                        <i data-lucide="${item.icon}" width="20" height="20"></i>
                        <span class="text-[10px] font-medium">${item.name}</span>
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
