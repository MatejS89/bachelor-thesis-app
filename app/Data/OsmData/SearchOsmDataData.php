<?php

namespace App\Data\OsmData;

use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;

class SearchOsmDataData extends Data
{
    public function __construct(
        #[Required, StringType]
        public string $search,
    ) {}
}
