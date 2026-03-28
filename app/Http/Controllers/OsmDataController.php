<?php

namespace App\Http\Controllers;

use App\Actions\OsmData\UpdateOsmData;
use App\Data\BoundingBox;
use App\Http\Requests\OsmData\GetBoundingBoxRequest;
use App\Http\Requests\OsmData\UpdateFeatureRequest;
use App\Http\Resources\OsmDetailResource;
use App\Http\Resources\OsmGeoJSONCollection;
use App\Models\OsmData;
use App\Services\OsmService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OsmDataController extends Controller
{
    public function index(GetBoundingBoxRequest $request, OsmService $osmService): JsonResponse
    {
        $bbox = BoundingBox::fromArray($request->validated());
        $features = $osmService->getFeaturesInBoundingBox($bbox);

        return response()->json(new OsmGeoJSONCollection($features));
    }

    public function show(Request $request, ?OsmData $feature = null): Response
    {
        return Inertia::render('Map', [
            'selectedFeature' => $feature ? new OsmDetailResource($feature) : null,
        ]);
    }

    public function update(UpdateFeatureRequest $request, OsmData $feature, UpdateOsmData $addImagesAction)
    {
        $feature = $addImagesAction->handle($feature, $request->file('images', []));

        return to_route('feature.show', $feature);
    }
}
