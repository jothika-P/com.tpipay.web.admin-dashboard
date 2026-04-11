import { Routes, Route, Navigate } from "react-router-dom";

import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import KYC from "./pages/KYC";
import Analytics from "./pages/Analytics";
import RmDashboard from "./pages/RmDashboard";

import MainLayout from "./layout/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>

      {/* AUTH */}
      <Route path="/" element={<Auth />} />

      {/* ADMIN */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
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
            <RmDashboard />
          </ProtectedRoute>
        }
      />

      {/* USERS */}
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
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
          <ProtectedRoute allowedRoles={["ADMIN", "RM"]}>
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
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <MainLayout>
              <Analytics />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}