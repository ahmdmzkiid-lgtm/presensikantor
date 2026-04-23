import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart3, 
  Search, 
  Filter, 
  User, 
  Calendar, 
  Clock, 
  AlertCircle,
  ChevronRight,
  TrendingUp,
  Download,
  Loader2,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { API_BASE_URL } from '../config';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AdminPerformance = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/stats/performance`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPerformanceData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Add Header
    doc.setFontSize(20);
    doc.text('Laporan Performa Karyawan', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`, 14, 30);
    
    const tableColumn = ["Nama Karyawan", "Divisi", "Hadir", "Lembur", "Cuti/Sakit", "Persentase"];
    const tableRows = [];

    filteredData.forEach(row => {
      const percentage = Math.min(100, Math.round((row.totalAttendance / 22) * 100));
      const rowData = [
        row.name,
        row.division,
        `${row.totalAttendance} Hari`,
        `${row.totalOvertimeHours} Jam`,
        `${row.totalLeaveDays + row.totalSickDays} Hari`,
        `${percentage}%`
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles: {
        5: { fontStyle: 'bold' }
      }
    });

    doc.save(`Laporan_Performa_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const filteredData = performanceData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.division.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <header className="mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight font-serif">Performa Karyawan</h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-lg">Analisis kehadiran dan produktivitas seluruh tim.</p>
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
            onClick={handleExportPDF}
            className="flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-3.5 bg-slate-900 text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </header>

      {loading ? (
        <div className="bg-white border border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] p-12 sm:p-20 text-center shadow-sm">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-400 font-medium">Menganalisis data performa...</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px] sm:min-w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Karyawan</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] text-center">Hadir</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] text-center">Lembur</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] text-center">Cuti</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] text-center">Sakit</th>
                  <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] text-center">Persentase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredData.length > 0 ? filteredData.map((row) => {
                  const percentage = Math.min(100, Math.round((row.totalAttendance / 22) * 100));
                  return (
                    <tr key={row.userId} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 font-black text-[10px] sm:text-xs border border-slate-200">
                            {row.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-slate-900 font-bold text-xs sm:text-sm leading-none mb-1 sm:mb-1.5">{row.name}</p>
                            <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-black tracking-widest">{row.division}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col items-center">
                          <span className="text-slate-900 font-black text-base sm:text-lg">{row.totalAttendance}</span>
                          <span className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 sm:mt-1">Hari</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col items-center">
                          <span className="text-blue-600 font-black text-base sm:text-lg">{row.totalOvertimeHours}</span>
                          <span className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 sm:mt-1">Jam</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col items-center">
                          <span className="text-amber-600 font-black text-base sm:text-lg">{row.totalLeaveDays}</span>
                          <span className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 sm:mt-1">Hari</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col items-center">
                          <span className="text-rose-600 font-black text-base sm:text-lg">{row.totalSickDays}</span>
                          <span className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 sm:mt-1">Hari</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center">
                          <div className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg sm:rounded-xl font-black text-[10px] sm:text-xs tracking-wider border ${
                            percentage >= 90 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            percentage >= 70 ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            'bg-rose-50 text-rose-600 border-rose-100'
                          }`}>
                            {percentage}%
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="6" className="px-10 py-24 text-center text-slate-400 italic font-medium">
                      Tidak ada data performa ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminPerformance;
