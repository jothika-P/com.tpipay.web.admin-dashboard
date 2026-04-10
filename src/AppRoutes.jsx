import { Routes, Route, Navigate } from "react-router-dom";

import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import KYC from "./pages/KYC";
import Analytics from "./pages/Analytics";
import MainLayout from "./layout/MainLayout";

export default function AppRoutes() {
  return (
    <Routes>

      {/* AUTH PAGE */}
      <Route path="/" element={<Auth />} />

      {/* PROTECTED APP PAGES */}
      <Route
        path="/dashboard"
        element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        }
      />

      <Route
        path="/users"
        element={
          <MainLayout>
            <Users />
          </MainLayout>
        }
      />

      <Route
        path="/kyc"
        element={
          <MainLayout>
            <KYC />
          </MainLayout>
        }
      />

      <Route
        path="/analytics"
        element={
          <MainLayout>
            <Analytics />
          </MainLayout>
        }
      />

      {/* FIX: any wrong URL redirects */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}