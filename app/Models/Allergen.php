<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Allergen extends Model
{
    public function menuItems(): BelongsToMany
    {
        return $this->belongsToMany(MenuItem::class);
    }

    protected static function booted(): void
    {
        static::addGlobalScope('orderByLabel', function (Builder $builder) {
            $builder->orderBy('label');
        });
    }
}
