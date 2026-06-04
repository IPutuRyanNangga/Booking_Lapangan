import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import JadwalLapangan from './pages/jadwal';
import Pembayaran from './pages/pembayaran';
import TarifSewa from './pages/tarif';
import Fasilitas from './pages/fasilitas';
import Profil from './pages/profil';

import DashboardAdmin from './pages/Admin/DashboardAdmin';
import AddField from './pages/Admin/AddField.jsx';

// ================= PROTECTED ROUTE =================
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userRaw = localStorage.getItem('user');

  if (!token || !userRaw) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ================= ADMIN ROUTE =================
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userRaw = localStorage.getItem('user');

  if (!token || !userRaw) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userRaw);
  const userRole = user.role?.toLowerCase();

  const isAdmin =
    userRole === 'admin' ||
    userRole === 'super admin' ||
    user.role === '1';

  if (!isAdmin) {
    alert('Akses ditolak! Halaman ini khusus Admin.');
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// ================= PUBLIC ROUTE =================
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userRaw = localStorage.getItem('user');

  if (token && userRaw) {
    const user = JSON.parse(userRaw);
    const userRole = user.role?.toLowerCase();

    const isAdmin =
      userRole === 'admin' ||
      userRole === 'super admin' ||
      user.role === '1';

    if (isAdmin) {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// ================= APP =================
export default function App() {
  return (
    <Router>
      <Routes>

        {/* ROOT */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* PUBLIC */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* USER */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/jadwal"
          element={
            <ProtectedRoute>
              <JadwalLapangan />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pembayaran"
          element={
            <ProtectedRoute>
              <Pembayaran />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tarif"
          element={
            <ProtectedRoute>
              <TarifSewa />
            </ProtectedRoute>
          }
        />

        <Route
          path="/fasilitas"
          element={
            <ProtectedRoute>
              <Fasilitas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profil"
          element={
            <ProtectedRoute>
              <Profil />
            </ProtectedRoute>
          }
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <DashboardAdmin />
            </AdminRoute>
          }
        />

        {/* TAMBAH LAPANGAN */}
        <Route
          path="/admin/fields/create"
          element={
            <AdminRoute>
              <AddField />
            </AdminRoute>
          }
        />

        {/* FALLBACK */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </Router>
  );
}