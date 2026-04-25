<?php

namespace App\Actions\Utils;

use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class SyncOrderedMediaAction
{
    public static function execute(HasMedia $model, ?array $mediaItems, string $collectionName = 'photos'): HasMedia
    {
        $orderedMediaIds = collect($mediaItems ?? [])
            ->map(function ($item) use ($model, $collectionName) {
                if (filter_var($item['isExisting'] ?? false, FILTER_VALIDATE_BOOLEAN)) {
                    return $item['id'];
                }

                if (isset($item['file'])) {
                    return $model->addMedia($item['file'])
                        ->toMediaCollection($collectionName)
                        ->id;
                }

                return null;
            })
            ->filter()
            ->toArray();

        $mediaToKeep = $model->getMedia($collectionName)->whereIn('id', $orderedMediaIds);

        $model->clearMediaCollectionExcept($collectionName, $mediaToKeep);

        if (! empty($orderedMediaIds)) {
            Media::setNewOrder($orderedMediaIds);
        }

        return $model;
    }
}
