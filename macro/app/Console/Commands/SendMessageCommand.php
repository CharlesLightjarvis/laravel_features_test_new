<?php

namespace App\Console\Commands;

use App\Events\NewMessage;
use Illuminate\Console\Command;

use function Laravel\Prompts\text;

class SendMessageCommand extends Command
{



    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'send:message';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send a message to React through Reverb';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $message = text(label: 'What message would you like to send?', required: true);
        NewMessage::dispatch($message);
    }
}
