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
            'properties' => [
                'id' => $this->id,
                'name' => $this->name,
            ],
            'geometry' => $this->geom,
        ];
    }
}

