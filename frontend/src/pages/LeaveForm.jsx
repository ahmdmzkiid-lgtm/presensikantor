import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, FileText, Send, Loader2, CheckCircle, AlertCircle, FilePlus, Upload, Paperclip } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { API_BASE_URL } from '../config';

const LeaveForm = () => {
  const [formData, setFormData] = useState({
    type: 'PERMISSION',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [myRequests, setMyRequests] = useState([]);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/leave/my`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMyRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Get date range for current month restriction
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  // Format to YYYY-MM-DD for HTML input
  const formatDate = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const minDate = formatDate(firstDay);
  const maxDate = formatDate(lastDay);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    const data = new FormData();
    data.append('type', formData.type);
    data.append('startDate', formData.startDate);
    data.append('endDate', formData.endDate);
    data.append('reason', formData.reason);
    
    if (!attachment) {
      setLoading(false);
      setStatus({ type: 'error', message: 'Silakan unggah lampiran (bukti/surat) terlebih dahulu.' });
      return;
    }
    
    data.append('attachment', attachment);

    try {
      await axios.post(`${API_BASE_URL}/api/leave`, data, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      });
      setStatus({ type: 'success', message: 'Pengajuan izin berhasil dikirim!' });
      setFormData({ type: 'PERMISSION', startDate: '', endDate: '', reason: '' });
      setAttachment(null);
      fetchMyRequests();
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Gagal mengirim pengajuan' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <header className="mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight font-serif">Pengajuan Izin / Cuti</h1>
        <p className="text-slate-500 mt-2 text-sm sm:text-lg leading-relaxed">Gunakan form ini untuk mengajukan izin sakit, cuti, atau keperluan lainnya.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 sm:mb-8 flex items-center gap-3 font-serif">
              <FilePlus className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              Form Pengajuan
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-2">Tipe Izin</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl outline-none focus:border-blue-500/20 focus:bg-white transition-all font-medium text-sm"
                >
                  <option value="PERMISSION">Izin / Keperluan</option>
                  <option value="SICK">Sakit</option>
                  <option value="LEAVE">Cuti Tahunan</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-2">Mulai</label>
                  <input
                    type="date"
                    name="startDate"
                    required
                    min={minDate}
                    max={maxDate}
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl outline-none focus:border-blue-500/20 focus:bg-white transition-all text-xs sm:text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-2">Selesai</label>
                  <input
                    type="date"
                    name="endDate"
                    required
                    min={minDate}
                    max={maxDate}
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl outline-none focus:border-blue-500/20 focus:bg-white transition-all text-xs sm:text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-2">Alasan</label>
                <textarea
                  name="reason"
                  required
                  rows="3"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Jelaskan alasan pengajuan Anda..."
                  className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl outline-none focus:border-blue-500/20 focus:bg-white transition-all resize-none font-medium text-sm"
                ></textarea>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-2">Lampiran Bukti (Wajib)</label>
                <label className={`
                  relative flex flex-col items-center justify-center w-full h-32 sm:h-40 
                  border-2 border-dashed rounded-[1.25rem] sm:rounded-[1.5rem] cursor-pointer transition-all duration-300
                  ${attachment 
                    ? 'border-emerald-500/50 bg-emerald-50' 
                    : 'border-slate-200 hover:border-blue-500/50 bg-slate-50 hover:bg-slate-100/50'}
                `}>
                  <div className="flex flex-col items-center justify-center pt-4 pb-5 sm:pt-5 sm:pb-6 text-center px-4 sm:px-6">
                    {attachment ? (
                      <>
                        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white shadow-sm mb-2 sm:mb-3">
                          <Paperclip className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" />
                        </div>
                        <p className="text-xs sm:text-sm text-emerald-600 font-bold truncate max-w-full">{attachment.name}</p>
                        <p className="text-[9px] sm:text-[10px] text-emerald-500/60 mt-1 uppercase font-black tracking-widest">File Terpilih</p>
                      </>
                    ) : (
                      <>
                        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white shadow-sm mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                          <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400 transition-colors" />
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 font-bold">
                          Klik untuk unggah bukti
                        </p>
                        <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1.5 sm:mt-2 uppercase font-black tracking-widest leading-relaxed">PNG, JPG atau PDF<br/>Maksimal 5MB</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*,application/pdf"
                  />
                </label>
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
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 sm:py-5 rounded-xl sm:rounded-[1.5rem] transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg active:scale-95"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Send className="w-5 h-5" /> Kirim Pengajuan</>}
              </button>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="p-6 sm:p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">Status Pengajuan</h2>
              <div className="flex gap-1.5 sm:gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[500px] sm:min-w-full">
                <thead>
                  <tr className="bg-slate-50/30 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    <th className="px-6 sm:px-10 py-4 sm:py-6">Tipe</th>
                    <th className="px-6 sm:px-10 py-4 sm:py-6">Tanggal</th>
                    <th className="px-6 sm:px-10 py-4 sm:py-6">Alasan</th>
                    <th className="px-6 sm:px-10 py-4 sm:py-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {myRequests.length > 0 ? myRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 sm:px-10 py-6 sm:py-8">
                        <span className="text-slate-900 font-bold text-xs sm:text-sm">
                          {req.type === 'SICK' ? 'Sakit' : req.type === 'LEAVE' ? 'Cuti' : 'Izin'}
                        </span>
                      </td>
                      <td className="px-6 sm:px-10 py-6 sm:py-8">
                        <div className="text-[10px] sm:text-xs text-slate-500 font-medium">
                          {new Date(req.startDate).toLocaleDateString('id-ID')} - {new Date(req.endDate).toLocaleDateString('id-ID')}
                        </div>
                      </td>
                      <td className="px-6 sm:px-10 py-6 sm:py-8">
                        <p className="text-[10px] sm:text-xs text-slate-400 max-w-[150px] sm:max-w-xs truncate font-medium">{req.reason}</p>
                      </td>
                      <td className="px-6 sm:px-10 py-6 sm:py-8">
                        <span className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg text-[8px] sm:text-[10px] font-black tracking-[0.1em] border ${
                          req.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          req.status === 'REJECTED' ? 'bg-red-50 text-red-600 border-red-100' :
                          'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {req.status}
                        </span>
                        {req.status === 'REJECTED' && req.adminNotes && (
                          <div className="mt-2 text-[9px] sm:text-[10px] text-red-500 font-bold italic max-w-[120px] sm:max-w-[150px] leading-tight">
                            Ket: {req.adminNotes}
                          </div>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="px-10 py-24 text-center text-slate-400 italic font-medium text-sm">Belum ada pengajuan izin.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LeaveForm;
