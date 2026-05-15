<?php

namespace Database\Factories;

use App\Models\OsmData;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Review>
 */
class ReviewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'rating' => $this->faker->numberBetween(1, 5),
            'description' => $this->faker->paragraph(),
            'user_id' => User::inRandomOrder()->value('id'),
            'osm_data_id' => OsmData::inRandomOrder()->value('id'),
        ];
    }
}
