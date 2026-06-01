<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::all(), 200);
    }

    public function store(Request $request)
    {
        // 1. Tambahkan validasi untuk role (boleh kosong, defaultnya nanti diisi 'user')
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role'     => 'sometimes|required|string|in:user,admin', // Tambahkan validasi ini
        ]);

        // 2. Masukkan array 'role' saat proses create ke database
        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role'     => $validated['role'] ?? 'user', // JIKA ROLE TIDAK DIKIRIM, MAKA OTOMATIS JADI 'user'
        ]);

        return response()->json([
            'message' => 'User berhasil didaftarkan',
            'data'    => $user
        ], 201);
    }

    public function update(Request $request, string $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'name'     => 'sometimes|required|string|max:255',
            'email'    => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
            'password' => 'sometimes|required|string|min:6',
        ]);

        if ($request->has('password')) {
            $validated['password'] = Hash::make($request->password);
        }

        $user->update($validated);
        $user->refresh();

        return response()->json(['message' => 'Profil user berhasil diperbarui', 'data' => $user], 200);
    }

    public function destroy(string $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }
        $user->delete();
        return response()->json(['message' => 'User berhasil dihapus'], 200);
    }
}