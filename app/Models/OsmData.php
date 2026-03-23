<?php

namespace App\Models;

use App\Data\BoundingBox;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class OsmData extends Model
{
    protected $table = 'osm_data';

    public $timestamps = false;

    protected static function booted(): void
    {
        static::addGlobalScope('geom', function (Builder $builder) {
            $query = $builder->getQuery();

            if ($query->aggregate) {
                return;
            }

            if (empty($query->columns)) {
                $builder->select($builder->getModel()->getTable().'.*');
                $builder->addSelect(DB::raw('ST_AsGeoJSON(geom, 6) as geom'));

                return;
            }

            $columns = $query->columns;
            $geomRequested = false;

            foreach ($columns as $key => $column) {
                if ($column === 'geom' || $column === $builder->getModel()->getTable().'.geom') {
                    unset($columns[$key]);
                    $geomRequested = true;
                }
            }

            if ($geomRequested) {
                $columns[] = DB::raw('ST_AsGeoJSON(geom, 6) as geom');
                $builder->select(array_values($columns));
            }
        });
    }

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

    public function scopeOrderByDistance($query, $lat, $lng, $direction = 'asc')
    {
        return $query->orderByRaw(
            "ST_Distance(geom, ST_SetSRID(ST_MakePoint(?, ?), 4326)) $direction",
            [$lng, $lat]
        );
    }
}
