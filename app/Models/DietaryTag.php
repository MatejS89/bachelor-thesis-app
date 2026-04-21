<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class DietaryTag extends Model
{
    public function menuItems(): BelongsToMany
    {
        return $this->belongsToMany(MenuItem::class);
    }
}
