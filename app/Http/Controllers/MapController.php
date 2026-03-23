<?php

namespace App\Http\Controllers;

use App\Data\BoundingBox;
use App\Http\Requests\Map\GetMapDataRequest;
use App\Http\Resources\OsmDetailResource;
use App\Http\Resources\OsmGeoJSONCollection;
use App\Models\OsmData;
use App\Services\OsmService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MapController extends Controller
{
    public function index(GetMapDataRequest $request, OsmService $osmService): JsonResponse
    {
        $bbox = BoundingBox::fromArray($request->validated());
        $features = $osmService->getFeaturesInBoundingBox($bbox);

        return response()->json(new OsmGeoJSONCollection($features));
    }

    public function show(Request $request, ?OsmData $feature = null)
    {
        return Inertia::render('Map', [
            'selectedFeature' => $feature ? new OsmDetailResource($feature) : null,
        ]);
    }
}
