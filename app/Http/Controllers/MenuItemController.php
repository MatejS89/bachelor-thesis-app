<?php

namespace App\Http\Controllers;

use App\Actions\MenuItem\CreateMenuItemAction;
use App\Data\AllergenData;
use App\Data\DietaryTagData;
use App\Data\OsmFeatureData;
use App\Http\Requests\MenuItem\StoreMenuItemRequest;
use App\Models\Allergen;
use App\Models\DietaryTag;
use App\Models\MenuItem;
use App\Models\OsmData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class MenuItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(OsmData $osmData)
    {
        Gate::authorize('create', MenuItem::class);

        return Inertia::render('menu-item/CreateMenuItem', [
            'allergens' => AllergenData::collect(Allergen::all()),
            'dietaryTags' => DietaryTagData::collect(DietaryTag::all()),
            'osmData' => OsmFeatureData::from($osmData),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(OsmData $osmData, StoreMenuItemRequest $request, CreateMenuItemAction $createMenuItemAction)
    {
        Gate::authorize('create', MenuItem::class);

        $menuItem = $createMenuItemAction->execute($request->validated(), $osmData, $request->file('photo'));

        return redirect()->route('map.show', $osmData);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
