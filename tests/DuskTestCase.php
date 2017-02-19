<?php

namespace Tests;

use Facebook\WebDriver\Remote\WebDriverBrowserType;
use Facebook\WebDriver\Remote\WebDriverCapabilityType;
use Facebook\WebDriver\WebDriverPlatform;
use Laravel\Dusk\TestCase as BaseTestCase;
use Facebook\WebDriver\Remote\RemoteWebDriver;
use Facebook\WebDriver\Remote\DesiredCapabilities;

abstract class DuskTestCase extends BaseTestCase
{
    use CreatesApplication;

    /**
     * Prepare for Dusk test execution.
     *
     * @beforeClass
     * @return void
     */
    public static function prepare()
    {
        if (static::isLinux()) {
            return;
        }

        static::startChromeDriver();
    }

    /**
     * Create the RemoteWebDriver instance.
     *
     * @return \Facebook\WebDriver\Remote\RemoteWebDriver
     */
    protected function driver()
    {
        if (static::isLinux()) {
            return RemoteWebDriver::create(
                'http://127.0.0.1:4444/wd/hub', [
                    WebDriverCapabilityType::BROWSER_NAME => WebDriverBrowserType::PHANTOMJS,
                    WebDriverCapabilityType::PLATFORM => WebDriverPlatform::ANY,
                    'phantomjs.cli.args' => ['--ignore-ssl-errors=true']
                ]
            );
        }

        return RemoteWebDriver::create(
            'http://localhost:9515', DesiredCapabilities::chrome()
        );
    }

    protected static function isLinux()
    {
        return env('IS_LINUX', strtolower(PHP_OS) === 'linux');
    }
}
