<?php

namespace App\Http\Controllers;

use App\Actions\OsmData\UpdateOsmDataAction;
use App\Actions\Utils\CreatePolygonFromBBox;
use App\Data\MenuItemData;
use App\Data\OsmFeatureData;
use App\Data\ReviewData;
use App\Http\Requests\OsmData\GetIndexOsmDataRequest;
use App\Http\Requests\UpdateOsmDataRequest;
use App\Http\Resources\MapFeatureCollection;
use App\Models\Allergen;
use App\Models\OsmData;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class OsmDataController extends Controller
{
    public function edit(OsmData $osmData): Response
    {
        $osmData->load('media');

        return Inertia::render('osmData/EditOsmData', [
            'osmData' => OsmFeatureData::from($osmData),
        ]);
    }

    public function update(OsmData $osmData, UpdateOsmDataRequest $updateOsmDataRequest, UpdateOsmDataAction $updateOsmDataAction): RedirectResponse
    {
        $validated = $updateOsmDataRequest->validated();
        $updateOsmDataAction->execute($osmData, $validated, $validated['photos']);

        return redirect()->route('map.show', $osmData);
    }

    public function mapData(
        GetIndexOsmDataRequest $request,
        CreatePolygonFromBBox $createPolygonFromBBox
    ): JsonResponse {
        $filters = $request->validated();

        $bbox = $createPolygonFromBBox->handle(
            $request->input('south'),
            $request->input('west'),
            $request->input('north'),
            $request->input('east')
        );

        return response()->json(
            new MapFeatureCollection(OsmData::query()
                ->select('name', 'id', 'geom', 'tags')
                ->when($bbox, fn ($query) => $query->whereWithin('geom', $bbox))
                ->with('media')
                ->withSafeItemCounts($filters)
                ->get()
            ));
    }

    public function search(GetIndexOsmDataRequest $request): JsonResponse
    {
        $query = $request['search'];

        $results = OsmData::query()
            ->where('name', 'ilike', "%{$query}%")
            ->limit(3)
            ->get();

        return response()->json($results);
    }

    public function show(GetIndexOsmDataRequest $request, OsmData $osmData, CreatePolygonFromBBox $createPolygon): Response
    {
        $filters = $request->except('page');

        $bbox = $createPolygon->handle(
            $request->input('south'),
            $request->input('west'),
            $request->input('north'),
            $request->input('east')
        );

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
