import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const JadwalLapangan = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCourt, setSelectedCourt] = useState('All');
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);

  // STATE BARU: Menampung daftar slot yang sedang dipilih (Keranjang Sementara)
  const [cart, setCart] = useState([]);

  const token = localStorage.getItem('token');
  const API_BASE_URL = 'http://localhost:8000/api'; 

  const timeSlots = [
    '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
    '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00',
    '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00'
  ];

  const courts = [
    { id: 'court-a', name: 'Court A (Vinyl)' },
    { id: 'court-b', name: 'Court B (Parquet)' },
    { id: 'court-c', name: 'Court C (Interlock)' },
  ];

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/schedules?date=${selectedDate}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const resData = await response.json();
          setScheduleData(resData.schedules || resData.data || []);
        }
      } catch (error) {
        console.error('Error fetching schedules:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [selectedDate, token, navigate]);

  const checkSlotStatus = (courtName, timeSlot) => {
    const isBooked = scheduleData.some(
      (session) => 
        (session.court_name === courtName || session.lapangan === courtName) && 
        (session.time_slot === timeSlot || session.jam === timeSlot)
    );
    return isBooked ? 'BOOKED' : 'AVAILABLE';
  };

  // FUNGSI BARU: Handle klik slot (Tambah ke keranjang atau hapus jika diklik lagi)
  const handleSlotClick = (courtName, timeSlot) => {
    const slotId = `${selectedDate}-${courtName}-${timeSlot}`;
    
    // Cek apakah slot ini sudah ada di keranjang
    const isAlreadyInCart = cart.some(item => item.id === slotId);

    if (isAlreadyInCart) {
      // Jika sudah ada, hapus dari keranjang (Unselect)
      setCart(cart.filter(item => item.id !== slotId));
    } else {
      // Jika belum ada, masukkan ke keranjang
      const newBookingItem = {
        id: slotId,
        tanggal: selectedDate,
        lapangan: courtName,
        jam: timeSlot,
        harga: 50000 // Contoh harga statis per jam, bisa disesuaikan dari backend nanti
      };
      setCart([...cart, newBookingItem]);
    }
  };

  // FUNGSI BARU: Checkout keranjang dan kirim data ke halaman pembayaran
  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // Alihkan ke halaman pembayaran sambil membawa data item keranjang lewat state React Router
    navigate('/pembayaran', { state: { items: cart } });
  };

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
            JADWAL <span className="text-[#10b981]">LAPANGAN</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-[#05080f] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-semibold focus:outline-none focus:border-[#10b981] [color-scheme:dark]"
          />
          <select
            value={selectedCourt}
            onChange={(e) => setSelectedCourt(e.target.value)}
            className="bg-[#05080f] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-semibold focus:outline-none focus:border-[#10b981]"
          >
            <option value="All">Semua Lapangan</option>
            {courts.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>
      </header>

      {/* ================= CONTENT BODY WRAPPER (Split Layout jika keranjang terisi) ================= */}
      <main className="flex-1 p-6 md:p-8 overflow-hidden z-10 w-full flex flex-col lg:flex-row gap-6 items-stretch">
        
        {/* PANEL JADWAL UTAMA */}
        <div className="flex-1 bg-[#0b111e]/40 border border-slate-800/60 rounded-2xl shadow-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800/60 bg-slate-900/20 flex items-center gap-4 text-xs font-bold uppercase tracking-wider shrink-0">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/20 border border-emerald-500"></span>
              <span className="text-emerald-400">Tersedia</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/20 border border-red-500"></span>
              <span className="text-red-400">Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
              <span className="text-white">Pilihan Anda</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            {loading ? (
              <div className="h-full w-full flex items-center justify-center text-xs text-slate-500 tracking-widest font-semibold uppercase">
                Sinkronisasi Jadwal Server...
              </div>
            ) : (
              <div className="space-y-8">
                {courts
                  .filter(court => selectedCourt === 'All' || court.name === selectedCourt)
                  .map((court) => (
                    <div key={court.id} className="space-y-3">
                      <h3 className="text-xs font-extrabold text-slate-400 tracking-widest uppercase flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]"></span>
                        {court.name}
                      </h3>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                        {timeSlots.map((slot) => {
                          const status = checkSlotStatus(court.name, slot);
                          const slotId = `${selectedDate}-${court.name}-${slot}`;
                          // Cek apakah slot ini sedang dipilih oleh user
                          const isSelected = cart.some(item => item.id === slotId);

                          return (
                            <button
                              key={slot}
                              disabled={status === 'BOOKED'}
                              onClick={() => handleSlotClick(court.name, slot)}
                              className={`p-4 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between h-20 ${
                                status === 'BOOKED'
                                  ? 'bg-red-950/10 border-red-900/30 text-red-400/40 cursor-not-allowed opacity-60'
                                  : isSelected
                                  ? 'bg-[#10b981] border-[#10b981] text-[#070b13] font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-[0.98]'
                                  : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-[#10b981]/60 hover:text-white'
                              }`}
                            >
                              <span className="text-xs font-bold font-mono tracking-wide">{slot}</span>
                              <span className="text-[9px] font-black tracking-widest uppercase self-end">
                                {status === 'BOOKED' ? '🔒 BOOKED' : isSelected ? '✓ terpilih' : '⚡ PILIH'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* ================= PANEL SIDEBAR KERANJANG RINGKAS (Muncul Hanya Jika Ada Item) ================= */}
        {cart.length > 0 && (
          <div className="w-full lg:w-80 bg-[#0b111e]/60 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between shadow-2xl shrink-0 animate-fade-in">
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Antrean Booking ({cart.length})</h4>
                <button onClick={() => setCart([])} className="text-[10px] text-red-400 hover:underline font-bold uppercase">Reset</button>
              </div>

              {/* List Item Pilihan User */}
              <div className="flex-1 overflow-y-auto py-3 space-y-3 custom-scrollbar pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="bg-[#05080f] border border-slate-800 p-3 rounded-xl relative group">
                    <button 
                      onClick={() => handleSlotClick(item.lapangan, item.jam)}
                      className="absolute top-2 right-2 text-slate-500 hover:text-red-400 text-xs font-bold"
                    >
                      ✕
                    </button>
                    <p className="text-[10px] text-[#10b981] font-bold uppercase tracking-wider">{item.lapangan}</p>
                    <p className="text-xs font-bold text-slate-200 mt-0.5">{item.jam}</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-1">Tanggal: {item.tanggal}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Harga Ringkas & Tombol Checkout */}
            <div className="pt-4 border-t border-slate-800 shrink-0 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-semibold">Total Estimasi:</span>
                <span className="text-base font-extrabold text-[#10b981]">
                  Rp {(cart.length * 50000).toLocaleString('id-ID')}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] text-[#070b13] font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300"
              >
                Lanjut Ke Pembayaran →
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

export default JadwalLapangan;