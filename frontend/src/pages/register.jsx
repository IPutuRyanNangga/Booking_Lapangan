import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // States untuk mendeteksi fokus input (Floating Label)
  const [focusName, setFocusName] = useState(false);
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
      // Menembak API store/register user milikmu di Laravel backend
      const response = await fetch('http://127.0.0.1:8000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal mendaftarkan akun.');
      }

      alert('Akun berhasil dibuat! Silakan masuk.');
      navigate('/login'); // Lempar user ke halaman login setelah sukses daftar
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#030712] font-sans text-slate-100 m-0 p-0 selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* 1. BACKGROUND PARTICLES */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[15%] left-[25%] h-2 w-2 rounded-full bg-teal-400/40 blur-[1px] animate-bounce duration-[5000ms]"></div>
        <div className="absolute top-[70%] left-[12%] h-3 w-3 rounded-full bg-emerald-400/30 blur-[2px] animate-pulse duration-[3500ms]"></div>
        <div className="absolute top-[85%] left-[50%] h-1.5 w-1.5 rounded-full bg-cyan-400/50 blur-[1px] animate-bounce duration-[9000ms]"></div>
        <div className="absolute top-[30%] right-[10%] h-3 w-3 rounded-full bg-teal-500/20 blur-[2px] animate-pulse duration-[6000ms]"></div>
      </div>

      {/* 2. GLOWING ORBS */}
      <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-teal-600/20 to-transparent blur-[120px] mix-blend-screen animate-pulse duration-[7000ms]"></div>
      <div className="absolute -left-32 -bottom-32 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-emerald-600/15 to-transparent blur-[140px] mix-blend-screen animate-pulse duration-[9000ms]"></div>

      {/* 3. CORE BOX CONTAINER */}
      <div className="relative z-10 flex h-full min-h-[620px] w-full max-w-4xl overflow-hidden rounded-[32px] border border-slate-800/80 bg-slate-950/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl m-4 transition-all duration-500 hover:border-slate-700/50">
        
        {/* ================= SISI KIRI: BRAND POSTER ================= */}
        <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-b from-[#020c08] via-[#051a1a] to-[#091122] p-12 md:flex border-r border-slate-900/60 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#081120_1px,transparent_1px),linear-gradient(to_bottom,#081120_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_60%,transparent_100%)] opacity-40"></div>
          <div className="absolute left-0 bottom-0 h-[2px] w-full bg-gradient-to-r from-transparent via-teal-500/40 to-transparent shadow-[0_0_15px_#14b8a6] opacity-70"></div>

          {/* Brand Logo */}
          <div className="relative z-10 flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/login')}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-500 via-emerald-500 to-teal-400 p-[1px] shadow-lg shadow-teal-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-slate-950 text-teal-400 font-black text-sm">G</div>
            </div>
            <span className="text-base font-bold tracking-widest uppercase bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Ganesha Arena</span>
          </div>

          {/* Slogan */}
          <div className="relative z-10 my-auto space-y-5">
            <div className="inline-flex items-center space-x-1.5 rounded-full bg-teal-500/10 px-3 py-1 border border-teal-500/20 text-[10px] font-semibold tracking-wider text-teal-400 uppercase">
              ✨ Join The Community
            </div>
            <h1 className="text-4xl font-black leading-[1.15] tracking-tight text-white">
              Mulai <br />
              Petualangan <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent">Olahragamu.</span>
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Dapatkan akses penuh ke pemesanan seluruh lapangan pilihan, promo eksklusif, dan jadwal bermain tanpa batasan.
            </p>
          </div>

          <div className="relative z-10 flex justify-between text-[10px] font-medium tracking-wider text-slate-500 border-t border-slate-900/60 pt-4 uppercase">
            <span>© 2026 Ganesha Sport</span>
            <span>Gate Alpha</span>
          </div>
        </div>

        {/* ================= SISI KANAN: DYNAMIC REGISTER FORM ================= */}
        <div className="flex w-full flex-col justify-center p-8 sm:p-14 md:w-1/2 bg-slate-950/40 relative">
          <div className="w-full max-w-sm mx-auto">
            
            <div className="mb-8">
              <h3 className="text-2xl font-bold tracking-tight text-white mb-1.5">Daftar Akun Baru</h3>
              <p className="text-xs text-slate-400">Lengkapi data diri Anda untuk membuka akses pemesanan</p>
            </div>

            {error && (
              <div className="mb-6 flex items-center space-x-2.5 rounded-xl bg-red-500/10 border border-red-500/20 p-3.5 text-xs text-red-400 animate-pulse">
                <span className="flex h-1.5 w-1.5 rounded-full bg-red-500"></span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* INPUT NAMA LENGKAP */}
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onFocus={() => setFocusName(true)}
                  onBlur={() => setFocusName(false)}
                  onChange={handleChange}
                  className="peer w-full rounded-xl bg-slate-950/60 border border-slate-800/80 p-3.5 text-sm text-white placeholder-transparent focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-all duration-300 shadow-inner"
                  placeholder="Nama Lengkap"
                />
                <label 
                  className={`absolute left-3.5 pointer-events-none transition-all duration-300 text-xs tracking-wide uppercase font-medium
                    ${focusName || formData.name 
                      ? '-top-2.5 px-1.5 bg-[#070e1e] text-teal-400 scale-90' 
                      : 'top-4 text-slate-500 scale-100'
                    }`}
                >
                  Nama Lengkap
                </label>
              </div>

              {/* INPUT EMAIL */}
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onFocus={() => setFocusEmail(true)}
                  onBlur={() => setFocusEmail(false)}
                  onChange={handleChange}
                  className="peer w-full rounded-xl bg-slate-950/60 border border-slate-800/80 p-3.5 text-sm text-white placeholder-transparent focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-all duration-300 shadow-inner"
                  placeholder="Email"
                />
                <label 
                  className={`absolute left-3.5 pointer-events-none transition-all duration-300 text-xs tracking-wide uppercase font-medium
                    ${focusEmail || formData.email 
                      ? '-top-2.5 px-1.5 bg-[#070e1e] text-teal-400 scale-90' 
                      : 'top-4 text-slate-500 scale-100'
                    }`}
                >
                  Alamat Email
                </label>
              </div>

              {/* INPUT PASSWORD */}
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onFocus={() => setFocusPassword(true)}
                  onBlur={() => setFocusPassword(false)}
                  onChange={handleChange}
                  className="peer w-full rounded-xl bg-slate-950/60 border border-slate-800/80 p-3.5 text-sm text-white placeholder-transparent focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-all duration-300 shadow-inner"
                  placeholder="Password"
                />
                <label 
                  className={`absolute left-3.5 pointer-events-none transition-all duration-300 text-xs tracking-wide uppercase font-medium
                    ${focusPassword || formData.password 
                      ? '-top-2.5 px-1.5 bg-[#070e1e] text-teal-400 scale-90' 
                      : 'top-4 text-slate-500 scale-100'
                    }`}
                >
                  Kata Sandi
                </label>
              </div>

              {/* Syarat & Ketentuan */}
              <div className="flex items-center space-x-2.5 cursor-pointer text-xs text-slate-400 pt-1">
                <input type="checkbox" required id="agree" className="rounded bg-slate-950 border-slate-800 text-teal-500 focus:ring-0 focus:ring-offset-0 h-4 w-4" />
                <label htmlFor="agree" className="select-none">Saya menyetujui seluruh Syarat & Ketentuan</label>
              </div>

              {/* BUTTON SUBMIT DAFTAR */}
              <button
                type="submit"
                disabled={loading}
                className="relative flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 p-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-teal-500/10 hover:shadow-teal-500/20 hover:from-teal-400 hover:to-emerald-400 active:scale-[0.98] transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none mt-8"
              >
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Mendaftarkan Akun...</span>
                  </span>
                ) : (
                  <span className="tracking-wider uppercase">Daftar Sekarang</span>
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-xs text-slate-500 tracking-wide">
                Sudah memiliki akun? <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className="font-semibold text-teal-400 hover:text-teal-300 hover:underline transition-all duration-300 ml-1">Masuk Aplikasi</a>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}