import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Clock, 
  Send, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Calendar,
  History,
  Timer
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { API_BASE_URL } from '../config';

const OvertimeForm = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [overtimes, setOvertimes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchOvertimes();
  }, []);

  const fetchOvertimes = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/overtime/my`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setOvertimes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.startTime || !formData.endTime || !formData.reason) {
      setStatus({ type: 'error', message: 'Semua field wajib diisi.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      await axios.post(`${API_BASE_URL}/api/overtime`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStatus({ type: 'success', message: 'Pengajuan lembur berhasil dikirim!' });
      setFormData({
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        reason: ''
      });
      fetchOvertimes();
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Gagal mengirim pengajuan' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight font-serif">Pengajuan Lembur</h1>
        <p className="text-slate-500 mt-2 text-lg">Ajukan waktu kerja tambahan Anda untuk mendapatkan persetujuan admin.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm sticky top-28">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3 font-serif">
              <Plus className="w-6 h-6 text-blue-600" />
              Form Lembur
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block px-1">Tanggal</label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 text-slate-900 pl-11 pr-5 py-3.5 rounded-2xl outline-none focus:border-blue-500/20 focus:bg-white transition-all font-medium text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block px-1">Mulai</label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-5 py-3.5 rounded-2xl outline-none focus:border-blue-500/20 focus:bg-white transition-all font-medium text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block px-1">Selesai</label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-5 py-3.5 rounded-2xl outline-none focus:border-blue-500/20 focus:bg-white transition-all font-medium text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block px-1">Alasan Lembur</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Deskripsikan pekerjaan tambahan yang dilakukan..."
                  rows="4"
                  className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-5 py-4 rounded-2xl outline-none focus:border-blue-500/20 focus:bg-white transition-all resize-none font-medium text-sm"
                ></textarea>
              </div>

              {status.message && (
                <div className={`p-5 rounded-3xl border flex items-center gap-4 animate-in fade-in slide-in-from-top-2 ${
                  status.type === 'success' 
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                    : 'bg-red-50 border-red-100 text-red-600'
                }`}>
                  {status.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                  <span className="text-xs font-bold leading-tight">{status.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-5 rounded-[1.5rem] transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 text-lg"
              >
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Send className="w-5 h-5" /> Ajukan Lembur</>}
              </button>
            </form>
          </div>
        </div>

        {/* History Section */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3 font-serif mb-8">
              <History className="w-6 h-6 text-slate-400" />
              Riwayat Pengajuan
            </h2>

            {overtimes.length > 0 ? overtimes.map((item) => (
              <div key={item.id} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl bg-slate-50 transition-colors ${
                      item.status === 'APPROVED' ? 'text-emerald-600' : 
                      item.status === 'REJECTED' ? 'text-red-600' : 'text-amber-600'
                    }`}>
                      <Timer className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-slate-900 font-bold">{new Date(item.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                          item.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 
                          item.status === 'REJECTED' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {item.status}
                        </span>
                        <span className="text-[10px] text-slate-300">•</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.startTime} - {item.endTime} ({item.duration} Jam)</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-50">
                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-medium italic">
                    "{item.reason}"
                  </p>
                  {item.status === 'REJECTED' && item.adminNotes && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl">
                      <p className="text-[10px] text-red-400 font-black uppercase tracking-widest mb-1">Alasan Penolakan:</p>
                      <p className="text-sm text-red-600 font-bold leading-relaxed">{item.adminNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            )) : (
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-slate-200" />
                </div>
                <p className="text-slate-400 font-medium italic">Belum ada pengajuan lembur.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OvertimeForm;
