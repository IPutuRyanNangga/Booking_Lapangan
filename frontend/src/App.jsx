import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import JadwalLapangan from './pages/jadwal';
import Pembayaran from './pages/pembayaran';
import TarifSewa from './pages/tarif';
import Fasilitas from './pages/fasilitas';
import Profil from './pages/profil'; // <-- 1. Impor Halaman Profil Baru

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userRaw = localStorage.getItem('user');
  if (!token || !userRaw) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userRaw = localStorage.getItem('user');
  if (token && userRaw) return <Navigate to="/dashboard" replace />;
  return children;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} /> 
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/jadwal" element={<ProtectedRoute><JadwalLapangan /></ProtectedRoute>} />
        <Route path="/pembayaran" element={<ProtectedRoute><Pembayaran /></ProtectedRoute>} />
        <Route path="/tarif" element={<ProtectedRoute><TarifSewa /></ProtectedRoute>} />
        <Route path="/fasilitas" element={<ProtectedRoute><Fasilitas /></ProtectedRoute>} />
        
        {/* 2. Daftarkan Rute Profil di Sini */}
        <Route path="/profil" element={
          <ProtectedRoute>
            <Profil />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}