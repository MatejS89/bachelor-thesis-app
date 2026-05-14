<?php

namespace App\Data\OsmData;

use App\Data\EditPhotoItemData;
use App\Models\OsmData;
use Spatie\LaravelData\Data;

class UpdateOsmDataData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public ?string $type = null,
        public array $cuisine = [],
        public array $diet = [],
        /** @var EditPhotoItemData[]|null */
        public ?array $photos = null,
        public ?string $opening_hours = null,
    ) {}

    /**
     * @return array<string, array<int, string>>
     */
    public static function rules(): array
    {
        $maxPhotoSizeInKb = config('file-uploads.max_photo_size_in_kb');
        $maxPhotoCount = config('file-uploads.max_osmdata_photos');

        return [
            'id' => ['required', 'integer', 'exists:osm_data,id'],
            'name' => ['required', 'string', 'max:255'],
            'type' => ['nullable', 'string', 'max:255'],
            'opening_hours' => ['nullable', 'string'],
            'photos' => ['array', 'max:'.$maxPhotoCount],
            'photos.*.kind' => ['required', 'in:existing,new'],
            'photos.*.id' => ['required_if:photos.*.kind,existing', 'integer'],
            'photos.*.file' => [
                'required_if:photos.*.kind,new',
                'file',
                'max:'.$maxPhotoSizeInKb,
                'image',
            ],
            'cuisine' => ['array'],
            'cuisine.*' => ['string'],
            'diet' => ['array'],
            'diet.*' => ['string'],
        ];
    }

    /**
     * @return array{name: string, type: string|null, tags: array<string, mixed>}
     */
    public function toModelAttributes(OsmData $osmData): array
    {
        $tags = $osmData->tags ?? [];

        $tags['opening_hours'] = self::filledString($this->opening_hours);

        $cuisine = array_filter(array_map([self::class, 'filledString'], $this->cuisine));

        if (empty($cuisine)) {
            unset($tags['cuisine']);
        } else {
            $tags['cuisine'] = implode(';', $cuisine);
        }

        foreach (array_keys($tags) as $existingKey) {
            if (is_string($existingKey) && str_starts_with($existingKey, 'diet:')) {
                unset($tags[$existingKey]);
            }
        }

        foreach ($this->diet as $key => $value) {
            $filledValue = self::filledString($value);

            if ($filledValue === null) {
                continue;
            }

            $tags["diet:$key"] = $filledValue;
        }

        return [
            'name' => $this->name,
            'type' => self::filledString($this->type),
            'tags' => $tags,
        ];
    }

    private static function filledString(mixed $value): ?string
    {
        if (! is_string($value)) {
            return null;
        }

        $value = trim($value);

        return $value === '' ? null : $value;
    }

    public static function fromModel(OsmData $osmData): self
    {
        $tags = $osmData->tags ?? [];

        $photos = $osmData->getMedia('photos')
            ->map(fn ($media) => EditPhotoItemData::fromMedia($media))
            ->all();

        return new self(
            id: $osmData->id,
            name: $osmData->name,
            type: $osmData->type,
            cuisine: ParsedOsmTagsData::listFromString($tags['cuisine'] ?? null),
            diet: ParsedOsmTagsData::byPrefix($tags, 'diet:'),
            photos: $photos,
            opening_hours: $tags['opening_hours'] ?? null,
        );
    }
}
