<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Category extends Model
{
    protected $connection = 'mongodb';
    protected $table = 'categories';

    protected $fillable = [
        'name', 'slug', 'description', 'product_type', 'image', 'is_active', 'sort_order',
    ];

    protected $casts = ['is_active' => 'boolean', 'sort_order' => 'integer'];
}
