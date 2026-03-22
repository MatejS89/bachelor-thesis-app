<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('osm_data', function (Blueprint $table) {
            $table->id();
            $table->string('osm_type')->nullable();
            $table->bigInteger('osm_id')->nullable();
            $table->text('name')->nullable();
            $table->text('type')->nullable();
            $table->text('cuisine')->nullable();
            $table->text('opening_hours')->nullable();
            $table->text('street')->nullable();
            $table->text('housenumber')->nullable();
            $table->text('city')->nullable();
            $table->text('postcode')->nullable();
            $table->text('website')->nullable();
            $table->text('phone')->nullable();
            $table->text('email')->nullable();
            $table->geometry('geom', 'POINT', 4326);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('osm_data');
    }
};
