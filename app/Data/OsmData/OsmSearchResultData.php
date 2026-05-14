<?php

namespace App\Data\OsmData;

use App\Models\OsmData;
use MatanYadaev\EloquentSpatial\Objects\Point;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class OsmSearchResultData extends Data
{
    public int $id;

    public string $name;

    public Point $geom;

    public static function fromModel(OsmData $osmData): self
    {
        return self::from([
            'id' => $osmData->id,
            'name' => $osmData->name,
            'geom' => $osmData->geom,
        ]);
    }
}
