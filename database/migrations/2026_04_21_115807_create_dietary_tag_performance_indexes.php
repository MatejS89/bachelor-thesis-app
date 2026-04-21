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
        Schema::table('dietary_tag_menu_item', function (Blueprint $table) {
            $table->unique(['menu_item_id', 'dietary_tag_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dietary_tag_menu_item', function (Blueprint $table) {
            $table->dropUnique(['menu_item_id', 'dietary_tag_id']);
        });
    }
};
