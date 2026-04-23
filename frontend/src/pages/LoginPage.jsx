import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../config';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect based on role
      if (response.data.user.role === 'SUPERADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden p-6">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/40 rounded-full blur-[140px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-100/40 rounded-full blur-[140px]"></div>

      <div className="w-full max-w-lg animate-in fade-in zoom-in duration-700">
        <div className="bg-white border border-slate-100 rounded-[3rem] p-12 shadow-2xl shadow-slate-200/50 relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-8 animate-in zoom-in duration-1000">
              <img src="/webz.webp" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight font-serif">Selamat Datang</h1>
            <p className="text-slate-500 font-medium text-lg">Silakan masuk ke portal kehadiran Anda</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-5 rounded-[1.5rem] flex items-center gap-4 animate-shake">
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                <span className="text-sm font-bold leading-tight">{error}</span>
              </div>
            )}

            {message && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-5 rounded-[1.5rem] flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                <span className="text-sm font-bold leading-tight">{message}</span>
              </div>
            )}

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">Email Karyawan</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 text-slate-900 pl-14 pr-6 py-5 rounded-[1.5rem] outline-none focus:border-blue-500/20 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                  placeholder="name@absensi.com"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">Kata Sandi</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 text-slate-900 pl-14 pr-6 py-5 rounded-[1.5rem] outline-none focus:border-blue-500/20 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs py-2">
              <label className="flex items-center gap-3 text-slate-500 cursor-pointer select-none font-bold">
                <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 bg-slate-50 text-blue-600 focus:ring-0 transition-all" />
                <span>Ingat saya</span>
              </label>
              <a href="#" className="text-blue-600 hover:text-blue-500 transition-colors font-black uppercase tracking-wider">Lupa sandi?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 rounded-[1.5rem] transition-all shadow-2xl shadow-blue-600/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                'Masuk ke Dashboard'
              )}
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-slate-50 text-center">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Hubungi Admin untuk pendaftaran akun baru
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
