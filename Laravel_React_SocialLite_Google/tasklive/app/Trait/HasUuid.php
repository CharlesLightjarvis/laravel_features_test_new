<?php

namespace App\Trait;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;


trait HasUuid
{
    /**
     * Boot the trait
     */
    protected static function bootHasUuid()
    {
        static::creating(function (Model $model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }

    /**
     * Get the route key for the model
     */
    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    /**
     * Get the auto-incrementing key type
     */
    public function getKeyType(): string
    {
        return 'string';
    }

    /**
     * Get whether the key auto-increments
     */
    public function getIncrementing(): bool
    {
        return false;
    }
}
