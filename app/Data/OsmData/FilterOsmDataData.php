<?php

namespace App\Data\OsmData;

use Spatie\LaravelData\Attributes\Validation\ArrayType;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Numeric;
use Spatie\LaravelData\Attributes\Validation\RequiredWith;
use Spatie\LaravelData\Data;

class FilterOsmDataData extends Data
{
    /**
     * @param  array<int, string|int>|null  $allergens
     */
    public function __construct(
        #[Nullable, Numeric, RequiredWith('west', 'north', 'east')]
        public ?float $south = null,

        #[Nullable, Numeric, RequiredWith('south', 'north', 'east')]
        public ?float $west = null,

        #[Nullable, Numeric, RequiredWith('south', 'west', 'east')]
        public ?float $north = null,

        #[Nullable, Numeric, RequiredWith('south', 'west', 'north')]
        public ?float $east = null,

        #[Nullable, Numeric]
        public ?float $userLat = null,

        #[Nullable, Numeric]
        public ?float $userLng = null,

        #[Nullable, ArrayType]
        public ?array $allergens = null,
    ) {}
}
