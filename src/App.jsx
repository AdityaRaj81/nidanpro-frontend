import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';

// Patient Side Components
import PatientAccess from './components/patient/PatientAccess';
import PatientSelection from './components/patient/PatientSelection';
import PatientReports from './components/patient/PatientReports';
import ReportView from './components/patient/ReportView';

// Staff Dashboard Components
import StaffLayout from './components/staff/StaffLayout';
import Dashboard from './components/staff/Dashboard';
import Patients from './components/staff/Patients';
import Reports from './components/staff/Reports';
import CreateReport from './components/staff/CreateReport';
import ReportEntry from './components/staff/ReportEntry';
import Verification from './components/staff/Verification';
import TestManagement from './components/staff/TestManagement';
import TestParameters from './components/staff/TestParameters';
import StaffManagement from './components/staff/StaffManagement';
import Settings from './components/staff/Settings';
import Profile from './components/staff/Profile';
import StaffLogin from './components/staff/StaffLogin';
import LandingPage from './components/public/LandingPage';
import NotFound from './components/public/NotFound';

function App() {
  const [staffAuth, setStaffAuth] = useState(() => {
    const saved = localStorage.getItem('staffAuth');
    return saved ? JSON.parse(saved) : null;
  });
  const [patientAuth, setPatientAuth] = useState(() => {
    const saved = localStorage.getItem('patientAuth');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (staffAuth) {
      localStorage.setItem('staffAuth', JSON.stringify(staffAuth));
      if (staffAuth.token) localStorage.setItem('staffToken', staffAuth.token);
    } else {
      localStorage.removeItem('staffAuth');
      localStorage.removeItem('staffToken');
    }
  }, [staffAuth]);

  useEffect(() => {
    if (patientAuth) {
      localStorage.setItem('patientAuth', JSON.stringify(patientAuth));
      if (patientAuth.token) localStorage.setItem('patientToken', patientAuth.token);
    } else {
      localStorage.removeItem('patientAuth');
      localStorage.removeItem('patientToken');
    }
  }, [patientAuth]);

  const authValue = {
    staffAuth,
    setStaffAuth,
    patientAuth,
    setPatientAuth,
    isStaffAuthenticated: !!staffAuth,
    isPatientAuthenticated: !!patientAuth,
  };

  return (
    <AuthContext.Provider value={authValue}>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            {/* Patient Routes - Mobile First */}
            <Route path="/patient-access" element={<PatientAccess />} />
            <Route path="/patients" element={<PatientSelection />} />
            <Route path="/patient/profile" element={<PatientReports />} />
            <Route path="/patient/reports" element={<PatientReports />} />
            <Route path="/report/:id" element={<ReportView />} />

            {/* Staff Routes - Desktop Only */}
            <Route path="/login" element={<Navigate to="/staff/login" replace />} />
            <Route path="/staff/login" element={<StaffLogin />} />
            <Route path="/staff" element={<StaffLayout />}>
              <Route index element={<Navigate to="/staff/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="patients" element={<Patients />} />
              <Route path="reports" element={<Reports />} />
              <Route path="reports/create" element={<CreateReport />} />
              <Route path="reports/entry/:id" element={<ReportEntry />} />
              <Route path="reports/verify/:id" element={<Verification />} />
              <Route path="tests" element={<TestManagement />} />
              <Route path="tests/:id/parameters" element={<TestParameters />} />
              <Route path="staff-management" element={<StaffManagement />} />
              <Route path="settings" element={<Settings />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Public Landing */}
            <Route path="/" element={<LandingPage />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;