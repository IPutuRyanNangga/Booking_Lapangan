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
        $bookings = Booking::with(['field', 'user'])->get();
        return response()->json($bookings, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id'         => 'required|exists:users,id',
            'field_id'        => 'required|exists:fields,id',
            'tanggal'         => 'required|date',
            'jam_mulai'       => 'required|date_format:H:i',
            'jam_selesai'     => 'required|date_format:H:i|after:jam_mulai',
            'status'          => 'required|string'
        ]);

        $field = Field::find($request->field_id);
        
        $mulai = strtotime($request->jam_mulai);
        $selesai = strtotime($request->jam_selesai);
        $durasiJam = ($selesai - $mulai) / 3600;

        $totalHarga = $durasiJam * $field->harga_per_jam;

        $booking = Booking::create([
            'user_id'         => $validated['user_id'],
            'field_id'        => $validated['field_id'],
            'tanggal'         => $validated['tanggal'],
            'jam_mulai'       => $validated['jam_mulai'],
            'jam_selesai'     => $validated['jam_selesai'],
            'total_harga'     => $totalHarga,
            'status'          => $validated['status'],
        ]);

        return response()->json(['message' => 'Booking berhasil dibuat', 'data' => $booking->load(['field', 'user'])], 201);
    }

    public function show(string $id)
    {
        $booking = Booking::with(['field', 'user'])->find($id);
        if (!$booking) {
            return response()->json(['message' => 'Data booking tidak ditemukan'], 404);
        }
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

        $booking->update($validated);
        $booking->refresh();

        return response()->json(['message' => 'Booking berhasil diperbarui', 'data' => $booking->load(['field', 'user'])], 200);
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