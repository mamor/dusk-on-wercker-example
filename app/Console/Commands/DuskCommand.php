<?php

namespace App\Console\Commands;

use Symfony\Component\Process\ProcessBuilder;

class DuskCommand extends \Laravel\Dusk\Console\DuskCommand
{
    protected $signature = 'app:dusk';

    public function handle()
    {
        $this->purgeScreenshots();

        $options = array_slice($_SERVER['argv'], 2);

        return $this->withDuskEnvironment(function () use ($options) {
            return (new ProcessBuilder())
                ->setTimeout(null)
                ->setPrefix($this->binary())
                ->setArguments($this->phpunitArguments($options))
                ->getProcess()
                ->setTty(false)
                ->run(function ($type, $line) {
                    $this->output->write($line);
                });
        });
    }
}
