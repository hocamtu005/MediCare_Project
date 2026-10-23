import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

import DoctorDashboardPage from './pages/doctor/DoctorDashboardPage';
import DoctorSchedulePage from './pages/doctor/DoctorSchedulePage';
import DoctorPatientsPage from './pages/doctor/DoctorPatientsPage';
import DoctorProfilePage from './pages/doctor/DoctorProfilePage';

import NurseDashboard from './pages/receptionist/DashboardPage';
import NurseOverviewPage from './pages/receptionist/NurseOverviewPage';
import NurseBookingPage from './pages/receptionist/NurseBookingPage';
import NurseTriagePage from './pages/receptionist/NurseTriagePage';

import AdminDashboard from './pages/admin/DashboardPage';
import StaffManagementPage from './pages/admin/StaffManagementPage';
import ClinicSpecialtyPage from './pages/admin/ClinicSpecialtyPage';
import ScheduleManagementPage from './pages/admin/ScheduleManagementPage';
import RecordManagementPage from './pages/admin/RecordManagementPage';

import PatientDashboard from './pages/patient/DashboardPage';
import PatientBooking from './pages/patient/BookingPage';
import PatientRecordsPage from './pages/patient/RecordsPage';
import PatientProfilePage from './pages/patient/PatientProfilePage';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

const ForbiddenPage = () => <div className="p-8 text-red-600 font-bold text-2xl flex h-screen items-center justify-center">403 - Không có quyền truy cập</div>;

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
          </Route>

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route path="/403" element={<ForbiddenPage />} />

          {/* Private Routes - ADMIN */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route element={<DashboardLayout role="ADMIN" />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/staff" element={<StaffManagementPage />} />
              <Route path="/admin/clinics" element={<ClinicSpecialtyPage />} />
              <Route path="/admin/schedules" element={<ScheduleManagementPage />} />
              <Route path="/admin/records" element={<RecordManagementPage />} />
            </Route>
          </Route>

          {/* Private Routes - DOCTOR */}
          <Route element={<ProtectedRoute allowedRoles={['DOCTOR']} />}>
            <Route element={<DashboardLayout role="DOCTOR" />}>
              <Route path="/doctor/dashboard" element={<DoctorDashboardPage />} />
              <Route path="/doctor/schedule" element={<DoctorSchedulePage />} />
              <Route path="/doctor/patients" element={<DoctorPatientsPage />} />
              <Route path="/doctor/profile" element={<DoctorProfilePage />} />
            </Route>
          </Route>

          {/* Private Routes - RECEPTIONIST */}
          <Route element={<ProtectedRoute allowedRoles={['RECEPTIONIST']} />}>
            <Route element={<DashboardLayout role="RECEPTIONIST" />}>
              <Route path="/receptionist/dashboard" element={<NurseDashboard />} /> 
              <Route path="/receptionist/appointments" element={<NurseOverviewPage />} /> 
              <Route path="/receptionist/book-for-patient" element={<NurseBookingPage />} />
              <Route path="/receptionist/triage" element={<NurseTriagePage />} />
            </Route>
          </Route>

          {/* Private Routes - PATIENT */}
          <Route element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
            <Route element={<DashboardLayout role="PATIENT" />}>
              <Route path="/patient/dashboard" element={<PatientDashboard />} />
              <Route path="/patient/booking" element={<PatientBooking />} />
              <Route path="/patient/records" element={<PatientRecordsPage />} />
              <Route path="/patient/profile" element={<PatientProfilePage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}