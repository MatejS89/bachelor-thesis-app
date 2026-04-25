<?php

namespace App\Http\Controllers;

use App\Actions\OsmData\GetFeatureGeoJsonBBox;
use App\Actions\OsmData\GetFeaturesInBBox;
use App\Actions\Utils\CreatePolygonFromBBox;
use App\Data\MenuItemData;
use App\Data\OsmFeatureData;
use App\Data\ReviewData;
use App\Http\Requests\OsmData\GetIndexOsmDataRequest;
use App\Http\Resources\MapFeatureCollection;
use App\Models\Allergen;
use App\Models\OsmData;
use Illuminate\Http\JsonResponse;
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
    public function mapData(
        GetIndexOsmDataRequest $request,
        CreatePolygonFromBBox $createPolygon,
    ): JsonResponse {
        $filters = $request->except('page');

        $bbox = $createPolygon->handle(
            $request->input('south'),
            $request->input('west'),
            $request->input('north'),
            $request->input('east')
        );

        return response()->json(
            OsmData::query()
                ->select('name', 'id', 'geom')
                ->withinMapBounds($bbox)
                ->withSafeItemCounts($filters)
                ->get(),
        );
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

        return Inertia::render('map/Show', [
            'selectedFeature' => OsmFeatureData::from($osmData),

            'filters' => $filters,

            'mapFeatures' => fn () => new MapFeatureCollection(OsmData::query()
                ->select('name', 'id', 'geom')
                ->when($bbox, fn ($query) => $query->whereWithin('geom', $bbox))
                ->withSafeItemCounts($filters)
                ->get()
            ),

            'reviews' => fn () => ReviewData::collect(
                $osmData->reviews()
                    ->with('user')
                    ->latest()
                    ->get()
            ),

            'menuItems' => fn () => MenuItemData::collect(
                $osmData->menuItems()
                    ->with('allergens', 'dietaryTags')
                    ->get()
            ),
        ]);
    }

    public function index(
        GetIndexOsmDataRequest $request,
        CreatePolygonFromBBox $createPolygon,
        GetFeaturesInBBox $getFeaturesInBBox,
        GetFeatureGeoJsonBBox $getFeatureGeoJsonBBox,
    ): Response {
        $filters = $request->except('page');
        $bbox = $createPolygon->handle(
            $request->input('south'),
            $request->input('west'),
            $request->input('north'),
            $request->input('east')
        );

        return Inertia::render('map/Index', [
            'filters' => Inertia::always(fn () => $filters),

            'visibleFeatures' => Inertia::scroll(fn () => OsmData::query()->when($bbox, fn ($query) => $query->whereWithin('geom', $bbox))->orderBy('id')->paginate(20)->withQueryString()),

            'mapFeatures' => fn () => new MapFeatureCollection(OsmData::query()
                ->select('name', 'id', 'geom')
                ->when($bbox, fn ($query) => $query->whereWithin('geom', $bbox))
                ->withSafeItemCounts($filters)
                ->get()
            ),

            'allergens' => Inertia::once(fn () => Allergen::all('name', 'id')),
        ]);
    }
}
