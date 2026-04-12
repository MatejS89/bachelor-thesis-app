<?php

namespace App\Actions\OsmData;

use App\Models\OsmData;
use MatanYadaev\EloquentSpatial\Objects\Polygon;

class GetFeaturesInBBox
{
    public function execute(?Polygon $bbox, array $filters)
    {
        return OsmData::query()
            ->when($bbox, fn ($query) => $query->withinMapBounds($bbox))
            ->withSafeItemCounts($filters)
            ->orderBy('id')
            ->paginate(30);
    }
}
