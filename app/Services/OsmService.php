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
        $centerLat = ($box->south + $box->north) / 2;
        $centerLng = ($box->west + $box->east) / 2;

        return OsmData::query()
            ->withinBoundingBox($box)
            ->orderByDistance($centerLat, $centerLng)
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
