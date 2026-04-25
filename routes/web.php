<?php

use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\OsmDataController;
use App\Http\Controllers\ReviewController;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'Welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::get('map', [OsmDataController::class, 'index'])->name('map.index');

Route::get('map/search', [OsmDataController::class, 'search'])->name('map.search');

Route::get('map/{osmData}', [OsmDataController::class, 'show'])->name('map.show');

Route::resource('map/{osmData}/review', ReviewController::class)
    ->names('map.review')
    ->only(['create', 'store'])
    ->middlewareFor(['create', 'store'], ['auth']);

Route::resource('map/{osmData}/menuitem', MenuItemController::class)
    ->names('map.menuitem')
    ->only(['create', 'store'])
    ->middlewareFor(['create', 'store'], ['auth', HandlePrecognitiveRequests::class]);

Route::get('map-data', [OsmDataController::class, 'mapData'])->name('map.data');

Route::get('map/{osmData}/edit', [OsmDataController::class, 'edit'])->name('map.edit')->middleware('auth');
Route::put('map/{osmData}', [OsmDataController::class, 'update'])->name('map.update')->middleware('auth');

require __DIR__.'/settings.php';
