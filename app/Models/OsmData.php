<?php

namespace App\Models;

use App\Data\BoundingBox;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use MatanYadaev\EloquentSpatial\Objects\Point;
use MatanYadaev\EloquentSpatial\Traits\HasSpatial;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

#[WithoutTimestamps]
class OsmData extends Model implements HasMedia
{
    use HasSpatial;
    use InteractsWithMedia;

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('gallery');
    }

    protected $casts = [
        'geom' => Point::class,
    ];

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(300)
            ->height(300)
            ->nonQueued();
    }

    public function scopeWithinBoundingBox($query, BoundingBox $box)
    {
        return $query->whereRaw(
            DB::raw('geom && ST_MakeEnvelope(?, ?, ?, ?, 4326)'),
            [$box->west, $box->south, $box->east, $box->north]
        );
    }
}
