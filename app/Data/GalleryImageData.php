<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class GalleryImageData extends Data
{
    public function __construct(
        public int $id,
        public string $url,
        public string $thumb_url,
        public int $order,
    ) {}

    public static function fromMedia(Media $media): self
    {
        return new self(
            id: $media->id,
            url: $media->getUrl(),
            thumb_url: $media->getUrl('thumb'),
            order: $media->order_column,
        );
    }
}
