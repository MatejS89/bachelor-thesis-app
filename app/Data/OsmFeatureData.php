<?php

namespace App\Data;

use MatanYadaev\EloquentSpatial\Objects\Point;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class OsmFeatureData extends Data
{
    public int $id;

    public string $osm_type;

    public int $osm_id;

    public string $name;

    public ?string $type;

    public array $tags;

    public Point $geom;
}
