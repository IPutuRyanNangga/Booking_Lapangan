<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // <-- 1. IMPORT SANCTUM DI SINI

class User extends Authenticatable
{
    // 2. MASUKKAN HasApiTokens DI DALAM SINI BERSAMA TRAIT LAINNYA
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relasi booking asli milikmu tetap aman di sini
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}