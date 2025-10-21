<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return
            [
                'id' => $this->id,
                'uuid' => $this->uuid,
                'fullName' => $this->fullName,
                'email' => $this->email,
                'avatar_url' => $this->avatar_url,
                'access_token' => $this->access_token,
                'refresh_token' => $this->refresh_token,
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at,
            ];
    }
}
