<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Import Semua Controller API
use App\Http\Controllers\Api\FieldController; 
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\UserController; 

// Route bawaan untuk mengecek data user yang sedang login
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// ================= ROUTE REGISTER / REGISTRASI UMUM =================
Route::post('/users', [UserController::class, 'store']); // Siapa saja bisa daftar akun


// ================= ROUTE KHUSUS USER (CUSTOMER) ATAU ADMIN YANG SUDAH LOGIN =================
Route::middleware('auth:sanctum')->group(function () {
    
    // Fitur Lapangan yang bisa diakses publik/customer setelah login
    Route::get('/fields', [FieldController::class, 'index']);      // Lihat semua lapangan
    Route::get('/fields/{id}', [FieldController::class, 'show']);   // Lihat detail 1 lapangan

    // Fitur Booking yang bisa dilakukan oleh Customer
    Route::get('/bookings', [BookingController::class, 'index']);   // Riwayat booking pribadi
    Route::post('/bookings', [BookingController::class, 'store']);  // Membuat booking lapangan baru
    Route::get('/bookings/{id}', [BookingController::class, 'show']); // Lihat detail 1 nota booking
});


// ================= ROUTE KHUSUS ADMIN (DIPROTEKSI KETAT) =================
// Hanya akun dengan role 'admin' yang bisa menembus grup ini
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    
    // 1. Admin Mengatur Manajemen Lapangan (CRUD Penuh)
    Route::post('/fields', [FieldController::class, 'store']);       // Tambah lapangan baru
    Route::post('/fields/{id}', [FieldController::class, 'update']);   // Edit data lapangan
    Route::delete('/fields/{id}', [FieldController::class, 'destroy']); // Hapus lapangan

    // 2. Admin Mengonfirmasi / Mengubah Status Booking Customer
    Route::post('/bookings/{id}', [BookingController::class, 'update']); // Konfirmasi (pending -> confirmed/cancelled)
    Route::delete('/bookings/{id}', [BookingController::class, 'destroy']); // Batalkan total / hapus transaksi

    // 3. Admin Mengontrol Akun User / Customer
    Route::get('/users', [UserController::class, 'index']);          // Lihat daftar semua member
    Route::get('/users/{id}', [UserController::class, 'show']);       // Lihat detail data member tertentu
    Route::post('/users/{id}', [UserController::class, 'update']);    // Update data member jika diperlukan
    Route::delete('/users/{id}', [UserController::class, 'destroy']); // Ban / Hapus akun member
});