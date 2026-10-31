<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Throwable;

class EnsureStoreIndexes extends Command
{
    protected $signature = 'storefront:ensure-indexes';

    protected $description = 'Create the MongoDB indexes used by the public catalogue and store admin.';

    public function handle(): int
    {
        try {
            $database = DB::connection('mongodb')->getMongoDB();

            $database->selectCollection('users')->createIndex(
                ['email' => 1],
                ['unique' => true, 'name' => 'users_email_unique'],
            );
            $database->selectCollection('users')->createIndex(
                ['role' => 1, 'is_active' => 1, 'created_at' => -1],
                ['name' => 'users_by_role_status_created'],
            );
            $database->selectCollection('users')->createIndex(
                ['role' => 1, 'created_at' => -1],
                ['name' => 'users_customers_created'],
            );
            $database->selectCollection('users')->createIndex(
                ['role' => 1, 'name' => 1],
                ['name' => 'users_customers_name'],
            );
            $database->selectCollection('users')->createIndex(
                ['role' => 1, 'email' => 1],
                ['name' => 'users_customers_email'],
            );

            $database->selectCollection('categories')->createIndex(
                ['slug' => 1],
                ['unique' => true, 'name' => 'categories_slug_unique'],
            );
            $database->selectCollection('categories')->createIndex(
                ['is_active' => 1, 'sort_order' => 1],
                ['name' => 'categories_active_sorted'],
            );

            $products = $database->selectCollection('products');
            $products->createIndex(
                ['slug' => 1],
                ['unique' => true, 'name' => 'products_slug_unique'],
            );
            $products->createIndex(
                ['product_type' => 1, 'status' => 1, 'created_at' => -1],
                ['name' => 'products_public_catalog'],
            );
            $products->createIndex(
                ['seller_id' => 1, 'status' => 1],
                ['name' => 'products_by_seller'],
            );
            $products->createIndex(
                ['seller_id' => 1, 'created_at' => -1],
                ['name' => 'products_seller_created'],
            );
            $products->createIndex(
                ['status' => 1, 'created_at' => -1],
                ['name' => 'products_status_created'],
            );
            $products->createIndex(
                ['status' => 1, 'is_featured' => 1, 'created_at' => -1],
                ['name' => 'products_featured_latest'],
            );
            $products->createIndex(
                ['status' => 1, 'video.url' => 1, 'updated_at' => -1],
                ['name' => 'products_published_videos'],
            );
        } catch (Throwable $exception) {
            report($exception);
            $this->error('Store indexes could not be created. Check MongoDB access and whether duplicate values prevent a unique index.');
            return self::FAILURE;
        }

        $this->info('Storefront, product video and customer administration indexes are ready.');

        return self::SUCCESS;
    }
}
