import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Settings, Save, MapPin, Calendar, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { API_BASE_URL } from '../config';

const OfficeSettings = () => {
  const [settings, setSettings] = useState({
    name: '',
    address: '',
    latitude: 0,
    longitude: 0,
    radius: 50,
    maxLeavePerMonth: 3
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/office`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSettings(res.data);
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Gagal mengambil pengaturan' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: '', message: '' });

    try {
      await axios.patch(`${API_BASE_URL}/api/office`, settings, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStatus({ type: 'success', message: 'Pengaturan berhasil disimpan!' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Gagal menyimpan pengaturan' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <header className="mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight font-serif">Pengaturan Kantor</h1>
        <p className="text-slate-500 mt-2 text-sm sm:text-lg">Konfigurasi lokasi kantor, radius absensi, dan kebijakan izin.</p>
      </header>

      <div className="max-w-5xl animate-fade-in">
        <form onSubmit={handleSave} className="space-y-6 sm:space-y-8">
          {status.message && (
            <div className={`p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] flex items-center gap-3 sm:gap-4 border animate-in slide-in-from-top-4 duration-500 ${
              status.type === 'success' 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                : 'bg-red-50 text-red-600 border-red-100'
            }`}>
              {status.type === 'success' ? <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />}
              <span className="font-bold text-xs sm:text-sm leading-tight">{status.message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* General Settings */}
            <div className="bg-white border border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 space-y-5 sm:space-y-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-4 flex items-center gap-3 font-serif">
                <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                Umum
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] block mb-2 px-1">Nama Kantor</label>
                  <input
                    type="text"
                    name="name"
                    value={settings.name}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl outline-none focus:border-blue-500/20 focus:bg-white transition-all font-medium text-sm"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] block mb-2 px-1">Alamat</label>
                  <textarea
                    name="address"
                    value={settings.address}
                    onChange={handleChange}
                    rows="4"
                    className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl outline-none focus:border-blue-500/20 focus:bg-white transition-all resize-none font-medium text-sm"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Attendance Settings */}
            <div className="bg-white border border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 space-y-5 sm:space-y-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-4 flex items-center gap-3 font-serif">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                Geofencing & Izin
              </h2>
              
              <div className="space-y-5 sm:space-y-6">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] block mb-2 px-1 text-xs">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      name="latitude"
                      value={settings.latitude}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl outline-none focus:border-blue-500/20 focus:bg-white transition-all font-medium tabular-nums text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] block mb-2 px-1 text-xs">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      name="longitude"
                      value={settings.longitude}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl outline-none focus:border-blue-500/20 focus:bg-white transition-all font-medium tabular-nums text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] block mb-2 px-1">Radius Absensi (Meter)</label>
                  <input
                    type="number"
                    name="radius"
                    value={settings.radius}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 text-slate-900 px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl outline-none focus:border-blue-500/20 focus:bg-white transition-all font-medium text-sm"
                  />
                </div>

                <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-100">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] block mb-2 sm:mb-3 px-1 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
                    Batas Izin per Bulan
                  </label>
                  <input
                    type="number"
                    name="maxLeavePerMonth"
                    value={settings.maxLeavePerMonth}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-100 text-slate-900 px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl outline-none focus:border-blue-500/20 transition-all font-bold text-lg sm:text-xl"
                  />
                  <p className="text-[9px] sm:text-[10px] text-slate-400 mt-2 sm:mt-3 uppercase font-bold tracking-wider leading-relaxed px-1">Maksimal jumlah pengajuan izin per bulan.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center sm:justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto bg-slate-950 hover:bg-slate-800 disabled:opacity-50 text-white font-bold py-4 sm:py-5 px-8 sm:px-12 rounded-xl sm:rounded-[1.5rem] transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-950/20 active:scale-[0.98] text-base sm:text-lg"
            >
              {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Save className="w-5 h-5 text-emerald-400" /> Simpan Konfigurasi</>}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default OfficeSettings;
