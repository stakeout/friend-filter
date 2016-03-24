var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
        plumber = require('gulp-plumber'),
    runSequence = require('run-sequence');

gulp.task('server', function (){
    browserSync.init({
        port: 3000,
        server: {
            baseDir: './'
        }
    });
});
gulp.task('watch', function () {
    gulp.watch([
        'index.html',
        'js/*.js',
        'css/*.css'
    ]).on('change', browserSync.reload);
});
//дефолтные таски
gulp.task('default', function (callback) {
  runSequence(['server', 'watch'],
    callback
  );
});