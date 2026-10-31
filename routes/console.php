<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

Artisan::command('storefront:ping-mongodb', function (): void {
    DB::connection('mongodb')->getMongoDB()->command(['ping' => 1]);
    $this->info('MongoDB connection is healthy.');
})->purpose('Check the configured MongoDB connection');
