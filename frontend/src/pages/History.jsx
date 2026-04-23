import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { History as HistoryIcon, Clock, MapPin, Calendar } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { API_BASE_URL, UPLOAD_URL } from '../config';

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/attendance/history`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setHistory(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistory();
  }, []);

  return (
    <DashboardLayout>
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight font-serif">Riwayat Absensi</h1>
        <p className="text-slate-500 mt-2 text-lg">Daftar lengkap kehadiran Anda selama bekerja.</p>
      </header>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-10 py-6">Tanggal</th>
                <th className="px-10 py-6">Waktu Masuk</th>
                <th className="px-10 py-6">Waktu Pulang</th>
                <th className="px-10 py-6">Status</th>
                <th className="px-10 py-6 text-center">Verifikasi Foto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {history.length > 0 ? history.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-slate-50 text-blue-600 border border-slate-100">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <span className="text-slate-900 font-bold text-sm">
                        {new Date(row.createdAt).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span className="text-slate-900 font-black text-sm tabular-nums">
                        {row.checkIn ? new Date(row.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="text-slate-900 font-black text-sm tabular-nums">
                        {row.checkOut ? new Date(row.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-[0.1em] border ${
                      row.status === 'PRESENT' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-red-50 text-red-600 border-red-100'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex justify-center -space-x-3">
                       {row.photoCheckIn && (
                         <div className="w-10 h-10 rounded-xl border-2 border-white overflow-hidden bg-slate-100 shadow-sm transition-all hover:scale-110 hover:z-10 cursor-pointer">
                           <img src={`${UPLOAD_URL}/${row.photoCheckIn}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300" alt="Check In" />
                         </div>
                       )}
                       {row.photoCheckOut && (
                         <div className="w-10 h-10 rounded-xl border-2 border-white overflow-hidden bg-slate-100 shadow-sm transition-all hover:scale-110 hover:z-10 cursor-pointer">
                           <img src={`${UPLOAD_URL}/${row.photoCheckOut}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300" alt="Check Out" />
                         </div>
                       )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-10 py-24 text-center text-slate-400 italic font-medium">
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

export default History;
