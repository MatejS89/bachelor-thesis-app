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
use Inertia\Response;
use Spatie\MediaLibrary\MediaCollections\Exceptions\FileDoesNotExist;
use Spatie\MediaLibrary\MediaCollections\Exceptions\FileIsTooBig;

class MapController extends Controller
{
    public function index(GetMapDataRequest $request, OsmService $osmService): JsonResponse
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

    /**
     * @throws FileDoesNotExist
     * @throws FileIsTooBig
     */
    public function update(Request $request, OsmData $feature)
    {
        $request->validate([
            'images' => ['required', 'array', 'max:10'],
            'images.*' => ['image', 'max:5120'],
        ]);

        foreach ($request->file('images') as $image) {
            $feature->addMedia($image)->toMediaCollection('gallery');
        }

        return back()->with('success', 'Gallery images added successfully.');
    }
}
