
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import EmployeeManagement from './pages/EmployeeManagement';
import LeaveRequests from './pages/LeaveRequests';
import History from './pages/History';
import Settings from './pages/Settings';
import Schedule from './pages/Schedule';
import Payroll from './pages/Payroll';
import Sidebar from './components/Sidebar';
import { User, UserRole } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('presensi_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('presensi_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('presensi_user');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!currentUser ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
        />
        <Route
          path="/*"
          element={
            currentUser ? (
              <div className="flex min-h-screen bg-slate-50">
                <Sidebar user={currentUser} onLogout={handleLogout} />
                <main className="flex-1 lg:ml-64 p-4 md:p-8 pb-24 lg:pb-8">
                  <Routes>
                    <Route path="/" element={<Dashboard user={currentUser} />} />
                    <Route path="/attendance" element={<Attendance user={currentUser} />} />
                    <Route path="/history" element={<History user={currentUser} />} />
                    <Route path="/leave" element={<LeaveRequests user={currentUser} />} />
                    <Route path="/schedule" element={<Schedule user={currentUser} />} />
                    <Route path="/payroll" element={<Payroll user={currentUser} />} />
                    {currentUser.role === UserRole.ADMIN && (
                      <>
                        <Route path="/employees" element={<EmployeeManagement user={currentUser} />} />
                        <Route path="/settings" element={<Settings />} />
                      </>
                    )}
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </main>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </HashRouter>
  );
};

export default App;
