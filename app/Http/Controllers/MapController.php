<?php

namespace App\Http\Controllers;

use App\Data\BoundingBox;
use App\Http\Requests\GetMapDataRequest;
use App\Http\Resources\OsmFeatureCollection;
use App\Services\OsmService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MapController extends Controller
{
    public function index(GetMapDataRequest $request, OsmService $osmService)
    {
        $features = $osmService->getFeaturesInBoundingBox(
            BoundingBox::fromArray($request->validated())
        );

        return new OsmFeatureCollection($features);
    }

    public function show(Request $request, OsmService $osmService)
    {
        $boundingBox = new BoundingBox(
            north: $request->float('north', 50.15),
            south: $request->float('south', 50.00),
            east: $request->float('east', 14.55),
            west: $request->float('west', 14.30),
        );

        $paginator = $osmService->getRestaurantsInBoundingBox($boundingBox);

        return Inertia::render('Map', [
            'restaurants' => Inertia::Scroll(fn () => $paginator),
        ]);
    }
}
