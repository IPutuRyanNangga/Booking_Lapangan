import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddField = () => {

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    nama_lapangan: '',
    jenis_olahraga: '',
    harga_per_jam: '',
    status: 1
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === 'status'
          ? parseInt(e.target.value)
          : e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);

      const response = await fetch(
        'https://supreme-winner-v6p5v77jv9p5cw5qr-8000.app.github.dev/api/fields',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        }
      );

      const result = await response.json();

      if (response.ok) {

        alert('Lapangan berhasil ditambahkan');

        navigate('/admin/dashboard');

      } else {

        console.log(result);
        alert(result.message || 'Gagal menambah lapangan');
      }

    } catch (error) {

      console.error(error);
      alert('Terjadi kesalahan');

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-[#070b13] text-white p-8">

      <div className="max-w-3xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#10b981]">
            Tambah Lapangan Baru
          </h1>

          <p className="text-slate-400 mt-2">
            Tambahkan data lapangan ke sistem Ganesha Arena
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#0b111e]/60 border border-slate-800 rounded-2xl p-6 space-y-5"
        >

          <div>
            <label className="block mb-2 text-sm font-semibold">
              Nama Lapangan
            </label>

            <input
              type="text"
              name="nama_lapangan"
              value={formData.nama_lapangan}
              onChange={handleChange}
              required
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold">
              Jenis Olahraga
            </label>

            <input
              type="text"
              name="jenis_olahraga"
              value={formData.jenis_olahraga}
              onChange={handleChange}
              required
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold">
              Harga Per Jam
            </label>

            <input
              type="number"
              name="harga_per_jam"
              value={formData.harga_per_jam}
              onChange={handleChange}
              required
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold">
              Status Lapangan
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl"
            >
              <option value={1}>Aktif</option>
              <option value={0}>Tidak Aktif</option>
            </select>
          </div>

          <div className="flex gap-4">

            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="px-6 py-3 bg-slate-700 rounded-xl"
            >
              Kembali
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#10b981] text-black font-bold rounded-xl"
            >
              {loading ? 'Menyimpan...' : 'Simpan Lapangan'}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AddField; 