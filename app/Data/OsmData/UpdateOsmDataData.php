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
            cuisine: self::tagListFromString($tags['cuisine'] ?? null),
            diet: self::tagsByPrefix($tags, 'diet:'),
            photos: $photos,
            opening_hours: $tags['opening_hours'] ?? null,
        );
    }

    /**
     * collect a tag array separated by ';' for example cuisine=italian;pizza => ['italian', 'pizza']
     *
     * @return array<int, string>
     */
    private static function tagListFromString(mixed $value, string $separator = ';'): array
    {
        if (! is_string($value)) {
            return [];
        }

        return array_values(array_filter(array_map('trim', explode($separator, $value))));
    }

    /**
     * collect tags whose key starts with the given prefix into an associative
     * array keyed by the remainder of the key
     * `diet:vegan=yes,diet:gluten_free=yes` =>
     * `{
     * "vegan": "yes",
     * "gluten_free": "yes"
     * }`.
     *
     * @param  array<string, mixed>  $tags
     * @return array<string, string|null>
     */
    private static function tagsByPrefix(array $tags, string $prefix): array
    {
        $result = [];
        $prefixLength = strlen($prefix);

        foreach ($tags as $key => $value) {
            if (! is_string($key) || ! str_starts_with($key, $prefix)) {
                continue;
            }

            $result[substr($key, $prefixLength)] = is_string($value) ? $value : null;
        }

        return $result;
    }
}
