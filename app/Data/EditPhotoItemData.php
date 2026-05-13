<?php

namespace App\Data;

use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\RequiredIf;
use Spatie\LaravelData\Data;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\TypeScriptTransformer\Attributes\LiteralTypeScriptType;

class EditPhotoItemData extends Data
{
    public function __construct(
        #[In(['existing', 'new'])]
        public string $kind,

        #[RequiredIf('kind', 'existing')]
        public ?int $id = null,

        #[RequiredIf('kind', 'new')]
        #[LiteralTypeScriptType('File | null')]
        public ?UploadedFile $file = null,

        public ?string $url = null,

        public ?string $thumb_url = null,
    ) {}

    public static function fromMedia(Media $media): self
    {
        return new self(
            kind: 'existing',
            id: (int) $media->id,
            url: $media->getUrl(),
            thumb_url: $media->getUrl('thumb'),
        );
    }
}
