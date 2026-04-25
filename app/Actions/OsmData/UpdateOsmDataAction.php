<?php

namespace App\Actions\OsmData;

use App\Actions\Utils\SyncOrderedMediaAction;
use App\Models\OsmData;
use Illuminate\Support\Facades\DB;

class UpdateOsmDataAction
{
    public function __construct(protected SyncOrderedMediaAction $syncOrderedMediaAction) {}

    public function execute(OsmData $osmData, array $data, array $photos): OsmData
    {
        return DB::transaction(function () use ($osmData, $data, $photos) {
            $osmData->update($data);

            $this->syncOrderedMediaAction->execute($osmData, $photos);

            return $osmData;
        });
    }
}
