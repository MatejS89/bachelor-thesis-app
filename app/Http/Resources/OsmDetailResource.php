<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OsmDetailResource extends JsonResource
{
    public static $wrap = null;

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'cuisine' => $this->cuisine,
            'street' => $this->street,
            'city' => $this->city,
            'geom' => json_decode($this->geom),
        ];
    }
}
