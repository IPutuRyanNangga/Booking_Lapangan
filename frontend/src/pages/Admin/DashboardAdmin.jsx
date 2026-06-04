import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('Overview');
  
  // State Data Backend Admin
  const [adminInfo, setAdminInfo] = useState({ name: 'Admin Ganesha', role: 'Super Admin' });
  const [allBookings, setAllBookings] = useState([]);
  const [courts, setCourts] = useState([]);
  const [users, setUsers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  
  const [stats, setStats] = useState({ totalRevenue: 0, pendingApproval: 0, totalCourts: 0, totalUsers: 0 });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const API_BASE_URL = 'http://localhost:5173/admin'; // Endpoint base admin Anda

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchAllAdminData = async () => {
      try {
        setLoading(true);
        // Ambil data statistik & pemesanan (Overview & Kelola Pemesanan)
        const response = await fetch(`${API_BASE_URL}/dashboard`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setAllBookings(data.bookings || []);
          setCourts(data.courts || [
            { id: 1, name: 'Court A (Vinyl)', type: 'Vinyl Premium', price: 50000, status: 'Aktif' },
            { id: 2, name: 'Court B (Parquet)', type: 'Wood Parquet', price: 60000, status: 'Aktif' },
            { id: 3, name: 'Court C (Interlock)', type: 'Interlock Polypropylene', price: 45000, status: 'Perbaikan' },
          ]);
          setUsers(data.users || [
            { id: 1, name: 'Ryan Nangga', email: 'ryan@undiksha.ac.id', role: 'Premium Member' },
            { id: 2, name: 'Putu Aris', email: 'aris@gmail.com', role: 'User' }
          ]);
          setSchedules(data.schedules || [
            { id: 101, court: 'Court A (Vinyl)', time: '08:00 - 09:00', status: 'Buka' },
            { id: 102, court: 'Court A (Vinyl)', time: '09:00 - 10:00', status: 'Tutup' }
          ]);

          setStats({
            totalRevenue: data.total_revenue || 1250000,
            pendingApproval: data.pending_count || data.bookings?.filter(b => b.status === 'Pending').length || 1,
            totalCourts: data.courts_count || 3,
            totalUsers: data.users_count || 2
          });
          if (data.admin) setAdminInfo(data.admin);
        } else if (response.status === 403) {
          alert('Akses ditolak! Anda bukan admin.');
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllAdminData();
  }, [token, navigate]);

  // Handler Aksi Pemesanan (Setujui / Tolak)
  const handleApproveBooking = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert('Booking berhasil disetujui!');
        setAllBookings(allBookings.map(b => b.id === id ? { ...b, status: 'Disetujui' } : b));
      }
    } catch (e) { alert('Aksi gagal.'); }
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
              { id: 'Jadwal', name: 'Kelola Jadwal', icon: '📅' },
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
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Daftar Lapangan Ganesha Arena</h3>
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
                    <th className="p-4">Jenis Material</th>
                    <th className="p-4">Harga / Jam</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-xs text-slate-300 font-medium">
                  {courts.map(c => (
                    <tr key={c.id} className="hover:bg-slate-900/10">
                      <td className="p-4 pl-6 font-mono text-slate-500">{c.id}</td>
                      <td className="p-4 text-white font-bold">{c.name}</td>
                      <td className="p-4">{c.type}</td>
                      <td className="p-4 font-mono text-[#10b981]">Rp {c.price.toLocaleString('id-ID')}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${c.status === 'Aktif' ? 'bg-emerald-950/40 text-[#10b981]' : 'bg-red-950/40 text-red-400'}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right space-x-2">
                        <button className="text-cyan-400 hover:underline">Edit</button>
                        <button className="text-red-400 hover:underline">Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ================= IF: KELOLA JADWAL ================= */}
          {activeMenu === 'Jadwal' && (
            <div className="bg-[#0b111e]/40 border border-slate-800/60 rounded-2xl shadow-xl overflow-hidden animate-fade-in">
              <div className="p-4 border-b border-slate-800/60 bg-slate-900/20">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Konfigurasi Jam Operasional</h3>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/40 border-b border-slate-800 text-[10px] font-bold uppercase text-slate-500">
                    <th className="p-4 pl-6">ID Slot</th>
                    <th className="p-4">Target Lapangan</th>
                    <th className="p-4">Durasi Jam</th>
                    <th className="p-4">Kondisi Slot</th>
                    <th className="p-4 pr-6 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-xs text-slate-300 font-medium">
                  {schedules.map(s => (
                    <tr key={s.id} className="hover:bg-slate-900/10">
                      <td className="p-4 pl-6 font-mono text-slate-500">{s.id}</td>
                      <td className="p-4 font-bold text-white">{s.court}</td>
                      <td className="p-4 font-mono">{s.time}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${s.status === 'Buka' ? 'bg-emerald-950/40 text-[#10b981]' : 'bg-red-950/40 text-red-400'}`}>
                          {s.status === 'Buka' ? 'Buka (Public)' : 'Ditutup Admin'}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button className="text-amber-400 font-bold hover:underline">
                          {s.status === 'Buka' ? '🔒 Tutup Slot' : '🔓 Buka Slot'}
                        </button>
                      </td>
                    </tr>
                  ))}
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
                    <th className="p-4 pr-6 text-right">Verifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-xs text-slate-300 font-medium">
                  {allBookings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-900/10">
                      <td className="p-4 pl-6 font-mono font-bold text-white">{b.id || b.booking_code}</td>
                      <td className="p-4 font-semibold">{b.user_name || b.user?.name || 'Customer'}</td>
                      <td className="p-4">
                        <span className="block font-bold">{b.tanggal || b.date}</span>
                        <span className="text-[10px] text-slate-500">{b.lapangan || b.court_name} ({b.jam || b.time_slot})</span>
                      </td>
                      <td className="p-4 uppercase text-slate-400 font-mono font-bold">{b.payment_method || 'CASH'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${b.status === 'Disetujui' || b.status === 'approved' ? 'bg-emerald-950/40 text-[#10b981]' : 'bg-amber-950/40 text-amber-400'}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        {(b.status === 'Pending' || b.status === 'Menunggu Persetujuan') && (
                          <button onClick={() => handleApproveBooking(b.id)} className="bg-[#10b981] text-[#070b13] font-bold text-[10px] uppercase px-2.5 py-1.5 rounded-lg">
                            ✓ Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
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