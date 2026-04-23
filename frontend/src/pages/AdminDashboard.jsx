import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  MapPin,
  Search, 
  Filter, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  UserX,
  UserCheck
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { API_BASE_URL, UPLOAD_URL } from '../config';

const AdminDashboard = () => {
  const [data, setData] = useState({ present: [], absent: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('present');

  useEffect(() => {
    fetchDailyStatus();
  }, []);

  const fetchDailyStatus = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/stats/daily-status`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPresent = data.present.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAbsent = data.absent.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <header className="mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight font-serif">Monitoring Absensi</h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-lg">Pantau kehadiran karyawan hari ini secara real-time.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="relative group flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Cari karyawan..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-900 pl-11 pr-5 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-sm outline-none focus:border-blue-500 transition-all sm:w-72 shadow-sm"
            />
          </div>
          <button className="p-3 sm:p-3.5 bg-white border border-slate-200 rounded-xl sm:rounded-2xl text-slate-400 hover:text-slate-900 transition-colors shadow-sm flex items-center justify-center">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mb-10 sm:mb-12">
        <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
            <Users className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600" />
          </div>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Total Karyawan</p>
          <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 font-serif">{data.present.length + data.absent.length}</h3>
        </div>
        <div className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
            <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-600" />
          </div>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Hadir Hari Ini</p>
          <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 font-serif">{data.present.length}</h3>
        </div>
        <div className="bg-slate-950 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl shadow-slate-950/20 relative overflow-hidden group sm:col-span-2 lg:col-span-1">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
          </div>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Belum Absen</p>
          <h3 className="text-3xl sm:text-4xl font-bold text-white mt-2 font-serif">{data.absent.length}</h3>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-sm">
        {/* Tabs */}
        <div className="flex border-b border-slate-50">
          <button 
            onClick={() => setActiveTab('present')}
            className={`flex-1 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 font-bold text-[10px] sm:text-sm transition-all ${
              activeTab === 'present' ? 'text-blue-600 bg-blue-50/30 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/50'
            }`}
          >
            <UserCheck className="w-4 h-4 sm:w-5 h-5" />
            <span>Hadir <span className="hidden sm:inline">Hari Ini</span> ({data.present.length})</span>
          </button>
          <button 
            onClick={() => setActiveTab('absent')}
            className={`flex-1 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 font-bold text-[10px] sm:text-sm transition-all ${
              activeTab === 'absent' ? 'text-rose-600 bg-rose-50/30 border-b-2 border-rose-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/50'
            }`}
          >
            <UserX className="w-4 h-4 sm:w-5 h-5" />
            <span>Belum Absen ({data.absent.length})</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px] sm:min-w-full">
            <thead>
              <tr className="bg-slate-50/30 text-slate-400 text-[11px] font-black uppercase tracking-[0.15em]">
                <th className="px-6 py-4">Karyawan</th>
                <th className="px-6 py-4">Divisi</th>
                <th className="px-6 py-4">{activeTab === 'present' ? 'Waktu Absen' : 'Status'}</th>
                {activeTab === 'present' && <th className="px-6 py-4">Lokasi</th>}
                {activeTab === 'present' && <th className="px-6 py-4 text-center">Verifikasi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400 font-medium">Memuat data...</p>
                  </td>
                </tr>
              ) : (activeTab === 'present' ? filteredPresent : filteredAbsent).length > 0 ? (activeTab === 'present' ? filteredPresent : filteredAbsent).map((row) => (
                <tr key={row.userId} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 font-black text-[10px] sm:text-xs border border-slate-200">
                        {row.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-slate-900 font-bold text-xs sm:text-sm leading-none mb-1 sm:mb-1.5">{row.name}</p>
                        <p className="text-[10px] sm:text-[11px] text-slate-400 font-bold tracking-wider">{row.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5">
                      <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-blue-50 border border-blue-100 rounded-lg sm:rounded-xl text-blue-600 font-bold text-[9px] sm:text-[10px] uppercase tracking-wider w-fit">
                        {row.division}
                      </div>
                      <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-slate-50 border border-slate-100 rounded-lg sm:rounded-xl text-slate-500 font-bold text-[8px] sm:text-[9px] uppercase tracking-widest w-fit">
                        {row.role === 'ADMIN' ? 'HR / Admin' : 'Staff / Karyawan'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {activeTab === 'present' ? (
                      <div>
                        <p className="text-slate-900 font-black text-xs sm:text-sm tabular-nums flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
                          {new Date(row.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 sm:mt-1 uppercase font-bold tracking-wider">Tepat Waktu</p>
                      </div>
                    ) : (
                      <div className={`flex items-center gap-2 font-bold text-[10px] sm:text-xs uppercase tracking-tight ${
                        row.status === 'Sakit' ? 'text-rose-500' : 
                        row.status === 'Izin' ? 'text-amber-500' : 
                        'text-slate-400'
                      }`}>
                        {row.status === 'Alpa' ? <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                        {row.status}
                      </div>
                    )}
                  </td>
                  {activeTab === 'present' && (
                    <td className="px-6 py-5">
                      <a 
                        href={`https://www.google.com/maps?q=${row.lat},${row.long}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-slate-50 border border-slate-100 rounded-lg sm:rounded-xl text-slate-600 hover:text-blue-600 hover:border-blue-100 transition-all font-mono text-[9px] sm:text-[10px] font-bold"
                      >
                        <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        Map View
                      </a>
                    </td>
                  )}
                  {activeTab === 'present' && (
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <div className="relative group/img overflow-hidden rounded-lg sm:rounded-xl h-10 w-10 sm:h-12 sm:w-12 border border-slate-100 bg-slate-50 shadow-sm">
                          <img 
                            src={`${UPLOAD_URL}/${row.photo}`} 
                            alt="Selfie" 
                            className="h-full w-full object-cover grayscale group-hover/img:grayscale-0 transition-all duration-500"
                          />
                          <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer">
                            <Eye className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>
                    </td>
                  )}
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-24 text-center text-slate-400 italic font-medium">
                    Tidak ada data ditemukan.
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

export default AdminDashboard;
