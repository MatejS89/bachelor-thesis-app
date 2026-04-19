<?php

use App\Http\Controllers\OsmDataController;
use App\Http\Controllers\ReviewController;
use Illuminate\Support\Facades\Route;
use Inertia\Middleware\EncryptHistory;
use Laravel\Fortify\Features;

Route::inertia('/', 'Welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::get('map-data', [OsmDataController::class, 'mapData'])->name('map.data');
Route::get('map', [OsmDataController::class, 'index'])->name('map.index');

Route::get('map/search', [OsmDataController::class, 'search'])->name('map.search');

Route::get('map/{osmData}', [OsmDataController::class, 'show'])->name('map.show');

Route::middleware(['auth', 'verified', EncryptHistory::class])->group(function () {
    Route::inertia('map/{osmData}/menu-item', 'menu-item/Create')->name('map.menu-item.create');
});

Route::resource('map/{osmData}/review', ReviewController::class)->names('map.review')->middlewareFor(['create', 'store'], ['auth', 'verified', EncryptHistory::class]);

require __DIR__.'/settings.php';
