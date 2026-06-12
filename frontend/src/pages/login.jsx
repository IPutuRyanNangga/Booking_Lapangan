import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // States untuk mendeteksi apakah input sedang aktif (fokus)
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // PERBAIKAN: Mengarahkan langsung ke rute API port 8000 backend Codespaces yang valid
      const response = await fetch('https://supreme-winner-v6p5v77jv9p5cw5qr-8000.app.github.dev/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Email atau password Anda salah.');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // ================= LOGIKA PENGALIHAN BERDASARKAN ROLE DATA BACKEND =================
      const userRole = data.user?.role?.toLowerCase();

      if (userRole === 'admin' || userRole === 'super admin' || data.user?.role === '1') {
        alert('Selamat datang Admin Ganesha Arena!');
        navigate('/admin/dashboard'); // Mengarah ke rute dashboard admin
      } else {
        alert('Selamat datang kembali di Ganesha Sport!');
        navigate('/dashboard'); // Mengarah ke rute dashboard user biasa
      }
      // ===================================================================================

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Memastikan tombol kembali aktif dan tidak macet
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#030712] font-sans text-slate-100 m-0 p-0 selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* 1. EFEK BACKGROUND: PARTIKEL NEON MELAYANG (CSS-ONLY PARTICLES) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[15%] h-2 w-2 rounded-full bg-emerald-400/40 blur-[1px] animate-bounce duration-[6000ms]"></div>
        <div className="absolute top-[60%] left-[8%] h-3 w-3 rounded-full bg-teal-400/30 blur-[2px] animate-pulse duration-[4000ms]"></div>
        <div className="absolute top-[80%] left-[45%] h-1.5 w-1.5 rounded-full bg-cyan-400/50 blur-[1px] animate-bounce duration-[8000ms]"></div>
        <div className="absolute top-[25%] right-[15%] h-3 w-3 rounded-full bg-emerald-500/20 blur-[2px] animate-pulse duration-[5000ms]"></div>
        <div className="absolute top-[75%] right-[25%] h-2 w-2 rounded-full bg-teal-300/40 blur-[1px] animate-bounce duration-[7000ms]"></div>
      </div>

      {/* 2. EFEK BACKGROUND: GIANT GLOWING ORBS WITH PULSE */}
      <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-emerald-600/20 to-transparent blur-[120px] mix-blend-screen animate-pulse duration-[6000ms]"></div>
      <div className="absolute -right-32 -bottom-32 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-teal-600/15 to-transparent blur-[140px] mix-blend-screen animate-pulse duration-[8000ms]"></div>

      {/* 3. WIDGET UTAMA: PREMIUM GLASSMORPHISM BOX WITH GRID HYPERSPACE */}
      <div className="relative z-10 flex h-full min-h-[620px] w-full max-w-4xl overflow-hidden rounded-[32px] border border-slate-800/80 bg-slate-950/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl m-4 transition-all duration-500 hover:border-slate-700/50">
        
        {/* ================= SISI KIRI: PREMIUM KINETIC POSTER ================= */}
        <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-b from-[#091122] via-[#051a1a] to-[#020c08] p-12 md:flex border-r border-slate-900/60 overflow-hidden">
          {/* Garis Grid Siber & Radial Masking */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#081120_1px,transparent_1px),linear-gradient(to_bottom,#081120_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_60%,transparent_100%)] opacity-40"></div>
          
          {/* Efek Garis Menyala Bergerak Semu */}
          <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent shadow-[0_0_15px_#10b981] opacity-70"></div>

          {/* Logo & Brand Identity */}
          <div className="relative z-10 flex items-center space-x-3 group cursor-pointer">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-400 p-[1px] shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-all duration-300">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-slate-950 text-emerald-400 font-black text-sm">G</div>
            </div>
            <span className="text-base font-bold tracking-widest uppercase bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Ganesha Arena</span>
          </div>

          {/* Slogan Dengan Tipografi Elegan */}
          <div className="relative z-10 my-auto space-y-5">
            <div className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-500/10 px-3 py-1 border border-emerald-500/20 text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">
              ⚡ Smart Booking System
            </div>
            <h1 className="text-4xl font-black leading-[1.15] tracking-tight text-white">
              Langkah Instan <br />
              Menuju <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Performa Prima.</span>
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Rasakan kemudahan menyewa lapangan olahraga berstandar internasional dalam hitungan detik.
            </p>
          </div>

          {/* Footer Sisi Kiri */}
          <div className="relative z-10 flex justify-between text-[10px] font-medium tracking-wider text-slate-500 border-t border-slate-900/60 pt-4 uppercase">
            <span>© 2026 Ganesha Sport</span>
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span> Server Secured</span>
          </div>
        </div>

        {/* ================= SISI KANAN: DYNAMIC AUTH FORM ================= */}
        <div className="flex w-full flex-col justify-center p-8 sm:p-14 md:w-1/2 bg-slate-950/40 relative">
          
          <div className="w-full max-w-sm mx-auto">
            
            {/* Header Judul */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold tracking-tight text-white mb-1.5">Akses Akun Anda</h3>
              <p className="text-xs text-slate-400">Silakan masuk menggunakan kredensial yang sudah terdaftar</p>
            </div>

            {/* Alert Error Berdesain Kaca Merah */}
            {error && (
              <div className="mb-6 flex items-center space-x-2.5 rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-xs text-red-400 animate-pulse">
                <span className="flex h-1.5 w-1.5 rounded-full bg-red-500"></span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* KOLOM INPUT EMAIL DENGAN FLOATING LABEL EFFECT */}
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onFocus={() => setFocusEmail(true)}
                  onBlur={() => setFocusEmail(false)}
                  onChange={handleChange}
                  className="peer w-full rounded-xl bg-slate-950/60 border border-slate-800/80 p-3.5 text-sm text-white placeholder-transparent focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-300 shadow-inner"
                  placeholder="Email"
                />
                <label 
                  className={`absolute left-3.5 pointer-events-none transition-all duration-300 text-xs tracking-wide uppercase font-medium
                    ${focusEmail || formData.email 
                      ? '-top-2.5 px-1.5 bg-[#070e1e] text-emerald-400 scale-90' 
                      : 'top-4 text-slate-500 scale-100'
                    }`}
                >
                  Alamat Email
                </label>
              </div>

              {/* KOLOM INPUT PASSWORD DENGAN FLOATING LABEL EFFECT */}
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onFocus={() => setFocusPassword(true)}
                  onBlur={() => setFocusPassword(false)}
                  onChange={handleChange}
                  className="peer w-full rounded-xl bg-slate-950/60 border border-slate-800/80 p-3.5 text-sm text-white placeholder-transparent focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-300 shadow-inner"
                  placeholder="Password"
                />
                <label 
                  className={`absolute left-3.5 pointer-events-none transition-all duration-300 text-xs tracking-wide uppercase font-medium
                    ${focusPassword || formData.password 
                      ? '-top-2.5 px-1.5 bg-[#070e1e] text-emerald-400 scale-90' 
                      : 'top-4 text-slate-500 scale-100'
                    }`}
                >
                  Kata Sandi
                </label>
              </div>

              {/* Opsi Tambahan Form */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center space-x-2.5 cursor-pointer group text-slate-400 hover:text-slate-300 transition">
                  <input type="checkbox" id="remember" className="rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-0 focus:ring-offset-0 h-4 w-4 transition-all duration-200" />
                  <span className="select-none">Ingat sesi saya</span>
                </label>
                <a href="#" className="font-medium text-slate-400 hover:text-emerald-400 transition-all duration-300">Lupa sandi?</a>
              </div>

              {/* TOMBOL SIGN IN PREMIUM (NEON HOVER EFFECT) */}
              <button
                type="submit"
                disabled={loading}
                className="relative flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 p-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400 active:scale-[0.98] transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none overflow-hidden mt-8"
              >
                {/* Efek kilatan cahaya menyapu saat hover */}
                <div className="absolute inset-0 w-1/2 h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-shine"></div>

                {loading ? (
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="tracking-wide">Menyelaraskan Sesi...</span>
                  </span>
                ) : (
                  <span className="tracking-wider uppercase">Masuk Aplikasi</span>
                )}
              </button>
            </form>

            {/* Link Pendaftaran Bawah */}
            <div className="mt-10 text-center">
              <p className="text-xs text-slate-500 tracking-wide">
                Belum punya akun? <a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); }} className="font-medium text-emerald-400 hover:text-emerald-300 transition">Daftar sekarang</a>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}