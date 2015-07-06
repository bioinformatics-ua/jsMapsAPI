var grunt = require('grunt');

// Combine multiple files
module.exports = function(grunt) {
    grunt.config.init({
        concat: {
            javascripts: {
                files: ['js/main.js', 'js/*.js'],
                dest: 'finalJs/jsMapsApi.js'
            },
            maps: {
                files: ['./lib/jvectormap/maps/*.js'],
                dest: 'finalJs/maps.js'
            },
        },
        'jsmin-sourcemap': {
            all: {
                src: ['js/main.js', 'js/*.js'],
                dest: 'finalJs/jsMapsApi.min.js',
                destMap: 'finalJs/jsMapsApi.min.js.map'
            }
        },
        watch: {
            scripts: {
                files: ['./js/*.js','./lib/jvectormap/maps/*.js'],
                tasks: ['default'],
                options: {
                    spawn: false,
                    event: ['all']
                },
            },
        }
    });

    var recursiveConcat = function(source, result) {
        grunt.file.expand(source).forEach(function(file) {
            if (grunt.file.isDir(file)) {
                grunt.file.recurse(file, function(f) {
                    result = recursiveConcat(f, result);
                });
            } else {
                grunt.log.writeln('Concatenating ' + file + ' to other ' + result.length + ' characters.');
                result += grunt.file.read(file);
            }
        });
        return result;
    };

    grunt.registerTask('concat', 'concatenates files', function(type) {
        grunt.config.requires('concat.'+type); // fail the task if this property is missing.
        grunt.config.requires('concat.'+type+'.dest');

        var files = grunt.config.get('concat.'+type+'.files'),
            dest = grunt.config.get('concat.'+type+'.dest'),
            concatenated = recursiveConcat(files, '');

        grunt.log.writeln('Writing ' + concatenated.length + ' chars to ' + 'tmp/' + type);
        grunt.file.write(dest, concatenated);
    });

    grunt.registerTask('default', ['concatAll', 'jsmin-sourcemap']);
    grunt.registerTask('concatAll', ['concat:maps']);
}

// load uglify and watch plugins
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-jsmin-sourcemap');
