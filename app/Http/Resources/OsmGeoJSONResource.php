<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OsmGeoJSONResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $properties = $this->resource->toArray();

        $geometry = json_decode($properties['geom']);
        unset($properties['geom']);

        return [
            'type' => 'Feature',
            'geometry' => $geometry,
            'properties' => $properties,
        ];
    }
}
