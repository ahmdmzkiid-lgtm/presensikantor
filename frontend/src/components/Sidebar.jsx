import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Camera, 
  History, 
  Users, 
  User,
  LogOut, 
  MapPin,
  Clock,
  FileText,
  Settings,
  BarChart3,
  Calendar,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem('user') || '{}');
  } catch (e) {
    console.error('Error parsing user from localStorage', e);
  }
  const isSuperAdmin = user.role === 'SUPERADMIN';
  const isAdmin = user.role === 'ADMIN' || isSuperAdmin;

  const menuItems = [];

  // Employee Menus (Only for non-SuperAdmin)
  if (!isSuperAdmin) {
    menuItems.push(
      { icon: LayoutDashboard, label: 'Beranda', path: '/dashboard' },
      { icon: Camera, label: 'Presensi', path: '/attendance' },
      { icon: FileText, label: 'Izin & Sakit', path: '/leave' },
      { icon: FileText, label: 'Laporan Kerja', path: '/reports' },
      { icon: Clock, label: 'Lembur', path: '/overtime' },
      { icon: History, label: 'Riwayat', path: '/history' }
    );
  }

  // Admin/SuperAdmin Menus
  if (isAdmin) {
    menuItems.push({ icon: Users, label: 'Monitoring', path: '/admin' });
    menuItems.push({ icon: User, label: 'Data Karyawan', path: '/admin/users' });
    menuItems.push({ icon: BarChart3, label: 'Performa Kerja', path: '/admin/performance' });
    menuItems.push({ icon: FileText, label: 'Laporan Karyawan', path: '/admin/reports' });
    menuItems.push({ icon: Clock, label: 'Persetujuan Lembur', path: '/admin/overtime' });
    menuItems.push({ icon: FileText, label: 'Persetujuan Izin', path: '/admin/leave' });
    menuItems.push({ icon: Calendar, label: 'Agenda Kantor', path: '/agenda' });
    menuItems.push({ icon: Settings, label: 'Atur Kantor', path: '/admin/settings' });
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-300"
          onClick={onClose}
        ></div>
      )}

      <aside className={`
        fixed lg:sticky top-0 left-0 z-[70] h-screen w-72 bg-white border-r border-slate-100 flex flex-col shadow-sm overflow-hidden transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <button 
          onClick={onClose}
          className="lg:hidden absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-8 scrollbar-hide hover:scrollbar-default transition-all">
        <div className="mb-10 flex items-center gap-4">
          <img src="/webz.webp" alt="Logo" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight font-serif leading-none">Absensi</h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Corporate Suite</p>
          </div>
        </div>

        <nav className="space-y-1.5">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-blue-50 text-blue-600 font-bold' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="text-sm whitespace-nowrap">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Fixed Bottom Section */}
      <div className="p-6 bg-white border-t border-slate-50 space-y-4">
        {!isSuperAdmin && (
          <button 
            className="w-full bg-slate-950 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-950/20 active:scale-[0.98]"
            onClick={() => navigate('/attendance')}
          >
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Absen Sekarang</span>
          </button>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all group"
        >
          <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-bold">Keluar</span>
        </button>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
