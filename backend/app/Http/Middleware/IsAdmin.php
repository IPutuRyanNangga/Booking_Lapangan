<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        // Pastikan user sudah login dan memiliki role admin
        // Catatan: Jika belum menerapkan login Sanctum, sementara kita baca dari header custom untuk testing di Postman
        if ($request->user() && $request->user()->role === 'admin') {
            return $next($request);
        }

        // Jika bukan admin, tolak request-nya
        return response()->json([
            'message' => 'Akses ditolak! Halaman ini hanya untuk Admin.'
        ], 403);
    }
}