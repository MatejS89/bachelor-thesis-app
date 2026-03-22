<?php

namespace App\Models;

use App\Data\BoundingBox;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class OsmData extends Model
{
    protected $table = 'osm_data';

    public $timestamps = false;

    /**
     * Scope a query to only include features within a given bounding box.
     */
    public function scopeWithinBoundingBox($query, BoundingBox $box)
    {
        return $query->whereRaw(
            DB::raw('ST_Intersects(geom, ST_MakeEnvelope(?, ?, ?, ?, 4326))'),
            [$box->west, $box->south, $box->east, $box->north]
        );
    }

    public function scopeNear($query, $lat, $lng, $meters)
    {
        return $query->whereRaw(
            DB::raw('ST_DWithin(way, ST_SetSRID(ST_MakePoint(?, ?), 4326), ?)'),
            [$lng, $lat, $meters]
        );
    }
}
