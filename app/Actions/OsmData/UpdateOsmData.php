<?php

namespace App\Actions\OsmData;

use App\Models\OsmData;
use Illuminate\Validation\ValidationException;

class UpdateOsmData
{
    public function __construct(
        public PhotoUpdateOsmData $photoUpdateOsmData,
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
