import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  UserPlus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Mail, 
  Shield, 
  Briefcase,
  Clock,
  Loader2,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { API_BASE_URL } from '../config';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [divisions, setDivisions] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'EMPLOYEE',
    divisionId: '',
    workScheduleId: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchMetadata();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [divRes, schedRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/office/divisions`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get(`${API_BASE_URL}/api/office/schedules`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);
      setDivisions(divRes.data);
      setSchedules(schedRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Leave empty for security
      role: user.role,
      divisionId: user.divisionId || '',
      workScheduleId: user.workScheduleId || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      if (editingUserId) {
        // Update
        await axios.patch(`${API_BASE_URL}/api/users/${editingUserId}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        // Create
        await axios.post(`${API_BASE_URL}/api/auth/register`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      
      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Gagal menyimpan data karyawan');
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setEditingUserId(null);
    setFormData({
      name: '', email: '', password: '', role: 'EMPLOYEE', divisionId: '', workScheduleId: ''
    });
    setFormError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus karyawan ini?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchUsers();
    } catch (err) {
      alert('Gagal menghapus user');
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <header className="mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight font-serif">Kelola Karyawan</h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-lg">Daftarkan dan atur data seluruh karyawan perusahaan.</p>
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
          <button 
            onClick={() => { resetForm(); setShowModal(true); }}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3.5 bg-blue-600 text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Karyawan</span>
          </button>
        </div>
      </header>

      <div className="bg-white border border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px] sm:min-w-full">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[11px] font-black uppercase tracking-[0.15em]">
                <th className="px-6 py-4">Profil Karyawan</th>
                <th className="px-6 py-4">Divisi</th>
                <th className="px-6 py-4">Jadwal Kerja</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Memuat data karyawan...</p>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 font-black text-[10px] sm:text-xs border border-slate-200">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-slate-900 font-bold text-xs sm:text-sm leading-none mb-1 sm:mb-1.5">{user.name}</p>
                        <p className="text-[10px] sm:text-[11px] text-slate-400 font-bold tracking-wider flex items-center gap-1.5">
                          <Mail className="w-3 h-3" />
                          <span className="truncate max-w-[120px] sm:max-w-none">{user.email}</span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-slate-50 border border-slate-100 rounded-lg sm:rounded-xl text-slate-600 font-bold text-[9px] sm:text-[10px] uppercase tracking-wider">
                      <Briefcase className="w-3.5 h-3.5" />
                      {user.division?.name || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-blue-50/50 border border-blue-50 rounded-lg sm:rounded-xl text-blue-600 font-bold text-[9px] sm:text-[10px] uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5" />
                      {user.workSchedule?.name || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className={`inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl font-bold text-[9px] sm:text-[10px] uppercase tracking-wider ${
                      user.role === 'ADMIN' || user.role === 'SUPERADMIN' 
                        ? 'bg-amber-50 text-amber-600 border border-amber-100' 
                        : 'bg-slate-50 text-slate-400 border border-slate-100'
                    }`}>
                      <Shield className="w-3.5 h-3.5" />
                      {user.role}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => handleEdit(user)}
                        className="p-2 sm:p-2.5 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg sm:rounded-xl transition-all"
                      >
                        <Edit2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="p-2 sm:p-2.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg sm:rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-slate-400 italic font-medium">
                    Tidak ada karyawan ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowModal(false)}></div>
          <div className="bg-white w-full max-w-xl rounded-[2rem] sm:rounded-[3rem] shadow-2xl relative z-10 animate-in zoom-in slide-in-from-bottom-10 duration-500 overflow-hidden my-auto">
            <div className="p-6 sm:p-10 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">{editingUserId ? 'Edit Karyawan' : 'Tambah Karyawan'}</h2>
                <p className="text-slate-400 text-xs sm:text-sm mt-0.5 sm:mt-1">{editingUserId ? 'Perbarui informasi divisi & jadwal.' : 'Lengkapi data akun karyawan.'}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 sm:p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl sm:rounded-2xl transition-all">
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-5 sm:space-y-6 max-h-[60vh] overflow-y-auto scrollbar-hide">
              {formError && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex items-center gap-3 sm:gap-4 animate-shake">
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-bold leading-tight">{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl outline-none focus:border-blue-500/20 focus:bg-white transition-all font-medium text-sm"
                    placeholder="Contoh: Budi Sudarsono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl outline-none focus:border-blue-500/20 focus:bg-white transition-all font-medium text-sm"
                    placeholder="email@perusahaan.com"
                  />
                </div>
              </div>

              {!editingUserId && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Password</label>
                    <input
                      type="password"
                      required={!editingUserId}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl outline-none focus:border-blue-500/20 focus:bg-white transition-all font-medium text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl outline-none focus:border-blue-500/20 focus:bg-white transition-all font-medium appearance-none text-sm"
                    >
                      <option value="EMPLOYEE">EMPLOYEE</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                </div>
              )}

              {editingUserId && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl outline-none focus:border-blue-500/20 focus:bg-white transition-all font-medium appearance-none text-sm"
                  >
                    <option value="EMPLOYEE">EMPLOYEE</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Divisi</label>
                  <select
                    required
                    value={formData.divisionId}
                    onChange={(e) => setFormData({ ...formData, divisionId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl outline-none focus:border-blue-500/20 focus:bg-white transition-all font-medium appearance-none text-sm"
                  >
                    <option value="">Pilih Divisi</option>
                    {divisions.map(div => <option key={div.id} value={div.id}>{div.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Jadwal Kerja</label>
                  <select
                    required
                    value={formData.workScheduleId}
                    onChange={(e) => setFormData({ ...formData, workScheduleId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-5 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl outline-none focus:border-blue-500/20 focus:bg-white transition-all font-medium appearance-none text-sm"
                  >
                    <option value="">Pilih Jadwal</option>
                    {schedules.map(sch => <option key={sch.id} value={sch.id}>{sch.name}</option>)}
                  </select>
                </div>
              </div>
            </form>

            <div className="p-6 sm:p-10 bg-slate-50/50 border-t border-slate-50">
              <button
                onClick={handleSubmit}
                disabled={formLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 sm:py-5 rounded-xl sm:rounded-[2rem] transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg disabled:opacity-50 active:scale-95"
              >
                {formLoading ? <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" /> : editingUserId ? 'Simpan Perubahan' : 'Daftarkan Karyawan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminUsers;
