import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileText, 
  Search, 
  Filter, 
  Calendar,
  User,
  Paperclip,
  Download,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { API_BASE_URL, UPLOAD_URL } from '../config';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/reports/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setReports(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(report => 
    report.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <header className="mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight font-serif">Monitoring Laporan Kerja</h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-lg leading-relaxed">Pantau aktivitas harian seluruh karyawan perusahaan.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="relative group flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Cari karyawan atau isi laporan..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-900 pl-11 pr-5 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-sm outline-none focus:border-blue-500 transition-all sm:w-80 shadow-sm"
            />
          </div>
          <button className="p-3 sm:p-3.5 bg-white border border-slate-200 rounded-xl sm:rounded-2xl text-slate-400 hover:text-slate-900 transition-colors shadow-sm flex items-center justify-center">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="bg-white border border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] p-12 sm:p-20 text-center">
            <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-slate-200 animate-pulse mx-auto mb-4" />
            <p className="text-slate-400 font-medium">Memuat laporan...</p>
          </div>
        ) : filteredReports.length > 0 ? filteredReports.map((report) => (
          <div key={report.id} className="bg-white border border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-md transition-all group">
            <div className="flex flex-col md:flex-row">
              {/* User Info Sidebar */}
              <div className="md:w-72 bg-slate-50/50 p-6 sm:p-8 border-r border-slate-50 flex flex-col">
                <div className="flex items-center gap-4 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-900 font-black text-xs shadow-sm">
                    {report.user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-slate-900 font-bold text-sm leading-none">{report.user.name}</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">{report.user.division?.name || 'Karyawan'}</p>
                  </div>
                </div>
                
                <div className="flex flex-row md:flex-col items-center md:items-start gap-4 mt-auto">
                  <div className="flex items-center gap-2 sm:gap-3 text-slate-500">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="text-[10px] sm:text-xs font-bold">{new Date(report.date).toLocaleDateString('id-ID')}</span>
                  </div>
                  {report.attachment && (
                    <a 
                      href={`${UPLOAD_URL}/uploads/${report.attachment}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 sm:gap-3 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Paperclip className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Buka Lampiran</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 p-6 sm:p-8 border-t md:border-t-0 md:border-l border-slate-50">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Isi Laporan Harian
                  </div>
                  <button className="text-slate-300 hover:text-slate-600 transition-colors">
                    <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                <div className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {report.content}
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="bg-white border border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] p-12 sm:p-20 text-center">
            <p className="text-slate-400 font-medium italic">Tidak ada laporan ditemukan.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminReports;
