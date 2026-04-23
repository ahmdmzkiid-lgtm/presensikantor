import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, FileText, User, Calendar, Loader2, MessageSquare, Info } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { API_BASE_URL, UPLOAD_URL } from '../config';

const AdminLeaveRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  // Rejection Modal State
  const [isRejecting, setIsRejecting] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // View Reason Modal State
  const [viewReason, setViewReason] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/leave/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status, adminNotes = null) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/leave/${id}/status`, { status, adminNotes }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchRequests();
      setIsRejecting(false);
      setRejectionReason('');
      setSelectedRequestId(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Gagal mengupdate status');
    }
  };

  const openRejectionModal = (id) => {
    setSelectedRequestId(id);
    setIsRejecting(true);
  };

  return (
    <DashboardLayout>
      <header className="mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight font-serif">Manajemen Izin & Cuti</h1>
        <p className="text-slate-500 mt-2 text-sm sm:text-lg leading-relaxed">Setujui atau tolak pengajuan izin dan cuti karyawan.</p>
      </header>

      <div className="bg-white border border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px] sm:min-w-full">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-6 sm:px-10 py-4 sm:py-6">Karyawan</th>
                <th className="px-6 sm:px-10 py-4 sm:py-6">Tipe & Tanggal</th>
                <th className="px-6 sm:px-10 py-4 sm:py-6">Alasan</th>
                <th className="px-6 sm:px-10 py-4 sm:py-6">Lampiran</th>
                <th className="px-6 sm:px-10 py-4 sm:py-6">Status</th>
                <th className="px-6 sm:px-10 py-4 sm:py-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {requests.length > 0 ? requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 sm:px-10 py-6 sm:py-8">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900 font-black text-[10px] sm:text-xs border border-slate-200">
                        {req.user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-slate-900 font-bold text-xs sm:text-sm leading-none mb-1 sm:mb-1.5">{req.user.name}</p>
                        <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold tracking-wider">{req.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 sm:px-10 py-6 sm:py-8">
                    <div className="text-xs sm:text-sm text-slate-900 font-bold">
                      {req.type === 'SICK' ? 'Sakit' : req.type === 'LEAVE' ? 'Cuti' : 'Izin'}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-wider tabular-nums">
                      {new Date(req.startDate).toLocaleDateString('id-ID')} - {new Date(req.endDate).toLocaleDateString('id-ID')}
                    </div>
                  </td>
                  <td className="px-6 sm:px-10 py-6 sm:py-8">
                    <button 
                      onClick={() => setViewReason(req)}
                      className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg sm:rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all text-[9px] sm:text-[10px] font-black uppercase tracking-wider active:scale-95"
                    >
                      <Info className="w-3.5 h-3.5 text-blue-500" />
                      Detail Alasan
                    </button>
                  </td>
                  <td className="px-6 sm:px-10 py-6 sm:py-8">
                    {req.attachment ? (
                      <button 
                        onClick={() => setPreviewUrl(`${UPLOAD_URL}/${req.attachment}`)}
                        className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg sm:rounded-xl text-blue-600 hover:bg-blue-50 hover:border-blue-100 transition-all text-[9px] sm:text-[10px] font-black uppercase tracking-wider active:scale-95"
                      >
                        <FileText className="w-3.5 h-3.5" /> Lampiran
                      </button>
                    ) : <span className="text-slate-300 text-xs font-black">-</span>}
                  </td>
                  <td className="px-6 sm:px-10 py-6 sm:py-8">
                    <span className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black tracking-[0.1em] border ${
                      req.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      req.status === 'REJECTED' ? 'bg-red-50 text-red-600 border-red-100' :
                      'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 sm:px-10 py-6 sm:py-8">
                    {req.status === 'PENDING' && (
                      <div className="flex justify-center gap-2 sm:gap-3">
                        <button 
                          onClick={() => handleUpdateStatus(req.id, 'APPROVED')}
                          className="p-2 sm:p-3 bg-white border border-slate-100 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg sm:rounded-xl transition-all shadow-sm active:scale-90"
                          title="Setujui"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openRejectionModal(req.id)}
                          className="p-2 sm:p-3 bg-white border border-slate-100 text-red-600 hover:bg-red-600 hover:text-white rounded-lg sm:rounded-xl transition-all shadow-sm active:scale-90"
                          title="Tolak"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-10 py-24 text-center text-slate-400 italic font-medium">
                    {loading ? 'Memuat data...' : 'Tidak ada pengajuan izin.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Reason Modal */}
      {viewReason && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
            onClick={() => setViewReason(null)}
          ></div>
          
          <div className="relative bg-white border border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-6 sm:p-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-50 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <Info className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif mb-1 sm:mb-2">Detail Alasan</h3>
              <p className="text-slate-500 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">Berikut adalah alasan lengkap yang diajukan oleh karyawan.</p>
              
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-2">Alasan Karyawan</label>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-xs sm:text-sm text-slate-700 font-medium italic leading-relaxed">
                    "{viewReason.reason}"
                  </div>
                </div>

                {viewReason.adminNotes && (
                  <div>
                    <label className="text-[10px] text-rose-400 font-black uppercase tracking-widest block mb-2">Catatan Admin / Penolakan</label>
                    <div className="bg-rose-50/50 border border-rose-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-xs sm:text-sm text-rose-600 font-bold leading-relaxed">
                      {viewReason.adminNotes}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100">
              <button 
                onClick={() => setViewReason(null)}
                className="w-full py-3 sm:py-4 bg-slate-950 text-white font-bold rounded-xl sm:rounded-2xl transition-all hover:bg-slate-800 shadow-lg shadow-slate-950/20 active:scale-95"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {isRejecting && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
            onClick={() => setIsRejecting(false)}
          ></div>
          
          <div className="relative bg-white border border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-6 sm:p-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-rose-50 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-rose-500" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif mb-1 sm:mb-2">Alasan Penolakan</h3>
              <p className="text-slate-500 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">Harap berikan alasan mengapa pengajuan izin ini ditolak.</p>
              
              <textarea 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl p-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-300 outline-none focus:border-rose-500 transition-all min-h-[100px] sm:min-h-[120px] resize-none"
                placeholder="Tulis alasan penolakan di sini..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                autoFocus
              ></textarea>
            </div>

            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex gap-2 sm:gap-3">
              <button 
                onClick={() => setIsRejecting(false)}
                className="flex-1 py-3 sm:py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl sm:rounded-2xl transition-all hover:bg-slate-100 active:scale-95"
              >
                Batal
              </button>
              <button 
                onClick={() => handleUpdateStatus(selectedRequestId, 'REJECTED', rejectionReason)}
                disabled={!rejectionReason.trim()}
                className="flex-1 py-3 sm:py-4 bg-rose-600 text-white font-bold rounded-xl sm:rounded-2xl transition-all hover:bg-rose-700 shadow-lg shadow-rose-600/20 disabled:opacity-50 disabled:shadow-none active:scale-95"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attachment Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
            onClick={() => setPreviewUrl(null)}
          ></div>
          
          <div className="relative bg-white border border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden max-w-2xl w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-4 sm:p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <h3 className="text-slate-900 font-bold font-serif text-sm sm:text-base">Pratinjau Lampiran</h3>
              <button 
                onClick={() => setPreviewUrl(null)}
                className="p-2 sm:p-3 bg-white border border-slate-100 text-slate-400 hover:text-slate-900 rounded-xl sm:rounded-2xl transition-all shadow-sm active:scale-90"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            
            <div className="p-4 sm:p-8 flex items-center justify-center bg-slate-50 min-h-[300px] sm:min-h-[400px]">
              <img 
                src={previewUrl} 
                alt="Attachment Preview" 
                className="max-w-full max-h-[50vh] sm:max-h-[60vh] rounded-xl sm:rounded-[1.5rem] shadow-xl border border-white"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400x300?text=Format+Tidak+Didukung+Pratinjau';
                }}
              />
            </div>

            <div className="p-4 sm:p-6 bg-white border-t border-slate-50 flex justify-end">
              <button 
                onClick={() => setPreviewUrl(null)}
                className="w-full sm:w-auto px-8 py-3 bg-slate-950 text-white font-bold rounded-xl sm:rounded-[1.25rem] transition-all hover:bg-slate-800 shadow-lg shadow-slate-950/20 active:scale-95 text-sm sm:text-base"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminLeaveRequests;
