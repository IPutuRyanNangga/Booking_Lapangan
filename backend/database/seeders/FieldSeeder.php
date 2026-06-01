<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FieldSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('fields')->insert([
            [
                'nama_lapangan' => 'Lapangan Futsal A',
                'jenis_olahraga' => 'Futsal',
                'harga_per_jam' => 100000,
                'status' => true,
            ],
            [
                'nama_lapangan' => 'Lapangan Futsal B',
                'jenis_olahraga' => 'Futsal',
                'harga_per_jam' => 100000,
                'status' => true,
            ],
            [
                'nama_lapangan' => 'Lapangan Badminton A',
                'jenis_olahraga' => 'Badminton',
                'harga_per_jam' => 50000,
                'status' => true,
            ],
            [
                'nama_lapangan' => 'Lapangan Basket A',
                'jenis_olahraga' => 'Basket',
                'harga_per_jam' => 80000,
                'status' => true,
            ],
        ]);
    }
}