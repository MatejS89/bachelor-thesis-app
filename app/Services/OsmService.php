<?php

namespace App\Services;

use App\Data\BoundingBox;
use App\Models\OsmData;
use Illuminate\Contracts\Pagination\CursorPaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class OsmService
{
    /**
     * Get OSM features within a bounding box.
     */
    public function getFeaturesInBoundingBox(BoundingBox $box): Collection
    {
        return OsmData::query()
            ->withinBoundingBox($box)
            ->select('*', DB::raw('ST_AsGeoJSON(geom, 6) as geometry'))
            ->get();
    }

    /**
     * Get paginated OSM restaurants within a bounding box.
     */
    public function getRestaurantsInBoundingBox(BoundingBox $box, int $perPage = 20): CursorPaginator
    {
        return OsmData::query()
            ->withinBoundingBox($box)
            ->select('*')
            ->cursorPaginate($perPage);
    }
}
