import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('Overview');
  const [filterDate, setFilterDate] = useState('');
  const [courtType, setCourtType] = useState('Vinyl');
  
  // State Data Backend Admin
  const [adminInfo, setAdminInfo] = useState({ name: 'Admin Ganesha', role: 'Super Admin' });
  const [allBookings, setAllBookings] = useState([]);
  const [courts, setCourts] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [stats, setStats] = useState({ totalRevenue: 0, pendingApproval: 0, totalCourts: 0, totalUsers: 0 });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const API_BASE_URL = 'http://127.0.0.1:8000/api'; 

  const fetchData = async () => {
    try {
      setLoading(true);

      const [fieldsRes, usersRes, bookingsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/fields`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${API_BASE_URL}/users`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${API_BASE_URL}/bookings`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const fieldsData = fieldsRes.ok ? await fieldsRes.json() : [];
      const usersData = usersRes.ok ? await usersRes.json() : [];
      
      let bookingsData = [];
      if (bookingsRes.ok) {
        const rawBookings = await bookingsRes.json();
        bookingsData = Array.isArray(rawBookings) ? rawBookings : rawBookings.data || [];
      }

      setCourts(fieldsData);
      setUsers(usersData);
      setAllBookings(bookingsData);

      setStats({
        totalRevenue: bookingsData.reduce(
          (sum, booking) => sum + Number(booking.total_harga || 0),
          0
        ),
        pendingApproval: bookingsData.filter(
          (booking) => booking.status?.toLowerCase() === "pending"
        ).length,
        totalCourts: fieldsData.length,
        totalUsers: usersData.length,
      });

      setAdminInfo({
        name: "Administrator",
        role: "Admin",
      });
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchData();
  }, [token, navigate]);

  // PERBAIKAN: Handler Status disesuaikan dengan nilai ENUM Database ('confirmed' / 'cancelled')
  const handleUpdateStatusBooking = async (id, statusBaru) => {
    const teksTampilan = statusBaru === 'confirmed' ? 'DISETUJUI' : 'DIBATALKAN';
    const konfirmasi = window.confirm(`Apakah Anda yakin ingin merubah status transaksi #${id} menjadi [${teksTampilan}]?`);
    if (!konfirmasi) return;

    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: statusBaru }) 
      });

      if (response.ok) {
        alert(`Transaksi #${id} berhasil diperbarui!`);
        fetchData(); 
      } else {
        const err = await response.json();
        alert(`Gagal memproses aksi: ${err.message || 'Kesalahan Server'}`);
      }
    } catch (e) { 
      console.error(e);
      alert('Koneksi sistem terputus.'); 
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="h-screen w-screen bg-[#070b13] font-sans text-slate-100 overflow-hidden flex relative select-none">
      
      {/* BACKGROUND GLOW EFFECTS */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[#10b981]/5 blur-[140px] pointer-events-none"></div>

      {/* ================= 1. SIDEBAR NAVIGATION ================= */}
      <aside className="w-64 bg-[#0b111e]/60 border-r border-slate-800/60 flex flex-col justify-between p-6 z-10 shrink-0">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-slate-900 border border-[#10b981]/40 rounded-xl flex items-center justify-center font-bold text-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              G
            </div>
            <span className="font-bold text-xs tracking-widest text-slate-200 uppercase">
              GANESHA <span className="text-[#10b981]">PANEL</span>
            </span>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'Overview', name: 'Overview', icon: '📊' },
              { id: 'Lapangan', name: 'Kelola Lapangan', icon: '🏟️' }, 
              { id: 'Pemesanan', name: 'Kelola Pemesanan', icon: '📝' },
              { id: 'Pengguna', name: 'Kelola Pengguna', icon: '👥' }
            ].map((menu) => (
              <button
                key={menu.id}
                onClick={() => setActiveMenu(menu.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeMenu === menu.id
                    ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                    : 'text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'
                }`}
              >
                <span>{menu.icon}</span>
                <span>{menu.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-950/20 transition-all duration-200"
        >
          🚪 Keluar Aplikasi
        </button>
      </aside>

      {/* ================= 2. MAIN WORKSPACE AREA ================= */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER PANEL */}
        <header className="h-20 border-b border-slate-800/60 bg-[#0b111e]/20 backdrop-blur-xl px-8 flex items-center justify-between z-10 shrink-0">
          <div>
            <h1 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ganesha Admin Panel</h1>
            <p className="text-xs text-[#10b981] font-bold uppercase mt-0.5">Menu: {activeMenu}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-bold text-slate-200 block">{adminInfo.name}</span>
              <span className="text-[9px] text-[#10b981] font-bold uppercase tracking-widest">{adminInfo.role}</span>
            </div>
            <div className="h-9 w-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 uppercase">
              A
            </div>
          </div>
        </header>

        {/* CONTROLLER RENDER VIEW */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto z-10 space-y-6 custom-scrollbar w-full">
          
          {/* ================= IF: OVERVIEW ================= */}
          {activeMenu === 'Overview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-[#0b111e]/40 border border-slate-800/60 p-5 rounded-2xl shadow-lg">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Total Pemasukan</span>
                  <span className="text-xl font-black text-[#10b981]">Rp {stats.totalRevenue.toLocaleString('id-ID')}</span>
                </div>
                <div className="bg-[#0b111e]/40 border border-slate-800/60 p-5 rounded-2xl shadow-lg">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Butuh Verifikasi</span>
                  <span className="text-xl font-black text-amber-400">{stats.pendingApproval} Invoice</span>
                </div>
                <div className="bg-[#0b111e]/40 border border-slate-800/60 p-5 rounded-2xl shadow-lg">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Jumlah Lapangan</span>
                  <span className="text-xl font-black text-white">{stats.totalCourts} Lapangan</span>
                </div>
                <div className="bg-[#0b111e]/40 border border-slate-800/60 p-5 rounded-2xl shadow-lg">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Total User</span>
                  <span className="text-xl font-black text-cyan-400">{stats.totalUsers} Atlet</span>
                </div>
              </div>
              <div className="bg-[#0b111e]/20 border border-slate-800/40 p-6 rounded-2xl text-xs font-semibold text-slate-500">
                📊 Silakan gunakan menu bilah samping kiri untuk memanipulasi data lapangan secara spesifik.
              </div>
            </div>
          )}

          {/* ================= IF: KELOLA LAPANGAN ================= */}
          {activeMenu === 'Lapangan' && (
            <div className="bg-[#0b111e]/40 border border-slate-800/60 rounded-2xl shadow-xl overflow-hidden animate-fade-in">
              <div className="p-4 border-b border-slate-800/60 bg-slate-900/20 flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Daftar Lapangan Ganesha Arena
                </h3>
                <button
                  onClick={() => navigate('/admin/fields/create')}
                  className="bg-[#10b981] text-[#070b13] font-bold text-[10px] uppercase px-3 py-1.5 rounded-lg"
                >
                  + Lapangan Baru
                </button>
              </div>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/40 border-b border-slate-800 text-[10px] font-bold uppercase text-slate-500">
                    <th className="p-4 pl-6">ID</th>
                    <th className="p-4">Nama Lapangan</th>
                    <th className="p-4">Jenis Olahraga</th>
                    <th className="p-4">Harga / Jam</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-xs text-slate-300 font-medium">
                  {courts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-6 text-center text-slate-500">
                        Belum ada data lapangan
                      </td>
                    </tr>
                  ) : (
                    courts.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-900/10">
                        <td className="p-4 pl-6 font-mono text-slate-500">{c.id}</td>
                        <td className="p-4 text-white font-bold">{c.nama_lapangan}</td>
                        <td className="p-4">{c.jenis_olahraga}</td>
                        <td className="p-4 font-mono text-[#10b981]">
                          Rp {Number(c.harga_per_jam || 0).toLocaleString('id-ID')}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${c.status ? 'bg-emerald-950/40 text-[#10b981]' : 'bg-red-950/40 text-red-400'}`}>
                            {c.status ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right space-x-2">
                          <button className="text-cyan-400 hover:underline">Edit</button>
                          <button className="text-red-400 hover:underline">Hapus</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ================= IF: KELOLA PEMESANAN ================= */}
          {activeMenu === 'Pemesanan' && (
            <div className="bg-[#0b111e]/40 border border-slate-800/60 rounded-2xl shadow-xl overflow-hidden animate-fade-in">
              <div className="p-4 border-b border-slate-800/60 bg-slate-900/20">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Validasi Pembayaran Sewa</h3>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/40 border-b border-slate-800 text-[10px] font-bold uppercase text-slate-500">
                    <th className="p-4 pl-6">Kode Invoice</th>
                    <th className="p-4">Nama User</th>
                    <th className="p-4">Detail Booking</th>
                    <th className="p-4">Metode</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-center">Verifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-xs text-slate-300 font-medium">
                  {allBookings.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-6 text-center text-slate-500">Belum ada transaksi sewa lapangan.</td>
                    </tr>
                  ) : (
                    allBookings.map(b => (
                      <tr key={b.id} className="hover:bg-slate-900/10">
                        <td className="p-4 pl-6 font-mono font-bold text-white">#{b.id}</td>
                        <td className="p-4 font-semibold">{b.user?.name || b.user_name || 'Customer'}</td>
                        <td className="p-4">
                          <span className="block font-bold text-slate-300">{b.field?.nama_lapangan || b.court_name || 'Lapangan'}</span>
                          <span className="text-[10px] text-slate-500">{b.tanggal} ({b.jam_mulai} - {b.jam_selesai})</span>
                        </td>
                        <td className="p-4 uppercase text-slate-400 font-mono font-bold">{b.payment_method || 'CASH'}</td>
                        <td className="p-4">
                          {/* PERBAIKAN: Mapping teks visual ENUM database ('confirmed'/'cancelled') agar di UI tetap muncul teks Indonesia */}
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            b.status?.toLowerCase() === 'confirmed' || b.status?.toLowerCase() === 'success' || b.status?.toLowerCase() === 'disetujui'
                              ? 'bg-emerald-950/40 text-[#10b981]' 
                              : b.status?.toLowerCase() === 'cancelled' || b.status?.toLowerCase() === 'dibatalkan' || b.status?.toLowerCase() === 'rejected'
                              ? 'bg-red-950/40 text-red-400'
                              : 'bg-amber-950/40 text-amber-400'
                          }`}>
                            {b.status?.toLowerCase() === 'confirmed' ? 'Disetujui' : b.status?.toLowerCase() === 'cancelled' ? 'Dibatalkan' : b.status}
                          </span>
                        </td>
                        
                        <td className="p-4 pr-6 text-center">
                          {b.status?.toLowerCase() === 'pending' ? (
                            <div className="flex items-center justify-center gap-2">
                              {/* PERBAIKAN UTAMA: Mengirimkan kata kunci 'confirmed' & 'cancelled' sesuai list ENUM MySQL */}
                              <button 
                                onClick={() => handleUpdateStatusBooking(b.id, 'confirmed')} 
                                className="bg-[#10b981] hover:bg-emerald-600 text-[#070b13] font-bold text-[10px] px-2.5 py-1 rounded-lg transition-all"
                              >
                                ✓ Setujui
                              </button>
                              <button 
                                onClick={() => handleUpdateStatusBooking(b.id, 'cancelled')} 
                                className="bg-red-950/40 hover:bg-red-900/40 text-red-400 border border-red-900/40 font-bold text-[10px] px-2.5 py-1 rounded-lg transition-all"
                              >
                                ✕ Tolak
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-600 font-semibold italic">Diverifikasi</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ================= IF: KELOLA PENGGUNA ================= */}
          {activeMenu === 'Pengguna' && (
            <div className="bg-[#0b111e]/40 border border-slate-800/60 rounded-2xl shadow-xl overflow-hidden animate-fade-in">
              <div className="p-4 border-b border-slate-800/60 bg-slate-900/20">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Database Akun Atlet Member</h3>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/40 border-b border-slate-800 text-[10px] font-bold uppercase text-slate-500">
                    <th className="p-4 pl-6">ID User</th>
                    <th className="p-4">Nama Lengkap</th>
                    <th className="p-4">Alamat Email</th>
                    <th className="p-4">Role Status</th>
                    <th className="p-4 pr-6 text-right">Manajemen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-xs text-slate-300 font-medium">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-900/10">
                      <td className="p-4 pl-6 font-mono text-slate-500">{u.id}</td>
                      <td className="p-4 text-white font-bold">{u.name}</td>
                      <td className="p-4 font-mono text-slate-400">{u.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${u.role === 'Premium Member' ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-500/20' : 'bg-slate-800 text-slate-400'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button onClick={() => alert(`Ubah role untuk ${u.name}`)} className="text-[#10b981] hover:underline font-bold">
                          Ubah Role
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};

export default AdminDashboard;