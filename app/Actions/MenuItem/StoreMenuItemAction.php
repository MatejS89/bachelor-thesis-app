<?php

namespace App\Actions\MenuItem;

use App\Models\MenuItem;
use App\Models\OsmData;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class StoreMenuItemAction
{
    public function __construct(protected StoreMenuItemPhotoAction $storeMenuItemPhotoAction) {}

    public function execute(array $data, OsmData $osmData, ?UploadedFile $photo): MenuItem
    {
        return DB::transaction(function () use ($data, $osmData, $photo) {
            $menuItem = $osmData->menuItems()->create(
                Arr::except($data, ['allergens', 'dietary_tags'])
            );

            $menuItem->allergens()->sync($data['allergens'] ?? []);
            $menuItem->dietaryTags()->sync($data['dietary_tags'] ?? []);

            if ($photo) {
                $menuItem = $this->storeMenuItemPhotoAction->execute($menuItem, $photo);
            }

            return $menuItem;
        });
    }
}
