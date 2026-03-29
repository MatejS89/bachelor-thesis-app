<?php

namespace App\Services;

use App\Data\BoundingBox;
use App\Models\OsmData;
use Illuminate\Support\Facades\DB;
use MatanYadaev\EloquentSpatial\Objects\Point;

class OsmService
{
    public function getFeaturesInBoundingBox(BoundingBox $box): string
    {
        $centerLat = ($box->south + $box->north) / 2;
        $centerLng = ($box->west + $box->east) / 2;

        $baseQuery = OsmData::query()
            ->select('id', 'geom')
            ->withinBoundingBox($box)
            ->orderByDistance('geom', new Point($centerLat, $centerLng), 'asc');

        $jsonQuery = DB::table(DB::raw("({$baseQuery->toSql()}) as sub"))
            ->mergeBindings($baseQuery->getQuery())
            ->selectRaw("
                    json_build_object(
                        'type', 'FeatureCollection',
                        'features', COALESCE(json_agg(
                            json_build_object(
                                'type', 'Feature',
                                'id', sub.id,
                                'geometry', ST_AsGeoJSON(sub.geom)::json,
                                'properties', to_jsonb(sub) - 'geom' - 'id'
                            )
                        ), '[]'::json)
                    ) as geojson
                ");

        $result = $jsonQuery->first();

        return $result->geojson ?? '{"type":"FeatureCollection","features":[]}';
    }
}
