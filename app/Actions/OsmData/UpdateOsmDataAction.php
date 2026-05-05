<?php

namespace App\Actions\OsmData;

use App\Actions\Utils\SyncOrderedMediaAction;
use App\Data\UpdateOsmDataData;
use App\Models\OsmData;
use Illuminate\Support\Facades\DB;

class UpdateOsmDataAction
{
    public function __construct(protected SyncOrderedMediaAction $syncOrderedMediaAction) {}

    public function execute(OsmData $osmData, UpdateOsmDataData $data): OsmData
    {
        return DB::transaction(function () use ($osmData, $data) {
            $osmData->update($data->toModelAttributes($osmData));

            $this->syncOrderedMediaAction->execute($osmData, $data->photos);

            return $osmData;
        });
    }
}
