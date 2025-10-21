<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('messages')->get();

        return Response::jsonResponseSuccess($users, 'users', 'Users fetched successfully', 200);
    }
}
