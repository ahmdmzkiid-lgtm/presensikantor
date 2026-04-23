import React, { useState, useRef, useEffect, Fragment } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, User, Loader2, CheckCircle, AlertTriangle, RefreshCcw, Clock } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { API_BASE_URL } from '../config';

const AttendanceForm = () => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('Mencari alamat...');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isCheckIn, setIsCheckIn] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (currentUser.role === 'SUPERADMIN') {
      navigate('/admin');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    // Get geolocation on mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ lat: latitude, lng: longitude });
          
          // Reverse Geocoding
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
            const data = await response.json();
            setAddress(data.display_name || 'Alamat tidak ditemukan');
          } catch (err) {
            console.error('Reverse Geocoding Error:', err);
            setAddress('Gagal memuat alamat');
          }
        },
        (err) => setStatus({ type: 'error', message: 'Gagal mendapatkan lokasi. Pastikan GPS aktif.' })
      );
    }
  }, []);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPhoto(imageSrc);
  };

  const resetPhoto = () => {
    setPhoto(null);
    setStatus({ type: '', message: '' });
  };

  const handleSubmit = async () => {
    if (!photo || !location) {
      setStatus({ type: 'error', message: 'Foto dan lokasi wajib ada' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // Convert base64 to blob
      const res = await fetch(photo);
      const blob = await res.blob();
      const filename = `attendance-${Date.now()}.jpg`;
      const file = new File([blob], filename, { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('photo', file);
      formData.append('latitude', location.lat);
      formData.append('longitude', location.lng);

      const endpoint = isCheckIn ? 'check-in' : 'check-out';
      const response = await axios.post(`${API_BASE_URL}/api/attendance/${endpoint}`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      });

      setStatus({ 
        type: 'success', 
        message: `Absen ${isCheckIn ? 'Masuk' : 'Pulang'} Berhasil!` 
      });
      setShowSuccessModal(true);
      setPhoto(null);
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Gagal mengirim absen' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <DashboardLayout>
        <header className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight font-serif">Kirim Absensi</h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-lg leading-relaxed">Pastikan Anda berada di area kantor untuk melakukan absen.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
          {/* Camera Section */}
          <div className="bg-white border border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-sm">
            <div className="w-full aspect-square sm:aspect-video bg-slate-950 rounded-[1.5rem] sm:rounded-3xl overflow-hidden relative border border-slate-200 shadow-xl">
              {!photo ? (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: "user" }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img src={photo} alt="Preview" className="w-full h-full object-cover" />
              )}
              
              {status.type === 'success' && (
                <div className="absolute inset-0 bg-emerald-600/90 backdrop-blur-sm flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
                  <CheckCircle className="w-16 h-16 mb-2" />
                  <span className="text-2xl font-bold">Berhasil!</span>
                </div>
              )}
            </div>

            <div className="mt-6 sm:mt-8">
              {!photo ? (
                <button
                  onClick={capture}
                  className="w-full bg-slate-950 text-white font-bold py-4 sm:py-5 rounded-2xl transition-all flex items-center justify-center gap-2 hover:bg-slate-800 shadow-lg shadow-slate-950/20 active:scale-95"
                >
                  <Camera className="w-5 h-5" />
                  Ambil Foto Selfie
                </button>
              ) : (
                <button
                  onClick={resetPhoto}
                  className="w-full bg-slate-100 text-slate-600 font-bold py-4 sm:py-5 rounded-2xl transition-all flex items-center justify-center gap-2 hover:bg-slate-200 active:scale-95"
                >
                  <RefreshCcw className="w-5 h-5" />
                  Ulangi Foto
                </button>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-white border border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 sm:mb-8 font-serif">Detail Status</h2>
              
              <div className="space-y-4 sm:space-y-6">
                {/* User Identity Section */}
                <div className="flex items-start gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-blue-50/50 border border-blue-100/50">
                  <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white text-blue-600 shadow-sm flex-shrink-0">
                    <User className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1">Identitas Karyawan</p>
                    <p className="text-slate-900 font-black text-sm sm:text-base leading-tight">
                      {currentUser.name}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2 py-1 bg-white border border-blue-100 rounded-lg text-[9px] font-black text-blue-600 uppercase tracking-tighter shadow-sm">
                        Divisi: {currentUser.division?.name || 'Kantor Pusat'}
                      </span>
                      <span className="px-2 py-1 bg-white border border-blue-100 rounded-lg text-[9px] font-black text-blue-600 uppercase tracking-tighter shadow-sm">
                        Jabatan: {
                          currentUser.role === 'SUPERADMIN' ? 'Owner / Superadmin' : 
                          currentUser.role === 'ADMIN' ? 'HR / Administrator' : 'Staff / Karyawan'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-50 border border-slate-100">
                  <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white text-blue-600 shadow-sm flex-shrink-0">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Lokasi & Alamat Saya</p>
                    <p className="text-slate-900 font-bold text-xs sm:text-sm leading-relaxed">
                      {address}
                    </p>
                    <p className="text-[10px] text-blue-500 font-mono mt-2 tabular-nums">
                      {location ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : 'Mendeteksi koordinat...'}
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white text-purple-600 shadow-sm h-fit">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tipe Absen</p>
                  </div>
                  
                  <div className="flex p-1.5 bg-white border border-slate-100 rounded-xl sm:rounded-2xl shadow-sm">
                    <button
                      onClick={() => setIsCheckIn(true)}
                      className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-lg sm:rounded-xl transition-all ${isCheckIn ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Check In
                    </button>
                    <button
                      onClick={() => setIsCheckIn(false)}
                      className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-lg sm:rounded-xl transition-all ${!isCheckIn ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Check Out
                    </button>
                  </div>
                </div>
              </div>

              {status.message && (
                <div className={`mt-6 sm:mt-8 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border flex items-center gap-3 sm:gap-4 animate-in fade-in slide-in-from-top-2 ${
                  status.type === 'success' 
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                    : 'bg-red-50 border-red-100 text-red-600'
                }`}>
                  {status.type === 'success' ? <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" /> : <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />}
                  <span className="font-bold text-xs sm:text-sm leading-tight">{status.message}</span>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading || !photo || !location}
                className="w-full mt-8 sm:mt-10 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-4 sm:py-5 rounded-xl sm:rounded-[1.5rem] transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] flex items-center justify-center gap-3 text-base sm:text-lg"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Konfirmasi Absensi'}
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
      
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
            onClick={() => setShowSuccessModal(false)}
          ></div>
          
          <div className="relative bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center">
              <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="w-12 h-12 text-emerald-500 animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 font-serif mb-3">Absensi Berhasil!</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Data kehadiran Anda telah tercatat secara real-time di sistem perusahaan. Selamat bekerja!
              </p>
              
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-4 bg-slate-950 text-white font-bold rounded-2xl transition-all hover:bg-slate-800 shadow-xl shadow-slate-950/20 active:scale-95"
              >
                Tutup & Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default AttendanceForm;
