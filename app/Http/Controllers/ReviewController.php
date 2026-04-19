<?php

namespace App\Http\Controllers;

use App\Actions\Review\CreateReviewAction;
use App\Http\Requests\StoreReviewRequest;
use App\Models\OsmData;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(OsmData $osmData)
    {
        return Inertia::render('review/Create', [
            'osmData' => $osmData,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReviewRequest $request, OsmData $osmData, CreateReviewAction $createReviewAction): RedirectResponse
    {
        $review = $createReviewAction->execute(
            auth()->user(),
            $request->validated(),
            $osmData,
            $request->file('photos')
        );

        return redirect()->route('map.show', $osmData);
    }

    /**
     * Display the specified resource.
     */
    public function show(Review $review)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Review $review)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Review $review)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Review $review)
    {
        //
    }
}
