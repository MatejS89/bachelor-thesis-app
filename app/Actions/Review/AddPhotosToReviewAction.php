<?php

namespace App\Actions\Review;

use App\Models\Review;
use Spatie\MediaLibrary\MediaCollections\Exceptions\FileDoesNotExist;
use Spatie\MediaLibrary\MediaCollections\Exceptions\FileIsTooBig;

class AddPhotosToReviewAction
{
    /**
     * @throws FileDoesNotExist
     * @throws FileIsTooBig
     */
    public function execute(Review $review, ?array $photos): Review
    {
        if (! empty($photos)) {
            foreach ($photos as $photo) {
                $review->addMedia($photo)
                    ->toMediaCollection('photos');
            }
        }

        return $review;
    }
}
