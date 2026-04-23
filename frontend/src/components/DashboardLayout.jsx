import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import { Bell, Search, Calendar as CalendarIcon, User, Menu, X } from 'lucide-react';
import { API_BASE_URL } from '../config';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasAgenda, setHasAgenda] = useState(false);
  
  let user = {};
  try {
    user = JSON.parse(localStorage.getItem('user') || '{}');
  } catch (e) {
    console.error('Error parsing user from localStorage', e);
  }

  useEffect(() => {
    const checkAgendas = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/agendas`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.data && res.data.length > 0) {
          setHasAgenda(true);
        }
      } catch (err) {
        console.error('Failed to fetch agendas', err);
      }
    };
    checkAgendas();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-50">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1 max-w-md hidden sm:block">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search data..." 
                  className="w-full bg-slate-50 border border-transparent focus:border-blue-500/20 focus:bg-white pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-4 text-slate-400 border-r border-slate-100 pr-3 sm:pr-6">
              <button className="p-2 hover:text-blue-500 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <Link to="/agenda" className="p-2 hover:text-blue-500 transition-colors relative group/agenda">
                <CalendarIcon className="w-5 h-5" />
                {hasAgenda && (
                  <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 border-2 border-white"></span>
                  </span>
                )}
              </Link>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 ml-2">
              <div className="text-right">
                <p className="text-[11px] sm:text-sm font-bold text-slate-900 leading-none">{user.name}</p>
                <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">{user.role}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src="/webz.webp" alt="User Logo" className="w-full h-full object-contain p-1.5 opacity-60" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-8 lg:p-12 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
