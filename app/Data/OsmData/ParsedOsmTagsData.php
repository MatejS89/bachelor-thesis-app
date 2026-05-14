<?php

namespace App\Data\OsmData;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class ParsedOsmTagsData extends Data
{
    /**
     * @param  array<int, string>  $cuisine
     * @param  array<string, string>  $diet
     * @param  array<string, string>  $payment
     * @param  array<string, string>  $contact
     * @param  array<string, string>  $address
     * @param  array<string, string>  $other
     */
    public function __construct(
        public ?string $opening_hours,
        public array $cuisine,
        public array $diet,
        public array $payment,
        public array $contact,
        public array $address,
        public array $other,
    ) {}

    /**
     * @param  array<string, mixed>|null  $tags
     */
    public static function fromTags(?array $tags): self
    {
        $tags ??= [];

        $diet = self::byPrefix($tags, 'diet:');
        $payment = self::byPrefix($tags, 'payment:');
        $contact = self::byPrefix($tags, 'contact:');
        $address = self::byPrefix($tags, 'addr:');

        $extracted = [
            'cuisine', 'opening_hours',
            ...array_map(fn ($k) => "diet:$k", array_keys($diet)),
            ...array_map(fn ($k) => "payment:$k", array_keys($payment)),
            ...array_map(fn ($k) => "contact:$k", array_keys($contact)),
            ...array_map(fn ($k) => "addr:$k", array_keys($address)),
        ];

        $other = [];

        foreach ($tags as $key => $value) {
            if (in_array($key, $extracted, true)) {
                continue;
            }

            $other[(string) $key] = is_string($value) ? $value : (string) $value;
        }

        return new self(
            opening_hours: self::filledString($tags['opening_hours'] ?? null),
            cuisine: self::listFromString($tags['cuisine'] ?? null),
            diet: $diet,
            payment: $payment,
            contact: $contact,
            address: $address,
            other: $other,
        );
    }

    /**
     * parse a seaparated tag value into a clean list
     * `italian;pizza` => `['italian', 'pizza']`.
     *
     * @return array<int, string>
     */
    public static function listFromString(mixed $value, string $separator = ';'): array
    {
        if (! is_string($value)) {
            return [];
        }

        return array_values(array_filter(array_map('trim', explode($separator, $value))));
    }

    /**
     * collect tags with the prefix into an associative
     * array keyed by the remainder of the key.
     * `diet:vegan=yes, diet:gluten_free=yes` → `['vegan' => 'yes', 'gluten_free' => 'yes']`
     *
     * @param  array<string, mixed>  $tags
     * @return array<string, string>
     */
    public static function byPrefix(array $tags, string $prefix): array
    {
        $result = [];
        $prefixLength = strlen($prefix);

        foreach ($tags as $key => $value) {
            if (! is_string($key) || ! str_starts_with($key, $prefix) || ! is_string($value)) {
                continue;
            }

            $result[substr($key, $prefixLength)] = $value;
        }

        return $result;
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
