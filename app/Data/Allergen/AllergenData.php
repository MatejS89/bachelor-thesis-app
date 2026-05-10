<?php

namespace App\Data\Allergen;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class AllergenData extends Data
{
    public int $id;

    public string $name;
}
