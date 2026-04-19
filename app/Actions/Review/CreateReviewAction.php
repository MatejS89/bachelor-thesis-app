<?php

namespace App\Actions\Review;

use App\Models\OsmData;
use App\Models\Review;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CreateReviewAction
{
    public function __construct(protected AddPhotosToReviewAction $addPhotosToReviewAction) {}

    public function execute(User $user, array $data, OsmData $osmData, ?array $photos): Review
    {
        return DB::transaction(function () use ($photos, $user, $osmData, $data) {
            $review = Review::make($data);

            $review->osmData()->associate($osmData);
            $review->user()->associate($user);

            $review->save();

            return $this->addPhotosToReviewAction->execute($review, $photos);
        });
    }
}
