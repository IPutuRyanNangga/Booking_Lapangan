import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profil = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  // State data user asli dari server
  const [user, setUser] = useState({ name: 'Loading...', email: '-', role: 'User', created_at: '-' });
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:8000/api'; // Sesuaikan URL backend Anda

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/user`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user || data);
        } else {
          throw new Error('Gagal memuat profil');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token, navigate]);

  return (
    <div className="h-screen w-screen bg-[#070b13] font-sans text-slate-100 overflow-hidden flex flex-col relative select-none">
      
      {/* BACKGROUND GLOW EFFECTS */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[#10b981]/5 blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-[#06b6d4]/5 blur-[140px] pointer-events-none"></div>

      {/* ================= HEADER / NAVBAR ================= */}
      <header className="h-20 border-b border-slate-800/60 bg-[#0b111e]/40 backdrop-blur-xl px-6 md:px-10 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div onClick={() => navigate('/dashboard')} className="h-9 w-9 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center font-bold text-slate-400 hover:text-[#10b981] hover:border-[#10b981]/40 cursor-pointer transition-all">
            ←
          </div>
          <span className="font-bold text-sm tracking-widest text-slate-200 uppercase">
            PROFIL <span className="text-[#10b981]">PENGGUNA</span>
          </span>
        </div>
        <span className="text-[10px] bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl font-bold text-[#10b981] tracking-wider uppercase">
          ID Anggota Terverifikasi
        </span>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto z-10 w-full max-w-[800px] mx-auto flex flex-col gap-6 custom-scrollbar justify-center">
        
        {loading ? (
          <div className="text-center text-xs text-slate-500 font-bold tracking-widest uppercase">
            Mengambil Data Akun Ganesha Arena...
          </div>
        ) : (
          <div className="bg-[#0b111e]/40 border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl space-y-8 relative overflow-hidden">
            
            {/* Bagian Foto Profil Besar & Nama */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-800/60">
              <div className="h-24 w-24 rounded-2xl bg-slate-900 border-2 border-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center justify-center text-4xl font-black text-[#10b981] uppercase">
                {user.name ? user.name.charAt(0) : 'U'}
              </div>
              <div className="text-center sm:text-left space-y-1">
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">{user.name}</h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-emerald-950/40 text-[#10b981] border border-emerald-500/20">
                    {user.role || 'Regular Member'}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Aktif Sejak: {user.created_at ? user.created_at.split('T')[0] : 'Juni 2026'}
                  </span>
                </div>
              </div>
            </div>

            {/* Grid Detail Akun */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950/40 border border-slate-800/50 p-4 rounded-xl">
                <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nama Lengkap</span>
                <span className="text-sm font-bold text-slate-200">{user.name}</span>
              </div>

              <div className="bg-slate-950/40 border border-slate-800/50 p-4 rounded-xl">
                <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Alamat Email</span>
                <span className="text-sm font-bold text-slate-200 truncate block">{user.email}</span>
              </div>

              <div className="bg-slate-950/40 border border-slate-800/50 p-4 rounded-xl">
                <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Hak Akses Sistem</span>
                <span className="text-sm font-bold text-[#10b981] capitalize">{user.role || 'User'}</span>
              </div>

              <div className="bg-slate-950/40 border border-slate-800/50 p-4 rounded-xl">
                <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Keamanan Akun</span>
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Terkoneksi JWT Token
                </span>
              </div>
            </div>

            {/* Tombol Tindakan Ringkas */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition-all text-center"
              >
                Kembali ke Dashboard
              </button>
              <button
                onClick={() => alert('Fitur ubah sandi/edit profil terintegrasi pada tahap pengembangan berikutnya.')}
                className="flex-1 bg-gradient-to-r from-[#10b981] to-[#059669] text-[#070b13] font-black text-xs uppercase tracking-widest py-3 rounded-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
              >
                Edit Akun Profil
              </button>
            </div>

          </div>
        )}

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="h-10 border-t border-slate-800/40 bg-[#05080f] px-6 flex items-center justify-between text-[10px] text-slate-600 font-medium z-10 shrink-0">
        <span>© 2026 GANESHA SPORT APP</span>
        <span className="tracking-widest text-[#10b981]/60">SERVER SECURED</span>
      </footer>

    </div>
  );
};

export default Profil;