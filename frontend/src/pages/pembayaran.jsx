import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Pembayaran = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Menangkap data item yang dikirim dari halaman jadwal.jsx
  const bookingItems = location.state?.items || [];

  // State untuk memilih metode pembayaran
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL = 'https://supreme-winner-v6p5v77jv9p5cw5qr-8000.app.github.dev/api'; // Sesuaikan dengan URL backend Anda
  
  // Menghitung total bayar secara dinamis berdasarkan harga asli tiap lapangan dari database
  const totalBayar = bookingItems.reduce((sum, item) => sum + Number(item.harga || 0), 0);

  // Jika user iseng masuk ke /pembayaran tanpa memilih jadwal, kembalikan ke /jadwal
  if (bookingItems.length === 0) {
    return (
      <div className="h-screen w-screen bg-[#070b13] flex flex-col items-center justify-center text-slate-400 gap-4">
        <p className="text-sm font-semibold uppercase tracking-wider">Tidak ada antrean pembayaran.</p>
        <button onClick={() => navigate('/jadwal')} className="bg-[#10b981] text-[#070b13] font-bold text-xs px-4 py-2 rounded-xl">
          Pilih Jadwal Dulu
        </button>
      </div>
    );
  }

  // Fungsi Kirim Data Pembayaran Ke Backend
  const handleBayarSekarang = async () => {
    if (!paymentMethod) {
      alert('Silakan pilih metode pembayaran terlebih dahulu!');
      return;
    }

    try {
      setIsSubmitting(true);

      // PAYLOAD FIXED: Menggunakan .slice(0, 5) untuk mengubah format "HH:MM:SS" menjadi "HH:MM" agar lolos aturan Laravel
      const payload = {
        payment_method: paymentMethod, 
        items: bookingItems.map(item => ({
          field_id: item.field_id,
          tanggal: item.tanggal,
          jam_mulai: item.jam_mulai ? item.jam_mulai.slice(0, 5) : item.jam_mulai,
          jam_selesai: item.jam_selesai ? item.jam_selesai.slice(0, 5) : item.jam_selesai
        }))
      };

      const response = await fetch(`${API_BASE_URL}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json', // Proteksi agar error Laravel terbaca sebagai JSON, bukan HTML
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        alert('Booking Berhasil! Menunggu verifikasi pembayaran sistem Ganesha Arena.');
        navigate('/dashboard'); // Kembali ke dashboard setelah sukses
      } else {
        console.error('--- DETAIL ERROR VALIDASI LARAVEL 422 ---');
        console.error(data.errors || data);
        console.error('-----------------------------------------');

        const errorMessages = data.errors 
          ? Object.values(data.errors).flat().join('\n') 
          : data.message || 'Terjadi kesalahan server.';

        alert(`Gagal membuat pesanan (422):\n${errorMessages}`);
      }
    } catch (error) {
      console.error('Error saat melakukan checkout:', error);
      alert('Koneksi server terputus. Coba lagi beberapa saat.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#070b13] font-sans text-slate-100 overflow-hidden flex flex-col relative select-none">
      
      {/* BACKGROUND GLOW EFFECTS */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[#10b981]/5 blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-[#06b6d4]/5 blur-[140px] pointer-events-none"></div>

      {/* ================= HEADER ================= */}
      <header className="h-20 border-b border-slate-800/60 bg-[#0b111e]/40 backdrop-blur-xl px-6 md:px-10 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div onClick={() => navigate('/jadwal')} className="h-9 w-9 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center font-bold text-slate-400 hover:text-[#10b981] hover:border-[#10b981]/40 cursor-pointer transition-all">
            ←
          </div>
          <span className="font-bold text-sm tracking-widest text-slate-200 uppercase">
            KONFIRMASI <span className="text-[#10b981]">PEMBAYARAN</span>
          </span>
        </div>
        <span className="text-[10px] bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl font-bold text-[#10b981] tracking-wider uppercase">
          ⚡ Secure Checkout
        </span>
      </header>

      {/* ================= CONTENT MAIN ================= */}
      <main className="flex-1 p-4 md:p-8 overflow-hidden z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* KOLOM KIRI: RINCIAN STRUK BOOKING (LG: 7 COLUMNS) */}
        <div className="lg:col-span-7 bg-[#0b111e]/40 border border-slate-800/60 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-slate-800/60 bg-slate-900/20 shrink-0">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Item Lapangan Terpilih</h4>
          </div>

          {/* List Struk Item Map */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar divide-y divide-slate-800/40">
            {bookingItems.map((item, idx) => (
              <div key={item.id || idx} className={`flex justify-between items-center ${idx !== 0 ? 'pt-3' : ''}`}>
                <div>
                  <h5 className="text-xs font-bold text-white uppercase tracking-wide">{item.lapangan || 'Lapangan'}</h5>
                  <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{item.jam_mulai} - {item.jam_selesai}</p>
                  <p className="text-[10px] text-slate-500 font-medium">Tanggal: {item.tanggal}</p>
                </div>
                <span className="font-mono text-xs text-[#10b981] font-bold">Rp {Number(item.harga || 0).toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>

          {/* Subtotal & Total Box Bottom */}
          <div className="p-5 border-t border-slate-800/60 bg-slate-950/40 shrink-0 space-y-2">
            <div className="flex justify-between text-xs text-slate-400 font-semibold">
              <span>Jumlah Jam:</span>
              <span>{bookingItems.length} Jam Sesi</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400 font-semibold">
              <span>Pajak & Biaya Admin:</span>
              <span className="text-emerald-400 uppercase text-[10px] font-bold">Rp 0 (FREE)</span>
            </div>
            <div className="flex justify-between items-center pt-2 text-sm border-t border-slate-800/40">
              <span className="text-slate-200 font-bold">Total Pembayaran:</span>
              <span className="text-lg font-black text-[#10b981]">Rp {totalBayar.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: METODE PEMBAYARAN INTERAKTIF (LG: 5 COLUMNS) */}
        <div className="lg:col-span-5 bg-[#0b111e]/40 border border-slate-800/60 rounded-2xl p-6 shadow-xl flex flex-col justify-between h-full">
          <div className="space-y-4">
            <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase border-b border-slate-800 pb-2">Pilih Metode Pembayaran</h3>
            
            {/* Opsi QRIS / E-Wallet */}
            <div 
              onClick={() => setPaymentMethod('qris')}
              className={`p-4 border rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200 ${
                paymentMethod === 'qris' 
                  ? 'bg-[#10b981]/10 border-[#10b981] text-white' 
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">📱</span>
                <span className="text-xs font-bold uppercase tracking-wider">QRIS / E-Wallet (Gopay/OVO)</span>
              </div>
              <span className="text-xs">{paymentMethod === 'qris' ? '🟢' : '⚪'}</span>
            </div>

            {/* Opsi Transfer Bank BNI */}
            <div 
              onClick={() => setPaymentMethod('bni')}
              className={`p-4 border rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200 ${
                paymentMethod === 'bni' 
                  ? 'bg-[#10b981]/10 border-[#10b981] text-white' 
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">🏦</span>
                <span className="text-xs font-bold uppercase tracking-wider">Virtual Account Bank BNI</span>
              </div>
              <span className="text-xs">{paymentMethod === 'bni' ? '🟢' : '⚪'}</span>
            </div>

            {/* Opsi Tunai di Kasir */}
            <div 
              onClick={() => setPaymentMethod('cash')}
              className={`p-4 border rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200 ${
                paymentMethod === 'cash' 
                  ? 'bg-[#10b981]/10 border-[#10b981] text-white' 
                  : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">💵</span>
                <span className="text-xs font-bold uppercase tracking-wider">Bayar Tunai di Kasir</span>
              </div>
              <span className="text-xs">{paymentMethod === 'cash' ? '🟢' : '⚪'}</span>
            </div>
          </div>

          {/* Tombol Konfirmasi Final */}
          <button
            onClick={handleBayarSekarang}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] text-[#070b13] font-black text-xs uppercase tracking-widest py-4 rounded-xl hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6 shrink-0"
          >
            {isSubmitting ? 'Memproses Pesanan...' : '✓ Selesaikan Pemesanan'}
          </button>
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

export default Pembayaran;