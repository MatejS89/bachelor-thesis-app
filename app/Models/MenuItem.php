<?php

namespace App\Models;

use Database\Factories\MenuItemFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

#[Fillable(['name', 'description'])]
class MenuItem extends Model implements HasMedia
{
    /** @use HasFactory<MenuItemFactory> */
    use HasFactory;

    use InteractsWithMedia;

    public function allergens(): BelongsToMany
    {
        return $this->belongsToMany(Allergen::class);
    }

    public function dietaryTags(): BelongsToMany
    {
        return $this->belongsToMany(DietaryTag::class);
    }

    public function osmData(): BelongsTo
    {
        return $this->belongsTo(OsmData::class);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('photo')->singleFile();
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(500)
            ->height(500)
            ->nonQueued();
    }

    public function photoUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->getFirstMediaUrl('photo', 'thumb') ?: null
        );
    }

    public function scopeWithoutAllergens($query, array $allergens)
    {
        if (empty($allergens)) {
            return $query;
        }

        return $query->whereNotExists(function ($q) use ($allergens) {
            $q->selectRaw('1')
                ->from('allergen_menu_item')
                ->whereColumn('allergen_menu_item.menu_item_id', 'menu_items.id')
                ->whereIn('allergen_menu_item.allergen_id', $allergens);
        });
    }
}
