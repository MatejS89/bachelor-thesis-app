<?php

namespace App\Data;

readonly class BoundingBox
{
    public float $north;
    public float $south;
    public float $east;
    public float $west;

    public function __construct(
        float $north,
        float $south,
        float $east,
        float $west
    ) {
        $this->north = $north;
        $this->south = $south;
        $this->east = $east;
        $this->west = $west;
    }

    /**
     * Create a new instance from an array.
     */
    public static function fromArray(array $data): self
    {
        return new self(
            north: (float) $data['north'],
            south: (float) $data['south'],
            east: (float) $data['east'],
            west: (float) $data['west'],
        );
    }
}

