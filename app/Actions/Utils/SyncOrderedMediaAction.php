<?php

namespace App\Actions\Utils;

use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class SyncOrderedMediaAction
{
    public function execute(HasMedia $model, ?array $mediaItems, string $collectionName = 'photos'): HasMedia
    {
        $ownedIds = $model->getMedia($collectionName)->pluck('id')->map(fn ($id) => (int) $id)->all();

        $orderedIds = [];

        foreach ($mediaItems as $item) {
            $orderedIds[] = match ($item->kind) {
                'existing' => in_array($item->id, $ownedIds, true)
                    ? $item->id
                    : throw new \DomainException("Media {$item->id} does not belong to this model"),
                'new' => $model
                    ->addMedia($item->file)
                    ->toMediaCollection($collectionName)
                    ->id,
            };
        }

        $toKeep = $model->getMedia($collectionName)->whereIn('id', $orderedIds);
        $model->clearMediaCollectionExcept($collectionName, $toKeep);

        if (! empty($orderedIds)) {
            Media::setNewOrder($orderedIds);
        }

        return $model;
    }
}
