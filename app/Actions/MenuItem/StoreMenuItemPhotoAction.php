<?php

namespace App\Actions\MenuItem;

use App\Models\MenuItem;
use Illuminate\Http\UploadedFile;

class StoreMenuItemPhotoAction
{
    public function execute(MenuItem $menuItem, UploadedFile $photo): MenuItem
    {
        $menuItem->addMedia($photo)->toMediaCollection('photo');

        return $menuItem;
    }
}
