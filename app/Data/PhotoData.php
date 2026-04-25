<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class PhotoData extends Data
{
    public function __construct(
        public string $id,
        public string $url,
    ) {}

    public static function fromModel(Media $media): self
    {
        return new self(
            id: (string) $media->id,
            url: $media->getUrl(),
        );
    }
}
