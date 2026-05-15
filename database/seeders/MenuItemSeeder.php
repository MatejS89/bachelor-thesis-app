<?php

namespace Database\Seeders;

use App\Models\Allergen;
use App\Models\DietaryTag;
use App\Models\MenuItem;
use App\Models\OsmData;
use Illuminate\Database\Seeder;

class MenuItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $allergenIds = Allergen::pluck('id');
        $dietaryTagIds = DietaryTag::pluck('id');
        $osmDataIds = OsmData::pluck('id');

        MenuItem::factory()
            ->count(10000)
            ->state(fn () => ['osm_data_id' => $osmDataIds->random()])
            ->afterCreating(function (MenuItem $menuItem) use ($allergenIds, $dietaryTagIds) {
                $menuItem->allergens()->attach(
                    $allergenIds->random(rand(1, 3))
                );

                $menuItem->dietaryTags()->attach(
                    $dietaryTagIds->random(rand(0, 2))
                );
            })
            ->create();
    }
}
