// include gulp
var gulp = require('gulp');

// include plug-ins
var changed = require('gulp-changed');
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

// JS concat, minify and generate sourcemaps plus maps
gulp.task('jsFiles', function() {
    gulp.src(['./js/main.js', './js/*.js', './maps_creator/created_countries/*.js'])
        .pipe(sourcemaps.init()) // Process the original sources
        .pipe(concat('jsMapsApi.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write()) // Add the map to modified source
        .pipe(gulp.dest('./finalJs'));
});

// default gulp task
gulp.task('default', ['jsFiles'], function() {
    // watch for changes on the API js files
    gulp.watch('./js/*.js', function() {
        gulp.run('jsFiles');
    });

    // watch for changes on the map files
    gulp.watch('./maps_creator/created_countries/*.js', function() {
        gulp.run('jsFiles');
    });
});
