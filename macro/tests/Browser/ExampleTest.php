<?php

namespace Tests\Browser;

use Facebook\WebDriver\WebDriverKeys;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Support\Sleep;
use Laravel\Dusk\Browser;
use Laravel\Dusk\Keyboard;
use Laravel\Dusk\OperatingSystem;
use Laravel\Prompts\Key;
use Tests\DuskTestCase;

class ExampleTest extends DuskTestCase
{
    /**
     * A basic browser test example.
     */
    public function testBasicExample(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('https://www.google.com');
            $browser->typeSlowly('q', 'Laravel Dusk');

            $browser->withKeyboard(function (Keyboard $keyboard) {
                $keyboard->type([
                    WebDriverKeys::CONTROL,
                    'a',
                ]);
            });

            Sleep::for(3)->seconds();
        });
    }
}
