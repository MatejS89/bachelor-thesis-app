<?php

namespace App\Http\Controllers;

use App\Actions\Review\StoreReviewAction;
use App\Data\OsmData\OsmFeatureData;
use App\Http\Requests\Review\StoreReviewRequest;
use App\Models\OsmData;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ReviewController extends Controller
{
    /**
     * Show the form for creating a new resource.
     */
    public function create(OsmData $osmData, Request $request)
    {
        Gate::authorize('create', Review::class);

        return Inertia::render('review/CreateReview', [
            'osmData' => OsmFeatureData::from($osmData),
            'maxPhotos' => config('file-uploads.max_review_photos'),
            'maxPhotoSizeKb' => config('file-uploads.max_photo_size_in_kb'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReviewRequest $request, OsmData $osmData, StoreReviewAction $createReviewAction): RedirectResponse
    {
        Gate::authorize('create', Review::class);

        $createReviewAction->execute(
            auth()->user(),
            $request->validated(),
            $osmData,
            $request->file('photos')
        );

        return redirect()->route('map.show', $osmData);
    }
}
