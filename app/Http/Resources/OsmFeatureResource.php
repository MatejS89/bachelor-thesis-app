<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OsmFeatureResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $properties = $this->resource->toArray();

        unset($properties['geom']);
        unset($properties['geometry']);

        return [
            'type' => 'Feature',
            'geometry' => json_decode($this->resource->geometry),
            'properties' => $properties,
        ];
    }
}
