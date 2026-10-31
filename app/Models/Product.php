<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Product extends Model
{
    protected $connection = 'mongodb';
    protected $table = 'products';

    protected $fillable = [
        'seller_id', 'category_id', 'name', 'slug', 'sku', 'brand', 'product_type',
        'short_description', 'description', 'price_minor', 'compare_at_price_minor',
        'currency', 'stock', 'track_inventory', 'images', 'video', 'attributes',
        'tags', 'is_featured', 'status',
    ];

    protected $casts = [
        'price_minor' => 'integer',
        'compare_at_price_minor' => 'integer',
        'stock' => 'integer',
        'track_inventory' => 'boolean',
        'images' => 'array',
        'video' => 'array',
        'attributes' => 'array',
        'tags' => 'array',
        'is_featured' => 'boolean',
    ];
}
