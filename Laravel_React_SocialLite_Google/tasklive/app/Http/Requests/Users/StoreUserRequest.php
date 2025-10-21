<?php

namespace App\Http\Requests\Users;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'fullName' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'avatar_url' => 'nullable|string|max:255',
            'access_token' => 'nullable|string|max:255',
            'refresh_token' => 'nullable|string|max:255',
        ];
    }

    public function messages()
    {
        return [
            'fullName.required' => 'fullName is required',
            'fullName.string' => 'fullName must be a string',
            'fullName.max' => 'fullName must not be greater than 255 characters',
            'email.required' => 'Email is required',
            'email.email' => 'Email must be a valid email address',
            'email.unique' => 'Email already exists',
        ];
    }
}
