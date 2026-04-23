<?php

namespace App\Data;

use Carbon\Carbon;
use Illuminate\Support\Collection;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Lazy;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class MenuItemData extends Data
{
    public int $id;

    public string $name;

    public string $description;

    public Carbon $createdAt;

    /** @var Collection<AllergenData>|Lazy */
    public Lazy|Collection $allergens;

    /** @var Collection<DietaryTagData>|Lazy */
    public Lazy|Collection $dietaryTags;

    public string $photoUrl;
}
