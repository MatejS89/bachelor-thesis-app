<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Attributes\Collects;
use Illuminate\Http\Resources\Json\ResourceCollection;

#[Collects(OsmGeoJSONResource::class)]
class OsmGeoJSONCollection extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        self::withoutWrapping();

        return [
            'type' => 'FeatureCollection',
            'features' => $this->collection,
        ];
    }
}
