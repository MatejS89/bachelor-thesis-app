<?php

namespace App\Models;

use Database\Factories\ReviewFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

#[Fillable(['rating', 'description', 'user_id', 'osm_data_id'])]
class Review extends Model implements HasMedia
{
    /** @use HasFactory<ReviewFactory> */
    use HasFactory;

    use InteractsWithMedia;

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

    public function osmData(): BelongsTo
    {
        return $this->belongsTo(OsmData::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('photos');
    }

    public function photoUrls(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->getMedia('photos')->map->getUrl()->toArray(),
        );
    }
}
