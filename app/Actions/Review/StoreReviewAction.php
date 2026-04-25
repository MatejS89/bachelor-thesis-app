<?php

namespace App\Actions\Review;

use App\Models\OsmData;
use App\Models\Review;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class StoreReviewAction
{
    public function __construct(protected AddPhotosToReviewAction $addPhotosToReviewAction) {}

    public function execute(User $user, array $data, OsmData $osmData, ?array $photos): Review
    {
        return DB::transaction(function () use ($user, $data, $osmData, $photos) {
            $review = $user->reviews()->make($data);
            $review->osmData()->associate($osmData);
            $review->save();

            if (! empty($photos)) {
                $review = $this->addPhotosToReviewAction->execute($review, $photos);
            }

            return $review;
        });
    }
}
