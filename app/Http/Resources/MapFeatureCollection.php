<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class MapFeatureCollection extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return [
            'type' => 'FeatureCollection',
            'features' => $this->collection,
        ];
    }
}

