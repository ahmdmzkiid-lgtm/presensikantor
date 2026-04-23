import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, Loader2, CheckCircle, AlertCircle, FileText, Calendar, Plus, History } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { API_BASE_URL } from '../config';

const DailyReport = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchMyReports();
  }, []);

  const fetchMyReports = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/reports/my`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setReports(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await axios.post(`${API_BASE_URL}/api/reports`, { content }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStatus({ type: 'success', message: 'Laporan kerja hari ini berhasil dikirim!' });
      setContent('');
      fetchMyReports();
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Gagal mengirim laporan' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <header className="mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight font-serif">Laporan Kerja</h1>
        <p className="text-slate-500 mt-2 text-sm sm:text-lg leading-relaxed">Tuliskan ringkasan pekerjaan yang telah Anda selesaikan hari ini.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-sm sticky top-28">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 sm:mb-8 flex items-center gap-3 font-serif">
              <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              Buat Laporan
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-3 px-1">Isi Laporan Kerja</label>
                <textarea
                  required
                  rows="8"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Contoh: Menyelesaikan modul login, memperbaiki bug pada sidebar, dan meeting mingguan..."
                  className="w-full bg-slate-50 border border-slate-100 text-slate-900 p-5 rounded-2xl outline-none focus:border-blue-500/20 focus:bg-white transition-all resize-none font-medium text-sm leading-relaxed"
                ></textarea>
              </div>

              {status.message && (
                <div className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border flex items-center gap-3 sm:gap-4 animate-in fade-in slide-in-from-top-2 ${
                  status.type === 'success' 
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                    : 'bg-red-50 border-red-100 text-red-600'
                }`}>
                  {status.type === 'success' ? <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />}
                  <span className="text-xs sm:text-sm font-bold leading-tight">{status.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-950 hover:bg-slate-800 disabled:opacity-50 text-white font-bold py-4 sm:py-5 rounded-xl sm:rounded-[1.5rem] transition-all shadow-xl shadow-slate-950/20 flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg active:scale-95"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Send className="w-5 h-5" /> Kirim Laporan</>}
              </button>
            </form>
          </div>
        </div>

        {/* History Section */}
        <div className="lg:col-span-2">
          <div className="space-y-6 sm:space-y-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-3 font-serif mb-6 sm:mb-8">
              <History className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
              Laporan Terbaru
            </h2>

            {reports.length > 0 ? reports.map((report) => (
              <div key={report.id} className="bg-white border border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-blue-50 text-blue-600">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <p className="text-slate-900 font-bold text-sm sm:text-base">Laporan Harian</p>
                      <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] sm:text-xs text-slate-500 font-medium">
                          {new Date(report.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50/50 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-50">
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {report.content}
                  </p>
                </div>
              </div>
            )) : (
              <div className="bg-white border border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] p-12 sm:p-20 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-slate-200" />
                </div>
                <p className="text-slate-400 font-medium italic text-sm">Belum ada laporan yang dikirim.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DailyReport;
