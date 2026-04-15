import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import DashboardLayout from "./components/layouts/DashboardLayout";
import PatientDashboard from "./pages/dashboard/PatientDashboard";
import PatientReports from "./pages/dashboard/PatientReports";
import PatientAnalytics from "./pages/dashboard/PatientAnalytics";
import AppointmentsPage from "./pages/dashboard/AppointmentsPage";
import HealthGoalsPage from "./pages/dashboard/HealthGoalsPage";
import NotificationsPage from "./pages/dashboard/NotificationsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import LabDashboard from "./pages/dashboard/LabDashboard";
import LabUploadPage from "./pages/dashboard/LabUploadPage";
import LabPerformancePage from "./pages/dashboard/LabPerformancePage";
import PatientsPage from "./pages/dashboard/PatientsPage";
import DoctorDashboard from "./pages/dashboard/DoctorDashboard";
import DoctorReportReview from "./pages/dashboard/DoctorReportReview";
import DoctorInsightsPage from "./pages/dashboard/DoctorInsightsPage";
import DoctorSchedulePage from "./pages/dashboard/DoctorSchedulePage";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import AdminUsersPage from "./pages/dashboard/AdminUsersPage";
import AuditLogsPage from "./pages/dashboard/AuditLogsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppInit({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((s) => s.initialize);
  useEffect(() => { initialize(); }, [initialize]);
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppInit>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route path="/dashboard" element={<DashboardLayout />}>
              {/* Patient */}
              <Route path="patient" element={<PatientDashboard />} />
              <Route path="patient/reports" element={<PatientReports />} />
              <Route path="patient/analytics" element={<PatientAnalytics />} />
              <Route path="patient/appointments" element={<AppointmentsPage />} />
              <Route path="patient/goals" element={<HealthGoalsPage />} />
              <Route path="patient/notifications" element={<NotificationsPage />} />
              <Route path="patient/settings" element={<SettingsPage />} />

              {/* Lab */}
              <Route path="lab" element={<LabDashboard />} />
              <Route path="lab/upload" element={<LabUploadPage />} />
              <Route path="lab/reports" element={<PatientReports />} />
              <Route path="lab/patients" element={<PatientsPage />} />
              <Route path="lab/performance" element={<LabPerformancePage />} />
              <Route path="lab/notifications" element={<NotificationsPage />} />

              {/* Doctor */}
              <Route path="doctor" element={<DoctorDashboard />} />
              <Route path="doctor/patients" element={<PatientsPage />} />
              <Route path="doctor/reports" element={<DoctorReportReview />} />
              <Route path="doctor/insights" element={<DoctorInsightsPage />} />
              <Route path="doctor/schedule" element={<DoctorSchedulePage />} />
              <Route path="doctor/notifications" element={<NotificationsPage />} />

              {/* Admin */}
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/users" element={<AdminUsersPage />} />
              <Route path="admin/reports" element={<PatientReports />} />
              <Route path="admin/audit" element={<AuditLogsPage />} />
              <Route path="admin/analytics" element={<PatientAnalytics />} />
              <Route path="admin/settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppInit>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
