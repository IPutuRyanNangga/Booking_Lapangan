<?php

use Illuminate\Support\Facades\Route;
use App\Models\Field;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/fields', function () {
    return response()->json(Field::all());
});