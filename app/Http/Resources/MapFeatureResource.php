<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MapFeatureResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'type' => 'Feature',
            'id' => $this->id,
            'geometry' => $this->geom,
            'properties' => [
                'name' => $this->name,
                'total_items_count' => $this->total_items_count,
                'safe_items_count' => $this->safe_items_count,
                'average_rating' => $this->average_rating !== null ? (float) $this->average_rating : null,
                'distance' => $this->distance ?? null,
                'opening_hours' => $this->tags['opening_hours'] ?? null,
                'cuisine' => $this->tags['cuisine'] ?? null,
                'amenity' => $this->type,
                'thumbnail_url' => $this->getFirstMediaUrl('photos', 'thumb') ?: null,
            ],
        ];
    }
}
