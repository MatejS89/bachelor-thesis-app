<?php

namespace Database\Seeders;

use App\Models\Allergen;
use Illuminate\Database\Seeder;

class AllergenSeeder extends Seeder
{
    public function run(): void
    {
        $allergens = [
            'Cereals',
            'Crustaceans',
            'Eggs',
            'Fish',
            'Peanuts',
            'Soybeans',
            'Milk',
            'Nuts',
            'Celery',
            'Mustard',
            'Sesame seeds',
            'Sulphur dioxide and sulphites',
            'Lupin',
            'Molluscs',
        ];

        foreach ($allergens as $allergen) {
            Allergen::firstOrCreate([
                'name' => $allergen,
            ]);
        }
    }
}
