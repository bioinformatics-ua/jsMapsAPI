// include gulp
var gulp = require('gulp');

// include plug-ins
var changed = require('gulp-changed');
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');

// JS concat, strip debugging and minify
gulp.task('scripts', function() {
  gulp.src(['./js/main.js','./js/*.js'])
    .pipe(concat('script.js'))
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest('./finalJs'));
});

// default gulp task
gulp.task('default', ['scripts'], function() {
  // watch for JS changes
  gulp.watch('./js/*.js', function() {
    gulp.run('scripts');
  });
});
