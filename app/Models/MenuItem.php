<?php

namespace App\Models;

use Database\Factories\MenuItemFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\DB;

class MenuItem extends Model
{
    /** @use HasFactory<MenuItemFactory> */
    use HasFactory;

    public function allergens(): BelongsToMany
    {
        return $this->belongsToMany(Allergen::class);
    }

    public function dietaryTags(): BelongsToMany
    {
        return $this->belongsToMany(DietaryTag::class);
    }

    public function scopeWithoutAllergens($query, array $allergens)
    {
        if (empty($allergens)) {
            return $query;
        }

        return $query->whereNotExists(function ($q) use ($allergens) {
            $q->select(DB::raw(1))
                ->from('allergen_menu_item')
                ->whereColumn('allergen_menu_item.menu_item_id', 'menu_items.id')
                ->whereIn('allergen_menu_item.allergen_id', $allergens);
        });
    }
}
