<?php

namespace App\Models;

use Database\Factories\ReviewFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Review extends Model implements HasMedia
{
    /** @use HasFactory<ReviewFactory> */
    use HasFactory;

    use InteractsWithMedia;

    protected $fillable = [
        'rating',
        'description',
        'user_id',
        'osm_data_id',
    ];

    public function osmData(): BelongsTo
    {
        return $this->belongsTo(OsmData::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
