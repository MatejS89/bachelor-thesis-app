<?php

namespace Database\Seeders;

use App\Models\Allergen;
use App\Models\MenuItem;
use Illuminate\Database\Seeder;

class MenuItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $allergenIds = Allergen::pluck('id');

        MenuItem::factory()
            ->count(10000)
            ->afterCreating(function (MenuItem $menuItem) use ($allergenIds) {
                $menuItem->allergens()->attach(
                    $allergenIds->random(rand(1, 3))
                );
            })
            ->create();
    }
}
