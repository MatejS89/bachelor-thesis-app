<?php

namespace App\Models;

use Database\Factories\MenuItemFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class MenuItem extends Model
{
    /** @use HasFactory<MenuItemFactory> */
    use HasFactory;

    public function allergens(): BelongsToMany
    {
        return $this->belongsToMany(Allergen::class);
    }

    public function scopeWithoutAllergens($query, array $allergens)
    {
        if (empty($allergens)) {
            return $query;
        }

        return $query->whereDoesntHave('allergens', fn ($allergenQuery) => $allergenQuery->whereIn('allergens.id', $allergens));
    }
}
