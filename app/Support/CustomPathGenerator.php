<?php

namespace App\Support;

// use App\Models\MenuItem;
use App\Models\OsmData;
// use App\Models\Review;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\MediaLibrary\Support\PathGenerator\PathGenerator;

class CustomPathGenerator implements PathGenerator
{
    protected function getBasePath(Media $media): string
    {
        $rootFolder = match ($media->model_type) {
            OsmData::class => 'restaurants',
            //            Review::class => 'reviews',
            //            MenuItem::class => 'menu_items',
            default => 'misc',
        };

        $hash = substr(md5($media->model_id.config('app.key')), 0, 12);

        return $rootFolder.'/'.$hash.'/';
    }

    public function getPath(Media $media): string
    {
        return $this->getBasePath($media).$media->uuid;
    }

    public function getPathForConversions(Media $media): string
    {
        return $this->getBasePath($media).'conversions/'.$media->uuid;
    }

    public function getPathForResponsiveImages(Media $media): string
    {
        return $this->getPath($media).'responsive/';
    }
}
