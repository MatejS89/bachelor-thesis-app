<?php

use App\Http\Controllers\MapController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'Welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'Dashboard')->name('dashboard');
});

Route::inertia('map', component: 'Map')->name('map');

Route::get('/map-data', [MapController::class, 'index'])->name('map.data');

require __DIR__.'/settings.php';
