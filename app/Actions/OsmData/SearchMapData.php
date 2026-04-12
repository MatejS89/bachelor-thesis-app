<?php

namespace App\Actions\OsmData;

use App\Models\OsmData;
use Illuminate\Database\Eloquent\Collection;

class SearchMapData
{
    public function execute(?string $searchQuery): Collection
    {
        return OsmData::query()
            ->where('name', 'ilike', "%{$searchQuery}%")
            ->get('name');
    }
}
