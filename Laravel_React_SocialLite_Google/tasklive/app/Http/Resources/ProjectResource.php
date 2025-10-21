<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
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
                'name' => $this->name,
                'description' => $this->description,
                'owner' => [ // Ajout des informations de l'utilisateur
                    'id' => $this->owner_id,
                    'fullName' => $this->owner->fullName, // Assurez-vous que la relation 'owner' est définie
                    'email' => $this->owner->email,
                    'avatar_url' => $this->owner->avatar_url,
                ],
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at,
            ];
    }
}
