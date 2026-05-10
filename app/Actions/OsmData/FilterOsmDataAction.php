<?php

namespace App\Actions\OsmData;

use App\Actions\Utils\CreatePolygonFromBBox;
use App\Data\OsmData\FilterOsmDataData;
use App\Models\OsmData;
use Illuminate\Database\Eloquent\Collection;
use MatanYadaev\EloquentSpatial\Objects\Point;

readonly class FilterOsmDataAction
{
    public function __construct(
        private CreatePolygonFromBBox $createPolygonFromBBox,
    ) {}

    public function execute(FilterOsmDataData $data): Collection
    {
        $bbox = $this->createPolygonFromBBox->handle(
            $data->south,
            $data->west,
            $data->north,
            $data->east,
        );

        $userPoint = $data->userLat !== null && $data->userLng !== null
            ? new Point($data->userLat, $data->userLng)
            : null;

        return OsmData::query()
            ->select('name', 'id', 'geom', 'tags', 'type')
            ->with('media')
            ->when($bbox, fn ($q) => $q->whereWithin('geom', $bbox))
            ->when(
                $userPoint,
                fn ($q, Point $p) => $q
                    ->withDistanceSphere('geom', $p)
                    ->orderByDistanceSphere('geom', $p),
            )
            ->withSafeItemCounts($data->toArray())
            ->withAverageRating()
            ->get();
    }
}
