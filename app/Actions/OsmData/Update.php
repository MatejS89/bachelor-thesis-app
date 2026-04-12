<?php

namespace App\Actions\OsmData;

use App\Models\OsmData;
use Illuminate\Validation\ValidationException;

class Update
{
    public function __construct(
        public PhotoUpdate $photoUpdateOsmData,
    ) {}

    /**
     * @throws ValidationException
     */
    public function handle(OsmData $feature, array $images): OsmData
    {
        $this->photoUpdateOsmData->handle($feature, $images);

        return $feature;
    }
}
