<?php
namespace Deployer;

require_once __DIR__ . '/vendor/autoload.php';

$dotenv = \Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

require 'vendor/tombroucke/otomaties-deployer/deploy.php';
require 'vendor/tombroucke/otomaties-deployer/recipes/cleanup.php';
require 'vendor/tombroucke/otomaties-deployer/recipes/combell.php';
require 'vendor/tombroucke/otomaties-deployer/recipes/google-fonts.php';
require 'vendor/tombroucke/otomaties-deployer/recipes/revision.php';
require 'vendor/tombroucke/otomaties-deployer/recipes/sage.php';
require 'vendor/tombroucke/otomaties-deployer/recipes/wp-rocket.php';

/** Config */
set('application', 'Deployer');
set('repository', '');
set('sage/theme_path', '');
set('sage/build_command', 'build --clean'); // build --clean for bud, build:production for mix


/** Hosts */
host('production')
    ->set('hostname', 'ssh019.webhosting.be')
    ->set('url', 'http://deployer.otomaties.be/')
    ->set('remote_user', 'otomatiesbe')
    ->set('branch', 'main')
    ->set('deploy_path', '/data/sites/web/otomatiesbe/deployer-test/main');

host('staging')
    ->set('hostname', 'ssh019.webhosting.be')
    ->set('url', '')
    ->set('remote_user', '')
    ->set('branch', '')
    ->set('deploy_path', '');

host('acc')
    ->set('hostname', 'ssh019.webhosting.be')
    ->set('url', '')
    ->set('remote_user', '')
    ->set('branch', '')
    ->set('deploy_path', '');

/** Notify deploy started */
before('deploy', 'slack:notify');

/** Install theme dependencies */
after('deploy:vendors', 'sage:vendors');

/** Push theme assets */
after('deploy:update_code', 'push:assets');

/** Write revision to file */
after('deploy:update_code', 'otomaties:write_revision_to_file');

/** Reload Combell */
after('deploy:symlink', 'combell:reloadPHP');

/** Fetch Google fonts */
after('deploy:symlink', 'acorn:fetch_google_fonts');

/** Reload cache & preload */
after('deploy:symlink', 'wp_rocket:init_cache');

/** Remove unused themes */
after('deploy:cleanup', 'wordpress:cleanup');

/** Notify success */
after('deploy:success', 'slack:notify:success');

/** Unlock deploy */
after('deploy:failed', 'deploy:unlock');

/** Notify failure */
after('deploy:failed', 'slack:notify:failure');

