<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Field;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index()
    {
        // Mengambil booking dan memformat jam agar konsisten dengan React (H:i)
        $bookings = Booking::with(['field', 'user'])->get()->map(function ($booking) {
            $booking->jam_mulai = date('H:i', strtotime($booking->jam_mulai));
            $booking->jam_selesai = date('H:i', strtotime($booking->jam_selesai));
            return $booking;
        });

        return response()->json($bookings, 200);
    }

    /**
     * TAMBAHAN: Fungsi khusus untuk menangani checkout massal (multi-slot) dari React pembayaran.jsx
     */
    public function checkout(Request $request)
    {
        // 1. Validasi struktur data array yang dikirim dari frontend React
        $request->validate([
            'items'               => 'required|array|min:1',
            'items.*.field_id'    => 'required|exists:fields,id',
            'items.*.tanggal'     => 'required|date',
            'items.*.jam_mulai'   => 'required|date_format:H:i',
            'items.*.jam_selesai' => 'required|date_format:H:i',
        ]);

        $createdBookings = [];

        // 2. Looping data keranjang untuk mengecek bentrok jadwal dan menyimpan pesanan
        foreach ($request->items as $item) {
            $fieldId = $item['field_id'];
            $tanggal = $item['tanggal'];
            $jamMulai = $item['jam_mulai'];
            $jamSelesai = $item['jam_selesai'];

            // 3. Proteksi ketat bentrokan jadwal di server
            $isBentrok = Booking::where('field_id', $fieldId)
                ->where('tanggal', $tanggal)
                ->where(function ($query) use ($jamMulai, $jamSelesai) {
                    $query->where(function ($q) use ($jamMulai, $jamSelesai) {
                        $q->where('jam_mulai', '<', $jamSelesai)
                          ->where('jam_selesai', '>', $jamMulai);
                    });
                })->exists();

            if ($isBentrok) {
                return response()->json([
                    'message' => "Gagal memproses transaksi. Slot jam {$jamMulai} - {$jamSelesai} pada lapangan tersebut sudah dipesan orang lain."
                ], 422);
            }

            // 4. Hitung Total Harga Otomatis per item
            $field = Field::find($fieldId);
            $mulai = strtotime($jamMulai);
            $selesai = strtotime($jamSelesai);
            $durasiJam = ($selesai - $mulai) / 3600;
            $totalHarga = $durasiJam * $field->harga_per_jam;

            // 5. Eksekusi penyimpanan data booking
            $booking = Booking::create([
                'user_id'     => $request->user()->id, 
                'field_id'    => $fieldId,
                'tanggal'     => $tanggal,
                'jam_mulai'   => $jamMulai,
                'jam_selesai' => $jamSelesai,
                'total_harga' => $totalHarga,
                'status'      => 'PENDING', 
            ]);

            $createdBookings[] = $booking->load('field');
        }

        return response()->json([
            'message' => 'Semua checkout berhasil dibuat',
            'data'    => $createdBookings
        ], 201);
    }

    public function store(Request $request)
    {
        // 1. Validasi Input mendasar
        $validated = $request->validate([
            'field_id'        => 'required|exists:fields,id',
            'tanggal'         => 'required|date',
            'jam_mulai'       => 'required|date_format:H:i',
            'jam_selesai'     => 'required|date_format:H:i|after:jam_mulai',
            'status'          => 'required|string'
        ]);

        $fieldId = $validated['field_id'];
        $tanggal = $validated['tanggal'];
        $jamMulai = $validated['jam_mulai'];
        $jamSelesai = $validated['jam_selesai'];

        // 2. VALIDASI BENTROKAN JADWAL
        $isBentrok = Booking::where('field_id', $fieldId)
            ->where('tanggal', $tanggal)
            ->where(function ($query) use ($jamMulai, $jamSelesai) {
                $query->where(function ($q) use ($jamMulai, $jamSelesai) {
                    $q->where('jam_mulai', '<', $jamSelesai)
                      ->where('jam_selesai', '>', $jamMulai);
                });
            })->exists();

        if ($isBentrok) {
            return response()->json([
                'message' => 'Jadwal lapangan pada jam tersebut sudah dibooking orang lain.'
            ], 422);
        }

        // 3. Hitung Total Harga Otomatis
        $field = Field::find($fieldId);
        $mulai = strtotime($jamMulai);
        $selesai = strtotime($jamSelesai);
        $durasiJam = ($selesai - $mulai) / 3600;
        $totalHarga = $durasiJam * $field->harga_per_jam;

        // 4. Create Booking
        $booking = Booking::create([
            'user_id'         => $request->user()->id, 
            'field_id'        => $fieldId,
            'tanggal'         => $tanggal,
            'jam_mulai'       => $jamMulai,
            'jam_selesai'     => $jamSelesai,
            'total_harga'     => $totalHarga,
            'status'          => $validated['status'],
        ]);

        return response()->json([
            'message' => 'Booking berhasil dibuat', 
            'data' => $booking->load(['field', 'user'])
        ], 201);
    }

    public function show(string $id)
    {
        $booking = Booking::with(['field', 'user'])->find($id);
        if (!$booking) {
            return response()->json(['message' => 'Data booking tidak ditemukan'], 404);
        }

        $booking->jam_mulai = date('H:i', strtotime($booking->jam_mulai));
        $booking->jam_selesai = date('H:i', strtotime($booking->jam_selesai));

        return response()->json($booking, 200);
    }

    public function update(Request $request, string $id)
    {
        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json(['message' => 'Data booking tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'tanggal'         => 'sometimes|required|date',
            'jam_mulai'       => 'sometimes|required|date_format:H:i',
            'jam_selesai'     => 'sometimes|required|date_format:H:i|after:jam_mulai',
            'status'          => 'sometimes|required|string'
        ]);

        if ($request->has(['jam_mulai', 'jam_selesai']) || $request->has('field_id')) {
            $fieldId = $request->field_id ?? $booking->field_id;
            $field = Field::find($fieldId);
            
            $jamMulai = $request->jam_mulai ?? $booking->jam_mulai;
            $jamSelesai = $request->jam_selesai ?? $booking->jam_selesai;

            $mulai = strtotime($jamMulai);
            $selesai = strtotime($jamSelesai);
            $durasiJam = ($selesai - $mulai) / 3600;

            $booking->total_harga = $durasiJam * $field->harga_per_jam;
        }

        // Simpan data string bersih setelah tipe data diubah menjadi VARCHAR
        if ($request->has('status')) {
            $booking->status = trim((string) $request->status);
        }

        unset($validated['status']);
        $booking->fill($validated);
        
        $booking->save();
        $booking->refresh();

        return response()->json([
            'message' => 'Booking berhasil diperbarui', 
            'data' => $booking->load(['field', 'user'])
        ], 200);
    }

    public function destroy(string $id)
    {
        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json(['message' => 'Data booking tidak ditemukan'], 404);
        }
        $booking->delete();
        return response()->json(['message' => 'Booking berhasil dihapus/dibatalkan'], 200);
    }
}