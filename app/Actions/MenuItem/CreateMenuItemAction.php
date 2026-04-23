<?php

namespace App\Actions\MenuItem;

use App\Models\MenuItem;
use App\Models\OsmData;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class CreateMenuItemAction
{
    public function __construct(protected StoreMenuItemPhotoAction $storeMenuItemPhotosAction) {}

    public function execute(array $data, OsmData $osmData, ?UploadedFile $photo): MenuItem
    {
        return DB::transaction(function () use ($data, $osmData, $photo) {
            $menuItem = $osmData->menuItems()->create(
                Arr::except($data, ['allergens', 'dietary_tags'])
            );

            $menuItem->allergens()->sync($data['allergens'] ?? []);
            $menuItem->dietaryTags()->sync($data['dietary_tags'] ?? []);

            if ($photo) {
                $this->storeMenuItemPhotosAction->execute($menuItem, $photo);
            }

            return $menuItem;
        });
    }
}
