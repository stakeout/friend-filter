var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
        plumber = require('gulp-plumber');

gulp.task('server', function (){
    browserSync.init({
        port: 3000
    });
});
gulp.task('watch', function () {
    gulp.watch([
        '/*.html',
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