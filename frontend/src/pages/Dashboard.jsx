import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Calendar,
  ArrowUpRight,
  User,
  Filter,
  MoreVertical
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { API_BASE_URL, UPLOAD_URL } from '../config';

const StatCard = ({ icon: Icon, label, value, color, isDark }) => (
  <div className={`
    p-6 sm:p-8 rounded-[2rem] sm:rounded-3xl transition-all duration-300 border
    ${isDark 
      ? 'bg-slate-950 border-slate-900 text-white shadow-xl shadow-slate-950/20' 
      : 'bg-white border-slate-100 text-slate-900 shadow-sm hover:shadow-md'}
  `}>
    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isDark ? 'text-white' : (color ? color.replace('text-', 'text-') : 'text-blue-600')}`} />
    </div>
    <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</p>
    <h3 className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 tracking-tight">{value}</h3>
  </div>
);

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const [userStats, setUserStats] = useState({
    remainingLeave: 0,
    todayAttendance: false,
    checkInTime: null
  });
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem('user') || '{}');
  } catch (e) {
    console.error('Error parsing user from localStorage', e);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyRes, statsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/attendance/history`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get(`${API_BASE_URL}/api/stats`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        ]);
        setHistory(historyRes.data);
        setUserStats(statsRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { icon: User, label: 'Total Kehadiran', value: '22 Hari', color: 'text-blue-600' },
    { icon: Clock, label: 'Tingkat Ketepatan', value: '98.2%', color: 'text-emerald-600' },
    { icon: Calendar, label: 'Sisa Cuti Tahunan', value: `${userStats.remainingLeave} Hari`, color: 'text-purple-600' },
    { icon: AlertTriangle, label: 'Lembur (Bulan Ini)', value: '14 Jam', color: 'text-white', isDark: true },
  ];

  return (
    <DashboardLayout>
      <header className="mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight font-serif">
            Riwayat Absensi
          </h1>
          <p className="text-slate-500 mt-2 sm:mt-4 max-w-xl text-sm sm:text-lg leading-relaxed">
            Pantau riwayat kehadiran Anda secara detail. Data ini digunakan untuk perhitungan produktivitas dan penggajian bulanan.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex-1 sm:flex-none px-4 sm:px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all text-xs sm:text-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex-1 sm:flex-none px-4 sm:px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all text-xs sm:text-sm">
            <ArrowUpRight className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mb-12 sm:mb-16">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="bg-white border border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="p-6 sm:p-8 border-b border-slate-50">
           <h2 className="text-xl font-bold text-slate-900 font-serif">Aktivitas Terbaru</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px] sm:min-w-full">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-[0.15em]">
                <th className="px-6 sm:px-10 py-4 sm:py-6">Tanggal</th>
                <th className="px-6 sm:px-10 py-4 sm:py-6">Verifikasi</th>
                <th className="px-6 sm:px-10 py-4 sm:py-6">Check In</th>
                <th className="px-6 sm:px-10 py-4 sm:py-6">Check Out</th>
                <th className="px-6 sm:px-10 py-4 sm:py-6">Status</th>
                <th className="px-6 sm:px-10 py-4 sm:py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {history.length > 0 ? history.slice(0, 5).map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 sm:px-10 py-6 sm:py-8">
                    <p className="text-slate-900 font-bold text-xs sm:text-sm">
                      {new Date(row.createdAt).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-slate-400 text-[10px] mt-1">Hari Kerja Reguler</p>
                  </td>
                  <td className="px-6 sm:px-10 py-6 sm:py-8">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-100 overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                       <img 
                          src={`${UPLOAD_URL}/${row.photoCheckIn}`} 
                          alt="Selfie" 
                          className="w-full h-full object-cover"
                        />
                    </div>
                  </td>
                  <td className="px-6 sm:px-10 py-6 sm:py-8">
                    <div className="flex items-center gap-2 text-slate-600 font-mono text-xs sm:text-sm font-bold">
                      <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 transform rotate-45" />
                      {row.checkIn ? new Date(row.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '-'}
                    </div>
                  </td>
                  <td className="px-6 sm:px-10 py-6 sm:py-8">
                    <div className="flex items-center gap-2 text-slate-600 font-mono text-xs sm:text-sm font-bold">
                      <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300 transform rotate-[135deg]" />
                      {row.checkOut ? new Date(row.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '-'}
                    </div>
                  </td>
                  <td className="px-6 sm:px-10 py-6 sm:py-8">
                    <span className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black tracking-widest border ${
                      row.status === 'PRESENT' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-red-50 text-red-600 border-red-100'
                    }`}>
                      {row.status === 'PRESENT' ? 'HADIR' : row.status}
                    </span>
                  </td>
                  <td className="px-6 sm:px-10 py-6 sm:py-8 text-right">
                    <button className="text-slate-300 hover:text-slate-600 transition-colors">
                      <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-10 py-20 text-center text-slate-400 italic font-medium">
                    Belum ada riwayat absensi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
