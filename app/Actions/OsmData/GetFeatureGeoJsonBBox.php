<?php

namespace App\Actions\OsmData;

use App\Http\Resources\MapFeatureCollection;
use App\Models\OsmData;
use MatanYadaev\EloquentSpatial\Objects\Polygon;

class GetFeatureGeoJsonBBox
{
    public function execute(?Polygon $bbox): MapFeatureCollection
    {
        $data = OsmData::query()
            ->when($bbox, fn ($query) => $query->withinMapBounds($bbox))
            ->get(['id', 'name', 'geom']);

        return new MapFeatureCollection($data);
    }
}
