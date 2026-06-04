import React from 'react';
import { useNavigate } from 'react-router-dom';

const TarifSewa = () => {
  const navigate = useNavigate();

  // Data asli / representatif tarif sewa lapangan Ganesha Arena
  const daftarTarif = [
    {
      id: 1,
      nama: 'Vinyl Premium Court',
      icon: '🏸',
      deskripsi: 'Karpet vinyl standar internasional dengan daya cengkeram optimal, mengurangi risiko cedera lutut.',
      fitur: ['Tebal 4.5mm Standar BWF', 'Pencahayaan LED Anti-Glare', 'Sirkulasi Udara Bagus'],
      hargaReguler: 'Rp 50.000',
      hargaMalam: 'Rp 65.000',
      keterangan: 'Harga malam berlaku mulai pukul 18:00 WITA'
    },
    {
      id: 2,
      nama: 'Wood Parquet Court',
      icon: '🪵',
      deskripsi: 'Lantai kayu parquet premium yang memberikan pantulan bola/shuttlecock paling stabil dan estetik.',
      fitur: ['Premium Hardwood Flooring', 'Pencahayaan Sisi Samping', 'Tribun Penonton Mini'],
      hargaReguler: 'Rp 60.000',
      hargaMalam: 'Rp 75.000',
      keterangan: 'Harga malam berlaku mulai pukul 18:00 WITA'
    },
    {
      id: 3,
      nama: 'Interlock Polypropylene',
      icon: '🧩',
      deskripsi: 'Lantai interlock modular modern yang sangat stabil, cocok untuk latihan intensitas tinggi.',
      fitur: ['Shock Absorption System', 'Drainase Cepat (Anti-Lembap)', 'Warna Kontras Tinggi'],
      hargaReguler: 'Rp 45.000',
      hargaMalam: 'Rp 55.000',
      keterangan: 'Harga malam berlaku mulai pukul 18:00 WITA'
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
            TARIF <span className="text-[#10b981]">SEWA LAPANGAN</span>
          </span>
        </div>
        <span className="text-[10px] bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl font-bold text-slate-400 tracking-wider">
          Update: Juni 2026
        </span>
      </header>

      {/* ================= MAIN CONTENT (KATALOG TARIF) ================= */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto z-10 w-full max-w-[1400px] mx-auto flex flex-col gap-6 custom-scrollbar">
        
        {/* Info Banner Singkat */}
        <div className="bg-[#0b111e]/40 border border-slate-800/60 p-4 rounded-xl text-xs font-semibold text-slate-400 tracking-wide max-w-3xl">
          💡 <span className="text-white">Tips Hemat:</span> Lakukan booking di jam reguler (Pagi - Siang) untuk mendapatkan tarif yang lebih terjangkau. Anggota dengan status <span className="text-[#10b981]">Premium Member</span> otomatis mendapatkan potongan harga tambahan saat checkout.
        </div>

        {/* Grid Kartu Tarif */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {daftarTarif.map((tarif) => (
            <div 
              key={tarif.id} 
              className="bg-[#0b111e]/40 border border-slate-800/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden group flex flex-col justify-between min-h-[460px] hover:border-[#10b981]/40 transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Header Kartu */}
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-xl shadow-inner">
                    {tarif.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wide">{tarif.nama}</h3>
                    <span className="text-[9px] text-[#10b981] font-bold uppercase tracking-widest">BWF Certified</span>
                  </div>
                </div>

                {/* Deskripsi */}
                <p className="text-slate-400 text-xs font-medium leading-relaxed">
                  {tarif.deskripsi}
                </p>

                {/* Garis Pembatas */}
                <div className="border-t border-slate-800/60 my-2"></div>

                {/* Fitur / Fasilitas Spesifik Lapangan */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Spesifikasi Fasilitas:</span>
                  {tarif.fitur.map((f, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                      <span className="text-[#10b981] text-xs">✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bagian Harga & Tombol Aksi di Bawah Kartu */}
              <div className="mt-6 space-y-4 pt-4 border-t border-slate-800/60">
                {/* Grid Harga */}
                <div className="grid grid-cols-2 gap-2 bg-[#05080f] p-3 rounded-xl border border-slate-800/50">
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Sesi Reguler</span>
                    <span className="text-sm font-extrabold text-white">{tarif.hargaReguler}<span className="text-[10px] font-normal text-slate-400">/jam</span></span>
                  </div>
                  <div className="border-l border-slate-800 pl-3">
                    <span className="text-[9px] font-bold text-[#10b981] uppercase tracking-wider block">Sesi Malam</span>
                    <span className="text-sm font-extrabold text-[#10b981]">{tarif.hargaMalam}<span className="text-[10px] font-normal text-slate-400">/jam</span></span>
                  </div>
                </div>
                
                <p className="text-[9px] text-slate-500 font-medium italic text-center">
                  * {tarif.keterangan}
                </p>

                {/* Tombol Langsung Booking */}
                <button
                  onClick={() => navigate('/jadwal')}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 font-bold text-xs uppercase tracking-widest py-3 rounded-xl hover:border-[#10b981] hover:text-[#10b981] hover:shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all duration-300 active:scale-[0.98]"
                >
                  Lihat Ketersediaan Jadwal
                </button>
              </div>
            </div>
          ))}
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

export default TarifSewa;