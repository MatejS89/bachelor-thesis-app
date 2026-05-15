<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use MatanYadaev\EloquentSpatial\Objects\Point;
use MatanYadaev\EloquentSpatial\Objects\Polygon;
use MatanYadaev\EloquentSpatial\Traits\HasSpatial;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

#[WithoutTimestamps]
#[Fillable(['name', 'type', 'tags'])]
class OsmData extends Model implements HasMedia
{
    use HasSpatial;
    use InteractsWithMedia;

    protected $casts = [
        'geom' => Point::class,
        'tags' => 'array',
    ];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('photos');
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(300)
            ->height(300)
            ->nonQueued();

        $this->addMediaConversion('carousel')
            ->width(1600)
            ->nonQueued();
    }

    public function menuItems(): HasMany
    {
        return $this->hasMany(MenuItem::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function scopeWithinMapBounds(Builder $query, Polygon $bbox): void
    {
        $query->whereWithin('geom', $bbox);
    }

    public function scopeWithSafeItemCounts(Builder $query, array $filter): void
    {
        $allergens = $filter['allergens'] ?? [];

        $query->withCount([
            'menuItems as total_items_count',
            'menuItems as safe_items_count' => fn ($menuQuery) => $menuQuery->withoutAllergens($allergens),
        ]);
    }

    public function scopeWithAverageRating(Builder $query): void
    {
        $query->withAvg('reviews as average_rating', 'rating');
    }

    public function loadAverageRating(): static
    {
        return $this->loadAvg('reviews as average_rating', 'rating');
    }
}
