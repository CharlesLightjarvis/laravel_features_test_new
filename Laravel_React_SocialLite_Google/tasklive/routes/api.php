<?php

use App\Http\Controllers\Auth\Google\GoogleAuthController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Auth\SocialiteController;
use Illuminate\Support\Facades\Request;

Route::get('auth', [GoogleAuthController::class, 'redirectToAuth']);
Route::get('auth/callback', [GoogleAuthController::class, 'handleAuthCallback']);

// Route::apiResource('users', UserController::class);

Route::middleware('auth:sanctum')->get('/user', [UserController::class, 'index']);
