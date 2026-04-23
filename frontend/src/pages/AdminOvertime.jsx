import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Clock, 
  Check, 
  X, 
  Search, 
  Filter, 
  Calendar,
  User,
  Timer,
  CheckCircle,
  AlertCircle,
  Loader2,
  MessageSquare,
  Info
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { API_BASE_URL } from '../config';

const AdminOvertime = () => {
  const [overtimes, setOvertimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  // Rejection Modal State
  const [isRejecting, setIsRejecting] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // View Reason State
  const [viewReason, setViewReason] = useState(null);

  useEffect(() => {
    fetchOvertimes();
  }, []);

  const fetchOvertimes = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/overtime/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setOvertimes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status, adminNotes = null) => {
    setActionLoading(id);
    try {
      await axios.patch(`${API_BASE_URL}/api/overtime/${id}/status`, { status, adminNotes }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchOvertimes();
      setIsRejecting(false);
      setRejectionReason('');
      setSelectedRequestId(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Gagal memperbarui status');
    } finally {
      setActionLoading(null);
    }
  };

  const openRejectionModal = (id) => {
    setSelectedRequestId(id);
    setIsRejecting(true);
  };

  const filteredData = overtimes.filter(item => 
    item.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <header className="mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight font-serif">Persetujuan Lembur</h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-lg">Validasi dan setujui pengajuan waktu kerja tambahan karyawan.</p>
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

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {loading ? (
          <div className="bg-white border border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] p-12 sm:p-20 text-center">
            <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-400 font-medium">Memuat pengajuan...</p>
          </div>
        ) : filteredData.length > 0 ? filteredData.map((item) => (
          <div key={item.id} className="bg-white border border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-md transition-all group">
            <div className="flex flex-col md:flex-row">
              {/* User Info & Time */}
              <div className="md:w-80 bg-slate-50/50 p-6 sm:p-8 border-r border-slate-50 flex flex-col">
                <div className="flex items-center gap-4 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-900 font-black text-xs shadow-sm">
                    {item.user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-slate-900 font-bold text-sm leading-none">{item.user.name}</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">{item.user.division?.name || 'Karyawan'}</p>
                  </div>
                </div>
                
                <div className="flex flex-row md:flex-col items-center md:items-start gap-4 mt-auto">
                  <div className="flex items-center gap-2 sm:gap-3 text-slate-600">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                    <span className="text-[10px] sm:text-xs font-bold">{new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-slate-600">
                    <Timer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
                    <span className="text-[10px] sm:text-xs font-bold tabular-nums">{item.startTime} - {item.endTime}</span>
                  </div>
                </div>
              </div>

              {/* Content & Actions */}
              <div className="flex-1 p-6 sm:p-8 flex flex-col border-t md:border-t-0 md:border-l border-slate-50">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${
                    item.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                    item.status === 'REJECTED' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    {item.status}
                  </span>
                  
                  <button 
                    onClick={() => setViewReason(item)}
                    className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg sm:rounded-xl text-slate-600 hover:text-slate-900 transition-all text-[9px] sm:text-[10px] font-black uppercase tracking-wider active:scale-95"
                  >
                    <Info className="w-3.5 h-3.5 text-blue-500" />
                    Lihat Alasan
                  </button>
                </div>
                
                <div className="flex-1 flex flex-col justify-center">
                   <p className="text-slate-400 text-xs sm:text-sm italic font-medium">Klik tombol "Lihat Alasan" untuk detail pengajuan lembur.</p>
                </div>

                {item.status === 'PENDING' && (
                  <div className="flex items-center gap-2 sm:gap-3 mt-6 sm:mt-8">
                    <button 
                      onClick={() => handleStatusUpdate(item.id, 'APPROVED')}
                      disabled={actionLoading === item.id}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 sm:py-3.5 rounded-xl sm:rounded-2xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 text-xs sm:text-sm"
                    >
                      {actionLoading === item.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Check className="w-4 h-4 sm:w-5 sm:h-5" /> Setujui</>}
                    </button>
                    <button 
                      onClick={() => openRejectionModal(item.id)}
                      disabled={actionLoading === item.id}
                      className="flex-1 bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-100 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl transition-all font-bold flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 text-xs sm:text-sm"
                    >
                      {actionLoading === item.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <><X className="w-4 h-4 sm:w-5 sm:h-5" /> Tolak</>}
                    </button>
                  </div>
                )}
                
                {item.status !== 'PENDING' && (
                  <div className={`flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-6 sm:mt-8 ${
                    item.status === 'APPROVED' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {item.status === 'APPROVED' ? <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    Keputusan telah diambil
                  </div>
                )}
              </div>
            </div>
          </div>
        )) : (
          <div className="bg-white border border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] p-12 sm:p-20 text-center">
            <p className="text-slate-400 font-medium italic text-sm">Tidak ada pengajuan lembur yang perlu diproses.</p>
          </div>
        )}
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
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif mb-1 sm:mb-2">Detail Alasan Lembur</h3>
              <p className="text-slate-500 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">Berikut adalah rincian pekerjaan tambahan yang dilakukan.</p>
              
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-2">Pekerjaan / Alasan</label>
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

            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button 
                onClick={() => setViewReason(null)}
                className="w-full py-3 sm:py-4 bg-slate-950 text-white font-bold rounded-xl sm:rounded-2xl transition-all hover:bg-slate-800 shadow-lg shadow-slate-950/20 active:scale-95 text-sm sm:text-base"
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
              <p className="text-slate-500 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">Harap berikan alasan mengapa pengajuan lembur ini ditolak.</p>
              
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
                className="flex-1 py-3 sm:py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl sm:rounded-2xl transition-all hover:bg-slate-100 active:scale-95 text-xs sm:text-sm"
              >
                Batal
              </button>
              <button 
                onClick={() => handleStatusUpdate(selectedRequestId, 'REJECTED', rejectionReason)}
                disabled={!rejectionReason.trim()}
                className="flex-1 py-3 sm:py-4 bg-rose-600 text-white font-bold rounded-xl sm:rounded-2xl transition-all hover:bg-rose-700 shadow-lg shadow-rose-600/20 disabled:opacity-50 disabled:shadow-none active:scale-95 text-xs sm:text-sm"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminOvertime;
