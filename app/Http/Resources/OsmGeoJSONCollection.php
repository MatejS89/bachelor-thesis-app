<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class OsmGeoJSONCollection extends ResourceCollection
{
    public static $wrap = null;

    public $collects = OsmGeoJSONResource::class;


    public function toArray(Request $request): array
    {
        return [
            'type' => 'FeatureCollection',
            'features' => $this->collection,
        ];
    }
}
