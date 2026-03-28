<?php

namespace App\Actions\OsmData;

use App\Models\OsmData;
use Illuminate\Validation\ValidationException;
use Spatie\MediaLibrary\MediaCollections\Exceptions\FileDoesNotExist;
use Spatie\MediaLibrary\MediaCollections\Exceptions\FileIsTooBig;

class PhotoUpdateOsmData
{
    public function handle(OsmData $feature, array $images): OsmData
    {
        foreach ($images as $index => $image) {
            try {
                $feature->addMedia($image)->toMediaCollection('gallery');
            } catch (FileDoesNotExist|FileIsTooBig $e) {
                throw ValidationException::withMessages([
                    "images.{$index}" => 'This specific image failed to process on the server.',
                ]);
            }
        }

        return $feature;
    }
}
