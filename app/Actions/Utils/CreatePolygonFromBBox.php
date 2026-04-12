<?php

namespace App\Actions\Utils;

use MatanYadaev\EloquentSpatial\Objects\LineString;
use MatanYadaev\EloquentSpatial\Objects\Point;
use MatanYadaev\EloquentSpatial\Objects\Polygon;

class CreatePolygonFromBBox
{
    public function handle(?float $south, ?float $west, ?float $north, ?float $east): ?Polygon
    {
        if ($south === null || $west === null || $north === null || $east === null) {
            return null;
        }

        return new Polygon([
            new LineString([
                new Point($south, $west),
                new Point($north, $west),
                new Point($north, $east),
                new Point($south, $east),
                new Point($south, $west),
            ]),
        ]);
    }
}
