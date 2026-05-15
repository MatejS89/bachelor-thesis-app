<?php

namespace App\Http\Controllers;

use App\Actions\MenuItem\StoreMenuItemAction;
use App\Data\Allergen\AllergenData;
use App\Data\DietaryTag\DietaryTagData;
use App\Data\OsmData\OsmFeatureData;
use App\Http\Requests\MenuItem\StoreMenuItemRequest;
use App\Models\Allergen;
use App\Models\DietaryTag;
use App\Models\MenuItem;
use App\Models\OsmData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class MenuItemController extends Controller
{
    /**
     * Show the form for creating a new resource.
     */
    public function create(OsmData $osmData): Response
    {
        Gate::authorize('create', MenuItem::class);

        return Inertia::render('menuItem/CreateMenuItem', [
            'allergens' => AllergenData::collect(Allergen::all()),
            'dietaryTags' => DietaryTagData::collect(DietaryTag::all()),
            'osmData' => OsmFeatureData::from($osmData),
            'maxPhotoSizeKb' => config('file-uploads.max_photo_size_in_kb'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(OsmData $osmData, StoreMenuItemRequest $request, StoreMenuItemAction $createMenuItemAction): RedirectResponse
    {
        Gate::authorize('create', MenuItem::class);

        $createMenuItemAction->execute($request->validated(), $osmData, $request->file('photo'));

        return redirect()->route('map.show', $osmData);
    }
}
