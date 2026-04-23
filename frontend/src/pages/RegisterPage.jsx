import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '../config';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post(`${API_BASE_URL}/api/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'EMPLOYEE'
      });

      // Redirect to login after successful registration
      navigate('/login', { state: { message: 'Registrasi berhasil! Silakan login.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mendaftar. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden p-6">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/40 rounded-full blur-[140px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-100/40 rounded-full blur-[140px]"></div>

      <div className="w-full max-w-lg animate-in fade-in zoom-in duration-700">
        <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 mb-8 transition-colors group font-bold uppercase tracking-wider text-[10px]">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Login</span>
        </Link>

        <div className="bg-white border border-slate-100 rounded-[3rem] p-12 shadow-2xl shadow-slate-200/50 relative">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight font-serif">Daftar Karyawan</h1>
            <p className="text-slate-500 font-medium text-lg">Buat akun baru untuk mulai absensi</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-5 rounded-[1.5rem] flex items-center gap-4 animate-shake">
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                <span className="text-sm font-bold leading-tight">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">Nama Lengkap</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-100 text-slate-900 pl-14 pr-6 py-4 rounded-[1.5rem] outline-none focus:border-blue-500/20 focus:bg-white transition-all font-medium"
                  placeholder="Masukkan nama lengkap"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-100 text-slate-900 pl-14 pr-6 py-4 rounded-[1.5rem] outline-none focus:border-blue-500/20 focus:bg-white transition-all font-medium"
                  placeholder="name@perusahaan.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">Sandi</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 text-slate-900 pl-14 pr-6 py-4 rounded-[1.5rem] outline-none focus:border-blue-500/20 focus:bg-white transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">Konfirmasi</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 text-slate-900 pl-14 pr-6 py-4 rounded-[1.5rem] outline-none focus:border-blue-500/20 focus:bg-white transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-5 rounded-[1.5rem] transition-all shadow-2xl shadow-slate-950/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Mendaftar...</span>
                </>
              ) : (
                'Daftar Sekarang'
              )}
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-slate-50 text-center">
            <p className="text-slate-500 font-medium">
              Sudah punya akun? <Link to="/login" className="text-blue-600 hover:text-blue-500 font-black uppercase tracking-wider ml-2">Login di sini</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
