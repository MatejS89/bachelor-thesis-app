<?php

use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\OsmDataController;
use App\Http\Controllers\ReviewController;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Support\Facades\Route;
use Inertia\Middleware\EncryptHistory;

Route::inertia('/', 'Welcome')->name('home');

Route::get('map/search', [OsmDataController::class, 'search'])->name('map.search');

Route::post('map/filter', [OsmDataController::class, 'mapData'])->name('map.filter');

Route::resource('map/{osmData}/review', ReviewController::class)
    ->names('map.review')
    ->only(['create', 'store'])
    ->middlewareFor(['create', 'store'], ['auth', EncryptHistory::class]);

Route::resource('map/{osmData}/menuitem', MenuItemController::class)
    ->names('map.menuitem')
    ->only(['create', 'store'])
    ->middlewareFor(['create', 'store'], ['auth', HandlePrecognitiveRequests::class, EncryptHistory::class]);

Route::resource('map', OsmDataController::class)
    ->parameters(['map' => 'osmData'])
    ->names('map')
    ->only(['update', 'show', 'edit', 'index'])
    ->middlewareFor(['update', 'edit'], ['auth', EncryptHistory::class]);

require __DIR__.'/settings.php';
