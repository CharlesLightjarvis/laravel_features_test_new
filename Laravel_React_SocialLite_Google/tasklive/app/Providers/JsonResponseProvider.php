<?php

namespace App\Providers;

use Illuminate\Support\Facades\Response;
use Illuminate\Support\ServiceProvider;

class JsonResponseProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Response::macro('success', function ($data, $dataName = 'data', $message = 'Success', $code = 200) {
            return response()->json([
                'status' => 'success',
                'message' => $message,
                $dataName => $data,
            ], $code);
        });

        Response::macro('error', function ($message = 'Error', $code = 400) {
            return response()->json([
                'status' => 'error',
                'message' => $message,
            ], $code);
        });
    }
}
