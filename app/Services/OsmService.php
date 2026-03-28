<?php

namespace App\Services;

use App\Data\BoundingBox;
use App\Models\OsmData;
use Illuminate\Database\Eloquent\Collection;
use MatanYadaev\EloquentSpatial\Objects\Point;

class OsmService
{
    public function getFeaturesInBoundingBox(BoundingBox $box): Collection
    {
        $centerLat = ($box->south + $box->north) / 2;
        $centerLng = ($box->west + $box->east) / 2;

        return OsmData::query()
            ->withinBoundingBox($box)
            ->orderByDistance('geom', new Point($centerLat, $centerLng), 'asc')
            ->get();
    }
}
