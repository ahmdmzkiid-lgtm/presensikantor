import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  MapPin, 
  Trash2, 
  Edit2, 
  X, 
  Loader2,
  CalendarDays,
  ChevronRight,
  Info
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { API_BASE_URL } from '../config';

const AgendaPage = () => {
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = currentUser.role === 'ADMIN' || currentUser.role === 'SUPERADMIN';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: ''
  });

  useEffect(() => {
    fetchAgendas();
  }, []);

  const fetchAgendas = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/agendas`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAgendas(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.patch(`${API_BASE_URL}/api/agendas/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        await axios.post(`${API_BASE_URL}/api/agendas`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ title: '', description: '', date: '', startTime: '', endTime: '', location: '' });
      fetchAgendas();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (agenda) => {
    setEditingId(agenda.id);
    setFormData({
      title: agenda.title,
      description: agenda.description || '',
      date: new Date(agenda.date).toISOString().split('T')[0],
      startTime: agenda.startTime || '',
      endTime: agenda.endTime || '',
      location: agenda.location || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus agenda ini?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/agendas/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchAgendas();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <DashboardLayout>
      <header className="mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight font-serif">Agenda Kantor</h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-lg">Daftar kegiatan dan pengumuman resmi perusahaan.</p>
        </div>
        
        {isAdmin && (
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Tambah Agenda</span>
          </button>
        )}
      </header>

      {loading ? (
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-20 text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-400 font-medium">Memuat agenda...</p>
        </div>
      ) : agendas.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-16 text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CalendarIcon className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Belum Ada Agenda</h3>
          <p className="text-slate-400 max-w-sm mx-auto">Saat ini belum ada agenda atau kegiatan mendatang yang dijadwalkan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {agendas.map((agenda) => (
            <div key={agenda.id} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform group-hover:opacity-[0.07]">
                <CalendarDays className="w-24 h-24 text-blue-600" />
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-black text-xs uppercase tracking-wider">
                  {new Date(agenda.date).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                </div>
                <div className="h-1 w-1 bg-slate-200 rounded-full"></div>
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  <Clock className="w-3.5 h-3.5" />
                  {agenda.startTime || '--:--'}
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-1">{agenda.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">{agenda.description || 'Tidak ada deskripsi.'}</p>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs font-bold">{agenda.location || 'Lokasi Belum Diatur'}</span>
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEdit(agenda)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(agenda.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Agenda */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white border border-slate-100 rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="p-8 sm:p-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 font-serif">{editingId ? 'Edit Agenda' : 'Tambah Agenda Baru'}</h3>
                  <p className="text-slate-400 text-sm mt-1">Lengkapi informasi kegiatan di bawah ini.</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-3 text-slate-400 hover:text-slate-900 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Judul Agenda</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Contoh: Meeting Bulanan"
                    className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-6 py-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tanggal</label>
                    <input 
                      type="date" 
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-6 py-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Waktu Mulai</label>
                    <input 
                      type="time" 
                      value={formData.startTime}
                      onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-6 py-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lokasi</label>
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Contoh: Ruang Meeting A / Online via Zoom"
                    className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-6 py-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deskripsi</label>
                  <textarea 
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Tuliskan detail agenda..."
                    className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-6 py-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-slate-950 text-white font-bold rounded-2xl shadow-xl shadow-slate-950/20 hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  {editingId ? 'Simpan Perubahan' : 'Publish Agenda'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AgendaPage;
