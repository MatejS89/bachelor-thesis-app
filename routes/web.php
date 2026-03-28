<?php

use App\Http\Controllers\OsmDataController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'Welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'Dashboard')->name('dashboard');
});

Route::get('map-data', [OsmDataController::class, 'index'])->name('map.index');

Route::get('map/{feature?}', [OsmDataController::class, 'show'])->name('feature.show');
Route::post('map/{feature}', [OsmDataController::class, 'update'])->name('feature.update');

require __DIR__.'/settings.php';
