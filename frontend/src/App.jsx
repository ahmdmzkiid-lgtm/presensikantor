import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { LayoutDashboard, LogIn, Camera, ClipboardList, MapPin } from 'lucide-react';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AttendanceForm from './pages/AttendanceForm';
import History from './pages/History';
import AdminDashboard from './pages/AdminDashboard';
import LeaveForm from './pages/LeaveForm';
import AdminLeaveRequests from './pages/AdminLeaveRequests';
import OfficeSettings from './pages/OfficeSettings';
import DailyReport from './pages/DailyReport';
import AdminReports from './pages/AdminReports';
import OvertimeForm from './pages/OvertimeForm';
import AdminOvertime from './pages/AdminOvertime';
import AdminPerformance from './pages/AdminPerformance';
import AdminUsers from './pages/AdminUsers';
import AgendaPage from './pages/AgendaPage';

// Simple Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token || token === 'undefined') return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/attendance" 
          element={
            <ProtectedRoute>
              <AttendanceForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/history" 
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/leave" 
          element={
            <ProtectedRoute>
              <LeaveForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute>
              <DailyReport />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/overtime" 
          element={
            <ProtectedRoute>
              <OvertimeForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/leave" 
          element={
            <ProtectedRoute>
              <AdminLeaveRequests />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/reports" 
          element={
            <ProtectedRoute>
              <AdminReports />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/overtime" 
          element={
            <ProtectedRoute>
              <AdminOvertime />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/performance" 
          element={
            <ProtectedRoute>
              <AdminPerformance />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute>
              <AdminUsers />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/settings" 
          element={
            <ProtectedRoute>
              <OfficeSettings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/agenda" 
          element={
            <ProtectedRoute>
              <AgendaPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
