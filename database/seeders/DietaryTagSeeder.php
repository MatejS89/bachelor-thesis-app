<?php

namespace Database\Seeders;

use App\Models\DietaryTag;
use Illuminate\Database\Seeder;

class DietaryTagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dietaryTags = [
            'Vegan',
            'Vegetarian',
            'Halal',
            'Kosher',
        ];

        foreach ($dietaryTags as $tag) {
            DietaryTag::firstOrCreate([
                'name' => $tag,
            ]);
        }
    }
}
