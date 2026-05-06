<?php

namespace App\Data;

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
}
