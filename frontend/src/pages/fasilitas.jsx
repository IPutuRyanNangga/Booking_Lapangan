import React from 'react';
import { useNavigate } from 'react-router-dom';

const Fasilitas = () => {
  const navigate = useNavigate();

  // Data representatif fasilitas Ganesha Arena
  const daftarFasilitas = [
    {
      id: 1,
      nama: 'VIP Lounge & Player Corner',
      kategori: 'VIP Only',
      icon: '🛋️',
      deskripsi: 'Ruang tunggu eksklusif ber-AC yang dilengkapi dengan sofa premium, Smart TV, Wi-Fi berkecepatan tinggi, dan free flow minuman mineral.',
    },
    {
      id: 2,
      nama: 'Hot & Cold Shower Room',
      kategori: 'Semua Member',
      icon: '🚿',
      deskripsi: 'Kamar mandi bersih dengan sistem pemanas air otomatis, loker penyimpanan barang berkuci elektronik, dan cermin besar.',
    },
    {
      id: 3,
      nama: 'Pro Shop & Ganesha Cafeteria',
      kategori: 'Umum',
      icon: '☕',
      deskripsi: 'Menyediakan jasa penyenaran raket (stringing machine), penjualan shuttlecock, sewa raket, serta berbagai pilihan makanan & minuman kesehatan.',
    },
    {
      id: 4,
      nama: 'Spectator Grandstand (Tribun)',
      kategori: 'Umum',
      icon: '🏟️',
      deskripsi: 'Area tribun penonton di sisi lapangan dengan kapasitas hingga 100 orang. Nyaman untuk membawa keluarga atau tim pendukung.',
    },
    {
      id: 5,
      nama: 'Ample Parking & Security 24/7',
      kategori: 'Umum',
      icon: '🚗',
      deskripsi: 'Area parkir luas terlindung kanopi untuk roda dua dan roda empat yang dipantau penuh oleh kamera CCTV 24 jam dan petugas keamanan.',
    }
  ];

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
            EKSKLUSIF <span className="text-[#10b981]">FASILITAS ARENA</span>
          </span>
        </div>
        <span className="text-[10px] bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-bold text-[#10b981] tracking-wider uppercase">
          ✦ Premium Standard
        </span>
      </header>

      {/* ================= MAIN CONTENT (GRID GALERI FASILITAS) ================= */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto z-10 w-full max-w-[1400px] mx-auto flex flex-col gap-6 custom-scrollbar">
        
        {/* Deskripsi Subtitle */}
        <div>
          <h2 className="text-xl font-extrabold text-white">Kenyamanan Bertanding Terbaik</h2>
          <p className="text-xs text-slate-400 mt-1">Kami menyediakan fasilitas pendukung kelas satu demi menunjang kebugaran dan kenyamanan latihan Anda di Ganesha Arena.</p>
        </div>

        {/* Grid Kartu Fasilitas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start pb-6">
          {daftarFasilitas.map((fasilitas) => (
            <div 
              key={fasilitas.id} 
              className="bg-[#0b111e]/40 border border-slate-800/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden group flex flex-col justify-between min-h-[220px] hover:border-[#06b6d4]/40 transition-all duration-300"
            >
              {/* Dekorasi Ornamen Pojok saat Hover */}
              <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-[#06b6d4]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

              <div className="space-y-4">
                {/* Header Kartu */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-xl shadow-inner">
                      {fasilitas.icon}
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-white uppercase tracking-wide">{fasilitas.nama}</h3>
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block mt-0.5">Ganesha Sport Center</span>
                    </div>
                  </div>

                  {/* Badge Kategori Status */}
                  <span className={`px-2 py-0.5 rounded-md text-[8px] font-extrabold uppercase tracking-widest border ${
                    fasilitas.kategori === 'VIP Only'
                      ? 'bg-amber-950/30 text-amber-400 border-amber-500/20'
                      : fasilitas.kategori === 'Semua Member'
                      ? 'bg-emerald-950/30 text-[#10b981] border-emerald-500/20'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}>
                    {fasilitas.kategori}
                  </span>
                </div>

                {/* Deskripsi Teks */}
                <p className="text-slate-400 text-xs font-medium leading-relaxed">
                  {fasilitas.deskripsi}
                </p>
              </div>

              {/* Lapisan Interaktif Tipis di Bawah Kartu */}
              <div className="mt-4 pt-3 border-t border-slate-800/40 flex items-center justify-between text-[10px] font-bold text-slate-500 group-hover:text-slate-300 transition-colors">
                <span>Operational Ready</span>
                <span className="text-[#06b6d4] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">✦</span>
              </div>
            </div>
          ))}

          {/* Kartu Tambahan: Tombol Hubungi Manajemen / Booking */}
          <div className="bg-gradient-to-br from-[#0c1424] to-[#080d18] border border-slate-800/80 rounded-2xl p-6 shadow-2xl min-h-[220px] flex flex-col justify-between group">
            <div className="space-y-2">
              <span className="text-[9px] font-bold text-[#10b981] uppercase tracking-widest block">Butuh Bantuan?</span>
              <h3 className="text-sm font-black text-white uppercase tracking-wide">Punya Keluhan atau Saran Fasilitas?</h3>
              <p className="text-slate-400 text-xs font-medium leading-relaxed">Hubungi admin center kami langsung jika ada kerusakan fasilitas atau ingin memesan ruangan VIP Lounge untuk keperluan turnamen.</p>
            </div>
            
            <button 
              onClick={() => navigate('/jadwal')}
              className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] text-[#070b13] font-black text-xs uppercase tracking-widest py-3 rounded-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300"
            >
              Mulai Sewa Lapangan Now
            </button>
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

export default Fasilitas;