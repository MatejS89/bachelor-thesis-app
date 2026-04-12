<?php

namespace App\Http\Controllers;

use App\Actions\OsmData\GetFeatureGeoJsonBBox;
use App\Actions\OsmData\GetFeaturesInBBox;
use App\Actions\OsmData\SearchMapData;
use App\Actions\Utils\CreatePolygonFromBBox;
use App\Http\Requests\OsmData\GetIndexOsmDataRequest;
use App\Models\Allergen;
use App\Models\OsmData;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class OsmDataController extends Controller
{
    public function search(GetIndexOsmDataRequest $request): JsonResponse
    {
        $query = $request['search'];

        $results = OsmData::query()
            ->where('name', 'ilike', "%{$query}%")
            ->limit(5)
            ->get();

        return response()->json($results);
    }

    public function index(
        GetIndexOsmDataRequest $request,
        CreatePolygonFromBBox $createPolygon,
        GetFeaturesInBBox $getFeaturesInBBox,
        GetFeatureGeoJsonBBox $getFeatureGeoJsonBBox,
        SearchMapData $searchMapData
    ): Response {
        $filters = $request->except('page');
        $bbox = $createPolygon->handle(
            $request->input('south'),
            $request->input('west'),
            $request->input('north'),
            $request->input('east')
        );

        return Inertia::render('Map', [
            'filters' => Inertia::always(fn () => $filters),
            'visibleFeatures' => Inertia::scroll(fn () => $getFeaturesInBBox->execute($bbox, $filters)),
            'mapFeatures' => fn () => $getFeatureGeoJsonBBox->execute($bbox),
            'allergens' => Inertia::once(fn () => Allergen::all('name')),
        ]);
    }
}
