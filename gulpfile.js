const gulp = require('gulp');
const shell = require('gulp-shell');
const runSequence = require('run-sequence');

gulp.task('ci:supervisord', shell.task([
  [
    'supervisord -c /etc/supervisor/supervisord.conf'
  ].join(' && ')
]));

gulp.task('ci:copy', shell.task([
  [
    'cp -r /var/app/. /var/www',
    'cp /var/www/.env.ci.www /var/www/.env'
  ].join(' && ')
]));

gulp.task('ci:php:app', shell.task([
  [
    'cd /var/app',
    'composer install --ignore-platform-reqs --no-interaction --no-progress --no-suggest --optimize-autoloader'
  ].join(' && ')
]));

gulp.task('ci:php:www', shell.task([
  [
    'cd /var/www',
    'composer install --ignore-platform-reqs --no-interaction --no-progress --no-suggest --optimize-autoloader --no-dev',
    'chown -R www-data:www-data /var/www'
  ].join(' && ')
]));

gulp.task('ci:php', (callback) => {
  runSequence(
    ['ci:php:app'],
    ['ci:php:www'],
    callback);
});

gulp.task('ci:mysql', shell.task([
  [
    'mysql -u root -e "create database if not exists homestead"',
    'mysql -u root -e "grant all privileges on *.* to homestead@localhost identified by \'secret\'"',
    'mysql -u root -e "flush privileges"'
  ].join(' && ')
]));

gulp.task('ci:migrate', shell.task([
  [
    'cd /var/app',
    'php artisan migrate --force'
  ].join(' && ')
]));

gulp.task('ci:run:phpunit', shell.task([
  [
    'cd /var/app',
    'phpunit'
  ].join(' && ')
]));

gulp.task('ci:run:dusk', shell.task([
  [
    'cd /var/app',
    'php artisan dusk'
  ].join(' && ')
]));

gulp.task('ci:testing:phpunit', (callback) => {
  runSequence(
    ['ci:php:app'],
    ['ci:run:phpunit'],
    callback);
});

gulp.task('ci:testing:dusk', (callback) => {
  runSequence(
    ['ci:supervisord', 'ci:copy'],
    ['ci:php'],
    ['ci:mysql'],
    ['ci:migrate'],
    ['ci:run:dusk'],
    callback);
});

gulp.task('ci:testing:all', (callback) => {
  runSequence(
    ['ci:supervisord', 'ci:copy'],
    ['ci:php'],
    ['ci:mysql'],
    ['ci:migrate'],
    ['ci:run:dusk', 'ci:run:phpunit'],
    callback);
});
