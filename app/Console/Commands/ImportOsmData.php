<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;

#[Signature('osm:import
    {file? : Path to the .osm or .osm.pbf file (defaults to database/osm/data.osm.pbf)}
    {--style= : Path to the osm2pgsql Lua style file (defaults to database/osm/style.lua)}
    {--connection=pgsql : Database connection to use}
    {--append : Append to existing OSM tables instead of recreating them}
    {--timeout=3600 : Process timeout in seconds (0 to disable)}')]
#[Description('Import OpenStreetMap data into the database using osm2pgsql.')]
class ImportOsmData extends Command
{
    public function handle(): int
    {
        $osmFile = $this->argument('file') ?? database_path('osm/data.osm.pbf');
        $styleFile = $this->option('style') ?? database_path('osm/style.lua');

        if (! file_exists($osmFile)) {
            $this->error("OSM data file not found at: {$osmFile}");

            return self::FAILURE;
        }

        if (! file_exists($styleFile)) {
            $this->error("Lua style file not found at: {$styleFile}");

            return self::FAILURE;
        }

        $connection = $this->option('connection');
        $config = config("database.connections.{$connection}");

        if (! $config) {
            $this->error("Database connection [{$connection}] is not configured.");

            return self::FAILURE;
        }

        $this->info("Importing OSM data from {$osmFile} into [{$connection}]...");

        $process = new Process([
            'osm2pgsql',
            $this->option('append') ? '--append' : '--create',
            '--slim',
            '--database='.$config['database'],
            '--host='.$config['host'],
            '--port='.$config['port'],
            '--user='.$config['username'],
            '--output=flex',
            '--style='.$styleFile,
            $osmFile,
        ]);

        $process->setTimeout(((int) $this->option('timeout')) ?: null);
        $process->setEnv(['PGPASSWORD' => $config['password'] ?? '']);

        try {
            $process->mustRun(function (string $type, string $buffer): void {
                $this->output->write($buffer);
            });
        } catch (ProcessFailedException $e) {
            $this->error('OSM import failed.');
            $this->line($e->getProcess()->getErrorOutput());

            return self::FAILURE;
        }

        $this->info('OSM data imported successfully.');

        return self::SUCCESS;
    }
}
