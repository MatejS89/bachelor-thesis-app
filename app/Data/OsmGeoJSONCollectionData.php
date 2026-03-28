<?php

namespace App\Data;

use Illuminate\Database\Eloquent\Collection;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class OsmGeoJSONCollectionData extends Data
{
    #[LiteralTypeScriptType("'FeatureCollection'")]
    public string $type = 'FeatureCollection';

    public function __construct(
        /** @var OsmGeoJSONData[] */
        public Collection $features,
    ) {}

    public static function fromModels(iterable $features): self
    {
        return new self(
            features: OsmGeoJSONData::collect($features),
        );
    }
}
