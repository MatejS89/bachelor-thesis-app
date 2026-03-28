<?php

namespace App\Data;

use App\Models\OsmData;
use MatanYadaev\EloquentSpatial\Objects\Point;
use Spatie\LaravelData\Data;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class OsmDetailData extends Data
{
    public function __construct(
        public int $id,
        public ?string $name,
        public ?string $cuisine,
        public ?string $street,
        public ?string $city,

        public Point $geom,

        /** @var array<GalleryImageData> */
        public array $gallery_images,
    ) {}

    public static function fromModel(OsmData $feature): self
    {
        return new self(
            id: $feature->id,
            name: $feature->name,
            cuisine: $feature->cuisine,
            street: $feature->street,
            city: $feature->city,
            geom: $feature->geom,
            gallery_images: $feature->getMedia('gallery')
                ->map(fn (Media $media) => GalleryImageData::from($media))
                ->all(),
        );
    }
}
