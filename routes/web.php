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

Route::get('map-data', [OsmDataController::class, 'mapData'])->name('map.data');
Route::get('map', [OsmDataController::class, 'index'])->name('map.index');

Route::get('map/search', [OsmDataController::class, 'search'])->name('map.search');

Route::get('map/{osmData}', [OsmDataController::class, 'show'])->name('map.show');

// Route::post('map/{feature}', [OsmDataController::class, 'update'])->name('feature.update');


require __DIR__.'/settings.php';
