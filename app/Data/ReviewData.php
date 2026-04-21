<?php

namespace App\Data;

use App\Data\User\UserMinData;
use Carbon\Carbon;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Lazy;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class ReviewData extends Data
{
    public int $id;

    public ?string $description;

    public int $rating;

    public Carbon $created_at;

    public Lazy|UserMinData $user;

    public array $photo_urls;
}
