import { Routes, Route, Navigate } from "react-router-dom";

import Auth from "./pages/Auth";
import Users from "./pages/Users";
import KYC from "./pages/KYC";
import Analytics from "./pages/Analytics";
import Merchants from "./pages/Merchants";
import CreateMerchant from "./pages/CreateMerchant";
import MerchantDetails from "./pages/MerchantDetails";
import KycDetails from "./pages/KycDetails";
import KycDocuments from "./pages/KycDocuments";
import Partners from "./pages/Partners";

import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./layout/MainLayout";

export default function AppRoutes() {
  return (
    <Routes>

      {/* AUTH */}
      <Route path="/" element={<Auth />} />

      {/* ADMIN */}
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

      <Route
        path="/partners"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <MainLayout>
              <Partners />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* MERCHANTS (ADMIN + RM) */}
      <Route
        path="/merchants"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "RELATIONSHIP_MANAGER", "BACKEND_AGENT", "PARTNER"]}>
            <MainLayout>
              <Merchants />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/merchants/create"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "RELATIONSHIP_MANAGER", "PARTNER"]}>
            <MainLayout>
              <CreateMerchant />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/merchants/view/:id"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "RELATIONSHIP_MANAGER", "PARTNER"]}>
            <MainLayout>
              <MerchantDetails />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* KYC (ADMIN + RM + LEGALTEAM) */}
      <Route
        path="/kyc"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "RELATIONSHIP_MANAGER", "LEGAL_TEAM", "BACKEND_AGENT", "PARTNER"]}>
            <MainLayout>
              <KYC />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/kyc/details/:id"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "RELATIONSHIP_MANAGER", "LEGAL_TEAM", "BACKEND_AGENT", "PARTNER"]}>
            <MainLayout>
              <KycDetails />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/kyc/documents/:id"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "RELATIONSHIP_MANAGER", "LEGAL_TEAM", "BACKEND_AGENT", "PARTNER"]}>
            <MainLayout>
              <KycDocuments />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "LEGAL_TEAM", "PARTNER", "RELATIONSHIP_MANAGER"]}>
            <MainLayout>
              <Analytics />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* DEFAULT */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}