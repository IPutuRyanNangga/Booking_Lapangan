import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('Beranda');
  const [filterDate, setFilterDate] = useState('');
  const [courtType, setCourtType] = useState('Vinyl');
  
  // State data backend
  const [user, setUser] = useState({ name: 'Loading...', email: '', role: 'User' });
  const [activeBookings, setActiveBookings] = useState([]);
  const [stats, setStats] = useState({ totalMain: 0, trackExpiry: '31 Des 2026' });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const API_BASE_URL = 'https://supreme-winner-v6p5v77jv9p5cw5qr-8000.app.github.dev/api'; // Sesuaikan URL backend Anda

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // 1. Fetch Data Profile User
        const profileResponse = await fetch(`${API_BASE_URL}/user`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!profileResponse.ok) throw new Error('Session habis');
        const profileData = await profileResponse.json();
        setUser(profileData.user || profileData); 
        localStorage.setItem('user', JSON.stringify(profileData.user || profileData));

        // 2. Fetch Data Reservasi Aktif
        const bookingsResponse = await fetch(`${API_BASE_URL}/bookings`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          
          // PERBAIKAN: Menangani respons array langsung dari Laravel Controller index()
          const cleanBookings = Array.isArray(bookingsData) 
            ? bookingsData 
            : bookingsData.bookings || bookingsData.data || [];

          setActiveBookings(cleanBookings);
          setStats({
            totalMain: cleanBookings.length,
            trackExpiry: bookingsData.membership_expiry || '31 Des 2026'
          });
        }

      } catch (error) {
        console.error('Error:', error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="h-screen w-screen bg-[#070b13] font-sans text-slate-100 overflow-hidden flex flex-col relative select-none">
      
      {/* BACKGROUND GLOW EFFECTS */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[#10b981]/5 blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-[#06b6d4]/5 blur-[140px] pointer-events-none"></div>

      {/* ================= HEADER / NAVBAR ================= */}
      <header className="h-20 border-b border-slate-800/60 bg-[#0b111e]/40 backdrop-blur-xl px-6 md:px-10 flex items-center justify-between z-10 shrink-0">
        <div 
          onClick={() => { setActiveMenu('Beranda'); navigate('/dashboard'); }} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="h-9 w-9 bg-slate-900 border border-[#10b981]/40 rounded-xl flex items-center justify-center font-bold text-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.15)] group-hover:border-[#10b981] transition-all duration-300">
            G
          </div>
          <span className="font-bold text-sm tracking-widest text-slate-200 uppercase">
            Ganesha <span className="text-[#10b981]">Arena</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-400">
          <button
            onClick={() => { setActiveMenu('Beranda'); navigate('/dashboard'); }}
            className={`transition-all duration-300 pb-1 ${
              activeMenu === 'Beranda' 
                ? 'text-[#10b981] border-b-2 border-[#10b981] drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]' 
                : 'hover:text-slate-200'
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => { setActiveMenu('Jadwal Lapangan'); navigate('/jadwal'); }}
            className={`transition-all duration-300 pb-1 ${
              activeMenu === 'Jadwal Lapangan' 
                ? 'text-[#10b981] border-b-2 border-[#10b981] drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]' 
                : 'hover:text-slate-200'
            }`}
          >
            Jadwal Lapangan
          </button>
          <button
            onClick={() => { setActiveMenu('Fasilitas VIP'); navigate('/fasilitas'); }}
            className={`transition-all duration-300 pb-1 ${
              activeMenu === 'Fasilitas VIP' 
                ? 'text-[#10b981] border-b-2 border-[#10b981] drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]' 
                : 'hover:text-slate-200'
            }`}
          >
            Fasilitas VIP
          </button>
          <button
            onClick={() => { setActiveMenu('Tarif Sewa'); navigate('/tarif'); }}
            className={`transition-all duration-300 pb-1 ${
              activeMenu === 'Tarif Sewa' 
                ? 'text-[#10b981] border-b-2 border-[#10b981] drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]' 
                : 'hover:text-slate-200'
            }`}
          >
            Tarif Sewa
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <div 
            onClick={() => navigate('/profil')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="flex flex-col text-right">
              <span className="text-xs font-bold text-slate-200 group-hover:text-[#10b981] transition-colors duration-200">
                {user.name}
              </span>
              <span className="text-[10px] text-[#10b981] font-semibold tracking-wider uppercase">
                {user.role || 'Member'}
              </span>
            </div>
            <div className="h-9 w-9 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-[#10b981]/50 flex items-center justify-center text-xs font-bold text-slate-300 uppercase transition-all duration-300 shadow-inner">
              {user.name ? user.name.charAt(0) : 'U'}
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="text-xs font-bold text-red-400 hover:text-red-300 bg-red-950/20 border border-red-900/30 hover:border-red-500/40 px-3 py-1.5 rounded-xl transition-all duration-300"
          >
            Keluar
          </button>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch overflow-hidden z-10 w-full">
        
        {/* LEFT COLUMN: HERO & BOOKING ENGINE */}
        <div className="lg:col-span-7 flex flex-col gap-6 h-full">
          
          {/* Welcome Banner Card */}
          <div className="flex-1 bg-gradient-to-br from-[#0c1424] to-[#080d18] border border-slate-800/80 rounded-2xl p-8 shadow-2xl relative overflow-hidden group flex flex-col justify-center">
            <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-[#10b981]/5 blur-3xl group-hover:bg-[#10b981]/10 transition-all duration-500"></div>
            
            <div className="self-start inline-flex items-center gap-2 bg-[#10b981]/10 border border-[#10b981]/20 rounded-full px-3 py-1 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
              <span className="text-[10px] font-bold text-[#10b981] uppercase tracking-widest">Smart Booking System</span>
            </div>

            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Langkah Instan Menuju <br />
              <span className="bg-gradient-to-r from-[#10b981] to-[#06b6d4] bg-clip-text text-transparent">Performa Prima.</span>
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-4 max-w-xl font-medium leading-relaxed">
              Rasakan kemudahan menyewa lapangan olahraga berstandar internasional dalam hitungan detik. Pantau semua aktivitas latihan Anda di sini.
            </p>
          </div>

          {/* Interactive Fast-Booking Widget */}
          <div className="bg-[#0b111e]/40 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-6 shadow-xl space-y-4 shrink-0">
            <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">Cek Slot Ketersediaan Lapangan</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Pilih Tanggal Main</label>
                <input 
                  type="date" 
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full bg-[#05080f] border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-300 font-medium focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981]/20 transition-all [color-scheme:dark]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tipe Lapangan / Material</label>
                <select 
                  value={courtType}
                  onChange={(e) => setCourtType(e.target.value)}
                  className="w-full bg-[#05080f] border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-300 font-medium focus:outline-none focus:border-[#10b981] transition-all"
                >
                  <option value="Vinyl">Vinyl Interlock Premium</option>
                  <option value="Sintetis">Rumput Sintetis Jepang</option>
                  <option value="Parquet">Kayu Parquet Standar BWF</option>
                </select>
              </div>
            </div>

            <button 
              onClick={() => navigate('/jadwal')}
              className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] text-[#070b13] font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 active:scale-[0.99]"
            >
              Cari Lapangan Tersedia
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: ANALYTICS & RESERVATION TABLE */}
        <div className="lg:col-span-5 flex flex-col gap-6 h-full">
          
          {/* Statistics Grid */}
          <div className="grid grid-cols-2 gap-4 shrink-0">
            <div className="bg-[#0b111e]/40 border border-slate-800/60 p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Total Main</span>
              {/* PERBAIKAN: Mengganti teks manual statis menjadi dinamis dari data server */}
              <span className="text-2xl font-extrabold text-white">{stats.totalMain} Sesi</span>
            </div>
            <div className="bg-[#0b111e]/40 border border-slate-800/60 p-6 rounded-2xl shadow-lg flex flex-col justify-center items-center text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Masa Aktif</span>
              <span className="text-sm font-bold text-[#10b981] tracking-wide mt-2">{stats.trackExpiry}</span>
            </div>
          </div>

          {/* Live Data Booking Status Table */}
          <div className="flex-1 bg-[#0b111e]/40 border border-slate-800/60 rounded-2xl shadow-xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-800/60 bg-slate-900/20 flex items-center justify-between shrink-0">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Status Reservasi Anda</h4>
              <span className="h-2 w-2 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]"></span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 custom-scrollbar">
              {loading ? (
                <div className="p-8 text-center text-xs text-slate-500 font-medium tracking-wider">
                  Menghubungkan ke server Ganesha Arena...
                </div>
              ) : activeBookings.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 font-medium tracking-wider">
                  Belum ada riwayat reservasi aktif.
                </div>
              ) : (
                activeBookings.map((booking) => (
                  <div key={booking.id} className="p-4 hover:bg-slate-900/20 transition-all flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-400 font-bold">#{booking.id}</span>
                        {/* PERBAIKAN: Menyesuaikan properti nama lapangan hasil eager loading (booking.field.nama_lapangan) */}
                        <span className="text-[10px] text-slate-500 font-semibold truncate">• {booking.field?.nama_lapangan || 'Lapangan'}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-200 mt-1">
                        {/* PERBAIKAN: Menyelaraskan key penamaan variabel waktu jam_mulai & jam_selesai */}
                        {booking.tanggal} <span className="text-slate-500 font-normal ml-1">({booking.jam_mulai} - {booking.jam_selesai})</span>
                      </div>
                    </div>
                    
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border shrink-0 ${
                      (booking.status === 'Disetujui' || booking.status === 'approved' || booking.status === 'Success' || booking.status === 'PENDING')
                        ? 'bg-emerald-950/30 text-[#10b981] border-emerald-500/20'
                        : 'bg-amber-950/30 text-amber-400 border-amber-500/20'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="h-10 border-t border-slate-800/40 bg-[#05080f] px-6 flex items-center justify-between text-[10px] text-slate-600 font-medium z-10 shrink-0">
        <span>© 2026 GANESHA SPORT APP</span>
        <span className="tracking-widest text-[#10b981]/60">SERVER SECURED</span>
      </footer>

    </div>
  );
};

export default Dashboard;