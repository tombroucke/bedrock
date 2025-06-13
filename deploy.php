<?php
namespace Deployer;

use Illuminate\Support\Arr;
use function Otomaties\Deployer\runWpQuery;

require_once __DIR__ . '/vendor/autoload.php';
require_once 'contrib/cachetool.php';
require_once 'recipe/composer.php';

(\Dotenv\Dotenv::createImmutable(__DIR__))
    ->load();

collect([
    'functions.php',
    'recipes/auth.php',
    'recipes/bedrock.php',
    'recipes/combell.php',
    'recipes/composer.php',
    'recipes/database.php',
    'recipes/htaccess.php',
    'recipes/opcode.php',
    'recipes/otomaties.php',
    'recipes/sage.php',
    'recipes/wordfence.php',
    'recipes/wp.php',
])
    ->map(fn ($file) => __DIR__ . '/vendor/tombroucke/otomaties-deployer/' . $file)
    ->filter(fn ($file) => file_exists($file))
    ->each(fn ($file) => require_once $file);

/** Config */
set('application', '');
set('repository', '');

/** Sage */
set('sage/theme_path', '/app/themes/themename');
set('sage/build_command', 'build');

/** Hosts */
host('production')
    ->set('hostname', 'ssh###.webhosting.be')
    ->set('url', '')
    ->set('remote_user', 'examplebe')
    ->set('branch', 'main')
    ->set('deploy_path', '/data/sites/web/examplebe/app/main');

host('staging')
    ->set('hostname', 'ssh###.webhosting.be')
    ->set('url', '')
    ->set('basic_auth_user', $_SERVER['BASIC_AUTH_USER'] ?? '')
    ->set('basic_auth_pass', $_SERVER['BASIC_AUTH_PASS'] ?? '')
    ->set('remote_user', 'examplebe')
    ->set('branch', 'staging')
    ->set('deploy_path', '/data/sites/web/examplebe/app/staging');

/** Check if everything is set for sage */
before('deploy:prepare', 'sage:check');

/** Upload auth.json */
before('deploy:vendors', 'composer:upload_auth_json');

/** Remove auth.json */
after('deploy:vendors', 'composer:remove_auth_json');

/** Install theme dependencies */
after('deploy:vendors', 'sage:vendors');

/** Push theme assets */
after('deploy:update_code', 'sage:compile_and_upload_assets');

/** Write revision to file */
after('deploy:update_code', 'otomaties:write_revision_to_file');

/** Reload Combell */
after('deploy:symlink', 'combell:reloadPHP');

/** Clear OPcode cache */
after('deploy:symlink', 'combell:reset_opcode_cache');

/** Optimize the site */
desc('Optimize the site');
task('otomaties:custom:optimize', function () {
    $commands = [
        'wp acorn acf:cache',
        'wp acorn optimize',
        'wp rocket regenerate --file=advanced-cache',
        'wp rocket clean --confirm',
        'wp rocket preload',
    ];

    runWpQuery(Arr::join($commands, ' && '));
});

/** Remove unused themes */
after('deploy:cleanup', 'cleanup:unused_themes');

/** Unlock deploy */
after('deploy:failed', 'deploy:unlock');
