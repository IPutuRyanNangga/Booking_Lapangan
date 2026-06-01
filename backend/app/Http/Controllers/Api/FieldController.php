<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Field;
use Illuminate\Http\Request;

class FieldController extends Controller
{
    public function index()
    {
        return response()->json(Field::all(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_lapangan'  => 'required|string|max:255',
            'jenis_olahraga' => 'required|string|max:255',
            'harga_per_jam'  => 'required|numeric',
            'status'         => 'required|integer',
        ]);

        $field = Field::create($validated);
        return response()->json(['message' => 'Lapangan berhasil ditambahkan', 'data' => $field], 201);
    }

    public function show(string $id)
    {
        $field = Field::find($id);
        if (!$field) {
            return response()->json(['message' => 'Lapangan tidak ditemukan'], 404);
        }
        return response()->json($field, 200);
    }

    public function update(Request $request, string $id)
    {
        $field = Field::find($id);
        if (!$field) {
            return response()->json(['message' => 'Lapangan tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'nama_lapangan'  => 'sometimes|required|string|max:255',
            'jenis_olahraga' => 'sometimes|required|string|max:255',
            'harga_per_jam'  => 'sometimes|required|numeric',
            'status'         => 'sometimes|required|integer',
        ]);

        $field->update($validated);
        $field->refresh(); 

        return response()->json(['message' => 'Lapangan berhasil diupdate', 'data' => $field], 200);
    }

    public function destroy(string $id)
    {
        $field = Field::find($id);
        if (!$field) {
            return response()->json(['message' => 'Lapangan tidak ditemukan'], 404);
        }
        $field->delete();
        return response()->json(['message' => 'Lapangan berhasil dihapus'], 200);
    }
}