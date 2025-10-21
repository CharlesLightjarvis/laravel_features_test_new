<?php

namespace App\Providers;

use App\Enums\ApiStatus;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\ServiceProvider;

class JsonResponseProvider extends ServiceProvider
{
    public function boot(): void
    {
        Response::macro('jsonResponseSuccess', function ($data, $payloadName = 'data', $message = null, $status = 200) {
            return Response::json([
                $payloadName => $data,
                'message' => $message,
                'status' => ApiStatus::SUCCESS,
            ], $status);
        });

        Response::macro('jsonResponseError', function ($data, $payloadName = 'data', $message = null, $status = 200,) {
            return Response::json([
                $payloadName => $data,
                'message' => $message,
                'status' => ApiStatus::ERROR,
            ], $status);
        });
    }
}
