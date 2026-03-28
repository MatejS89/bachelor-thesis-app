<?php

namespace App\Data;

use App\Models\OsmData;
use MatanYadaev\EloquentSpatial\Objects\Point;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class OsmGeoJSONData extends Data
{
    #[LiteralTypeScriptType("'Feature'")]
    public string $type;

    public function __construct(
        public int $id,
        public Point $geometry,
        public OsmDetailData $properties,
    ) {}

    public static function fromModel(OsmData $model): self
    {
        $properties = $model->toArray();

        unset($properties['geom']);

        return new self(
            id: $model->id,
            geometry: $model->geom,
            properties: OsmDetailData::fromModel($model),
        );
    }
}
