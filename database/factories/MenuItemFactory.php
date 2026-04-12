<?php

namespace Database\Factories;

use App\Models\MenuItem;
use App\Models\OsmData;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MenuItem>
 */
class MenuItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'description' => $this->faker->text(),
            'osm_data_id' => OsmData::inRandomOrder()->value('id'),
        ];
    }
}
