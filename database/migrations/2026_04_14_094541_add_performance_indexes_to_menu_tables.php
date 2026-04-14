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
        Schema::table('menu_items', function (Blueprint $table) {
            $table->index('osm_data_id');
        });

        Schema::table('allergen_menu_item', function (Blueprint $table) {
            $table->unique(['menu_item_id', 'allergen_id']);
            $table->index('allergen_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('menu_items', function (Blueprint $table) {
            $table->dropIndex(['osm_data_id']);
        });

        Schema::table('allergen_menu_item', function (Blueprint $table) {
            $table->dropUnique(['menu_item_id', 'allergen_id']);
            $table->dropIndex(['allergen_id']);
        });
    }
};
