<?php

namespace App\Http\Services;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class UserService
{
    public function getAllUsers(): AnonymousResourceCollection
    {
        $users = User::all();
        return UserResource::collection($users);
    }

    public function getUserById($id): UserResource
    {
        $user = User::find($id);
        return new UserResource($user);
    }

    public function createUser($data): UserResource
    {
        $user = new User();
        $user->fullName = $data['fullName'];
        $user->email = $data['email'];
        $user->avatar_url = $data['avatar_url'];
        $user->access_token = $data['access_token'];
        $user->refresh_token = $data['refresh_token'];
        $user->save();
        return new UserResource($user);
    }

    public function updateUser($id, $data): UserResource
    {
        $user = User::find($id);
        $user->fullName = $data['fullName'];
        $user->email = $data['email'];
        $user->avatar_url = $data['avatar_url'];
        $user->save();
        return new UserResource($user);
    }

    public function deleteUser($id): void
    {
        $user = User::find($id);
        $user->delete();
    }
}
