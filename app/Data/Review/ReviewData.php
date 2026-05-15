<?php

namespace App\Data\Review;

use App\Data\PhotoData;
use App\Data\User\UserMinData;
use App\Models\Review;
use Carbon\Carbon;
use Illuminate\Support\Collection;
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

    /** @var Lazy|Collection<PhotoData> */
    public Lazy|Collection $photos;

    public static function fromModel(Review $review): self
    {
        return self::from([
            'id' => $review->id,
            'description' => $review->description,
            'rating' => $review->rating,
            'created_at' => $review->created_at,
            'user' => Lazy::whenLoaded('user', $review, fn () => UserMinData::from($review->user)),
            'photos' => Lazy::whenLoaded('media', $review, fn () => PhotoData::collect($review->getMedia('photos'))),
        ]);
    }
}
