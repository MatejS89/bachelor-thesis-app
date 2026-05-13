<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schema;
use Symfony\Component\Console\Output\ConsoleOutput;

return new class extends Migration
{
    public function up(): void
    {
        Artisan::call('osm:import', [], $this->getOutput());
    }

    public function down(): void
    {
        foreach (['osm2pgsql_properties', 'planet_osm_nodes', 'planet_osm_ways', 'planet_osm_rels'] as $t) {
            Schema::dropIfExists($t);
        }
    }

    private function getOutput()
    {
        return app(ConsoleOutput::class);
    }
};
