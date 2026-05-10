<?php

namespace App\Data\OsmData;

use App\Http\Requests\UpdateOsmDataRequest;
use App\Models\OsmData;
use Spatie\LaravelData\Data;

class UpdateOsmDataData extends Data
{
    /**
     * @param  array<int, string>  $cuisine
     * @param  array<string, string|null>  $diet
     * @param  array<int, array<string, mixed>>  $photos
     */
    public function __construct(
        public int $id,
        public string $name,
        public ?string $type,
        public array $cuisine,
        public array $diet,
        public array $photos,
        public ?string $opening_hours,
    ) {}

    public static function fromRequest(UpdateOsmDataRequest $request): self
    {
        $validated = $request->validated();

        return new self(
            id: $validated['id'],
            name: $validated['name'],
            type: self::filledString($validated['type'] ?? null),
            cuisine: $validated['cuisine'] ?? [],
            diet: $validated['diet'] ?? [],
            photos: $validated['photos'] ?? [],
            opening_hours: self::filledString($validated['opening_hours'] ?? null),
        );
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

        foreach ($this->diet as $key => $value) {
            $filledValue = self::filledString($value);
            $tagKey = "diet:$key";

            if ($filledValue === null) {
                unset($tags[$tagKey]);

                continue;
            }

            $tags[$tagKey] = $filledValue;
        }

        return [
            'name' => $this->name,
            'type' => $this->type,
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

        return new self(
            name: $osmData->name,
            type: $osmData->type,
            cuisine: self::tagListFromString($tags['cuisine'] ?? null),
            diet: self::tagsByPrefix($tags, 'diet:'),
            photos: $osmData->getMedia('gallery')->map(fn ($media) => [
                'id' => $media->id,
                'url' => $media->getUrl(),
                'thumb_url' => $media->getUrl('thumb'),
            ])->toArray(),
            opening_hours: $tags['opening_hours'] ?? null,
            id: $osmData->id,
        );
    }

    /**
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
     * Collect tags whose key starts with the given prefix into an associative
     * array keyed by the remainder of the key (e.g. `diet:vegan` => `vegan`).
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
