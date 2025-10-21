<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Trait\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles, HasUuid, HasApiTokens;

    protected $fillable = [
        'uuid',
        'fullName',
        'email',
        'avatar_url',
        'provider_id',
        'provider',
        'access_token',
        'refresh_token',
        'email_verified_at',
        // 'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    protected function projects()
    {
        return $this->hasMany(Project::class, 'owner_id');
    }

    protected function projectsMembers()
    {
        return $this->belongsToMany(Project::class, 'project_user', 'project_id', 'user_id')
            ->withTimestamps();
    }
}
