<?php

namespace App\Data;

use App\Models\OsmData;
use Illuminate\Support\Collection;
use MatanYadaev\EloquentSpatial\Objects\Point;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Lazy;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class OsmFeatureData extends Data
{
    public int $id;

    public string $osm_type;

    public int $osm_id;

    public string $name;

    public ?string $type;

    /** @var array<string, mixed> */
    public array $tags;

    public Point $geom;

    /** @var Collection<PhotoData>|Lazy */
    public Lazy|Collection $photos;

    public static function fromModel(OsmData $osmData): self
    {
        return self::from([
            'id' => $osmData->id,
            'osm_type' => $osmData->osm_type,
            'osm_id' => $osmData->osm_id,
            'name' => $osmData->name,
            'type' => $osmData->type,
            'tags' => $osmData->tags,
            'geom' => $osmData->geom,

            'photos' => Lazy::whenLoaded('media', $osmData, function () use ($osmData) {
                return PhotoData::collect($osmData->getMedia('photos'));
            }),
        ]);
    }
}
