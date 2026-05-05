<?php

namespace App\Data;

use App\Http\Requests\UpdateOsmDataRequest;
use App\Models\OsmData;
use Spatie\LaravelData\Data;

class UpdateOsmDataData extends Data
{
    /**
     * @param  array<string, string|null>  $tags
     * @param  array<int, array<string, mixed>>  $photos
     */
    public function __construct(
        public string $name,
        public ?string $type,
        public array $tags,
        public array $photos,
    ) {}

    /**
     * @return array<int, string>
     */
    public static function tagKeys(): array
    {
        return [
            'cuisine',
            'stars',
            'michelin_guide',
            'opening_hours',
            'breakfast',
            'happy_hours',
            'description',
            'diet:vegetarian',
            'diet:vegan',
            'diet:gluten_free',
            'diet:lactose_free',
            'diet:dairy_free',
            'diet:egg_free',
            'diet:sugar_free',
            'diet:halal',
            'diet:kosher',
            'diet:pescetarian',
            'diet:raw',
            'diet:meat',
            'diet:non-vegetarian',
            'phone',
            'email',
            'website',
            'contact:facebook',
            'contact:instagram',
            'brand',
            'branch',
            'operator',
            'level',
            'start_date',
            'addr:full',
            'organic',
            'local_produce',
            'fair_trade',
            'takeaway',
            'delivery',
            'drive_through',
            'reservation',
            'self_service',
            'wheelchair',
            'wheelchair:description',
            'toilets',
            'toilets:wheelchair',
            'outdoor_seating',
            'capacity:outdoor',
            'indoor_seating',
            'capacity',
            'internet_access',
            'internet_access:ssid',
            'internet_access:fee',
            'air_conditioning',
            'high_chair',
            'changing_table',
            'dog',
            'smoking',
            'smoking:outside',
            'bar',
            'alcohol',
            'cocktails',
            'brewery',
            'microbrewery',
            'live_music',
            'tv',
            'payment:cash',
            'payment:cards',
            'payment:contactless',
            'payment:visa',
            'payment:mastercard',
            'payment:amex',
        ];
    }

    /**
     * @return array<string, array<int, string>>
     */
    public static function tagRules(): array
    {
        return collect(self::tagKeys())
            ->mapWithKeys(
                fn (string $key): array => [$key => ['nullable', 'string']]
            )
            ->all();
    }

    public static function fromRequest(UpdateOsmDataRequest $request): self
    {
        $validated = $request->validated();
        $tags = [];

        foreach (self::tagKeys() as $key) {
            if (array_key_exists($key, $validated)) {
                $tags[$key] = $validated[$key];
            }
        }

        if (array_key_exists('type', $validated)) {
            $tags['amenity'] = $validated['type'];
        }

        return new self(
            name: $validated['name'],
            type: self::filledString($validated['type'] ?? null),
            tags: $tags,
            photos: $validated['photos'] ?? [],
        );
    }

    /**
     * @return array{name: string, type: string|null, tags: array<string, mixed>}
     */
    public function toModelAttributes(OsmData $osmData): array
    {
        $tags = $osmData->tags ?? [];

        foreach ($this->tags as $key => $value) {
            $filledValue = self::filledString($value);

            if ($filledValue === null) {
                unset($tags[$key]);

                continue;
            }

            $tags[$key] = $filledValue;
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
