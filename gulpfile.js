// include gulp
var gulp = require('gulp');

// include plug-ins
var changed = require('gulp-changed');
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

// JS concat, minify and generate sourcemaps
gulp.task('jsFiles', function() {
    gulp.src(['./js/main.js', './js/*.js'])
        .pipe(sourcemaps.init()) // Process the original sources 
        .pipe(concat('jsMapsApi.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write()) // Add the map to modified source
        .pipe(gulp.dest('./finalJs'));
});

// generate maps
gulp.task('maps', function() {
    gulp.src(['./lib/jvectormap/maps/*.js'])
        .pipe(concat('maps.js'))
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(gulp.dest('./finalJs'));
});

// default gulp task
gulp.task('default', ['jsFiles', 'maps'], function() {
    // watch for changes on the API js files
    gulp.watch('./js/*.js', function() {
        gulp.run('jsFiles');
    });

    // watch for changes on the map files
    gulp.watch('./lib/jvectormap/maps/*.js', function() {
        gulp.run('maps');
    });
});
