import { Routes, Route, Navigate } from "react-router-dom";

import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import KYC from "./pages/KYC";
import Analytics from "./pages/Analytics";
import RmDashboard from "./pages/RmDashboard";
import LegalTeamDashboard from "./pages/LegalTeamDashboard";

import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./layout/MainLayout";

export default function AppRoutes() {
  return (
    <Routes>

      {/* AUTH */}
      <Route path="/" element={<Auth />} />

      {/* ADMIN + LEGAL DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "LEGALTEAM"]}>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* RM */}
      <Route
        path="/rm"
        element={
          <ProtectedRoute allowedRoles={["RM"]}>
            <MainLayout>
              <RmDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* USERS */}
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "LEGALTEAM"]}>
            <MainLayout>
              <Users />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* KYC */}
      <Route
        path="/kyc"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "RM", "LEGALTEAM"]}>
            <MainLayout>
              <KYC />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* ANALYTICS */}
      <Route
        path="/analytics"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "RM", "LEGALTEAM"]}>
            <MainLayout>
              <Analytics />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* LEGAL TEAM DASHBOARD (optional separate page) */}
      <Route
        path="/legal"
        element={
          <ProtectedRoute allowedRoles={["LEGALTEAM", "ADMIN"]}>
            <LegalTeamDashboard />
          </ProtectedRoute>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}