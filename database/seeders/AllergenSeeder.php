<?php

namespace Database\Seeders;

use App\Models\Allergen;
use Illuminate\Database\Seeder;

class AllergenSeeder extends Seeder
{
    public function run(): void
    {
        $allergens = [
            'Cereals (Gluten)',
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

        foreach ($allergens as $index => $allergen) {
            Allergen::firstOrCreate(
                ['name' => $allergen],
                ['label' => $index + 1]
            );
        }
    }
}
