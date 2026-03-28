<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OsmDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        self::withoutWrapping();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'cuisine' => $this->cuisine,
            'street' => $this->street,
            'city' => $this->city,
            'geom' => json_decode($this->geom),
            'gallery_images' => $this->getMedia('gallery')->map(function ($media) {
                return [
                    'id' => $media->id,
                    'url' => $media->getUrl(),
                    'thumb_url' => $media->getUrl('thumb'),
                    'order' => $media->order_column,
                ];
            })->toArray(),
        ];
    }
}
