<?php

use App\Http\Controllers\OsmDataController;
use Illuminate\Support\Facades\Route;

// Route::inertia('/', 'Welcome', [
//    'canRegister' => Features::enabled(Features::registration()),
// ])->name('home');
//
// Route::middleware(['auth', 'verified'])->group(function () {
//    Route::inertia('dashboard', 'Dashboard')->name('dashboard');
// });

Route::get('map', [OsmDataController::class, 'index'])->name('map.index');

// Route::post('map/{feature}', [OsmDataController::class, 'update'])->name('feature.update');

Route::get('map/search', [OsmDataController::class, 'search'])->name('map.search');

require __DIR__.'/settings.php';
