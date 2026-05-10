<?php

namespace App\Http\Controllers;

use App\Actions\OsmData\FilterOsmDataAction;
use App\Actions\OsmData\UpdateOsmDataAction;
use App\Actions\Utils\CreatePolygonFromBBox;
use App\Data\MenuItemData;
use App\Data\OsmFeatureData;
use App\Data\ReviewData;
use App\Data\UpdateOsmDataData;
use App\Http\Requests\OsmData\GetIndexOsmDataRequest;
use App\Http\Requests\UpdateOsmDataRequest;
use App\Data\OsmData\SearchOsmDataData;
use App\Data\OsmData\UpdateOsmDataData;
use App\Http\Resources\MapFeatureCollection;
use App\Models\Allergen;
use App\Models\OsmData;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class OsmDataController extends Controller
{
    public function edit(OsmData $osmData): Response
    {
        Gate::authorize('update', $osmData);

        $osmData->load('media');

        return Inertia::render('osmData/EditOsmData', [
            'osmData' => OsmFeatureData::from($osmData),
        ]);
    }

    public function update(OsmData $osmData, UpdateOsmDataData $data, UpdateOsmDataAction $updateOsmDataAction): RedirectResponse
    {
        Gate::authorize('update', $osmData);

        $updateOsmDataAction->execute($osmData, $data);

        return redirect()->route('map.show', $osmData);
    }

    public function filter(FilterOsmDataData $data, FilterOsmDataAction $action): JsonResponse
    {
        return response()->json(
            new MapFeatureCollection($action->execute($data))
        );
    }

    public function search(SearchOsmDataData $data): JsonResponse
    {
        $results = OsmData::query()
            ->where('name', 'ilike', "%{$data->search}%")
            ->limit(3)
            ->get();

        return response()->json($results);
    }

    public function show(GetIndexOsmDataRequest $request, OsmData $osmData, CreatePolygonFromBBox $createPolygon): Response
    {
        $osmData->load('media');

        return Inertia::render('map/Show', [
            'selectedFeature' => fn () => OsmFeatureData::from($osmData),

            'reviews' => fn () => ReviewData::collect(
                $osmData->reviews()
                    ->with(['user', 'media'])
                    ->latest()
                    ->get()
            ),

            'menuItems' => fn () => MenuItemData::collect(
                $osmData->menuItems()
                    ->with(['allergens', 'dietaryTags', 'media'])
                    ->get()
            ),
        ]);
    }

    public function index(): Response
    {
        return Inertia::render('map/Index', [
            'allergens' => Inertia::once(fn () => Allergen::all('name', 'id')),
        ]);
    }
}
