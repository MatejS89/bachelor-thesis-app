<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use RuntimeException;
use Symfony\Component\Process\Process;

class OsmDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $osmFile = database_path('osm/data.osm.pbf');
        $styleFile = database_path('osm/style.lua');

        if (! file_exists($osmFile)) {
            $this->command->warn('OSM data file not found at: '.$osmFile);

            return;
        }

        if (! file_exists($styleFile)) {
            $this->command->warn('Lua style file not found at: '.$styleFile);

            return;
        }

        $config = config('database.connections.pgsql');

        if (! $config) {
            $this->command->error('PostgreSQL configuration not found.');

            return;
        }

        $this->command->info('Importing OSM data from '.$osmFile.'...');

        $process = new Process([
            'osm2pgsql',
            '--create',
            '--slim',
            '--database='.$config['database'],
            '--host='.$config['host'],
            '--port='.$config['port'],
            '--user='.$config['username'],
            '--output=flex',
            '--style='.$styleFile,
            $osmFile,
        ]);

        $process->setTimeout(3600);
        $process->setEnv(['PGPASSWORD' => $config['password']]);

        $process->run(function ($type, $buffer) {
            $this->command->getOutput()->write($buffer);
        });

        if (! $process->isSuccessful()) {
            $this->command->error('OSM import failed.');
            throw new RuntimeException($process->getErrorOutput());
        }

        $this->command->info('OSM data imported successfully.');
    }
}
