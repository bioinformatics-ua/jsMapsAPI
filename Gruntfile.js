var grunt = require('grunt');

// Combine multiple files
module.exports = function(grunt){
    grunt.config.init({
        concat: {
            options: {
                javascripts: ['js/*.js'],
                dest: 'finalJs/jsMapsApi.js'
            }
        },
        uglify:{
            js:{
                src:['js/*.js'],
                dest:'finalJs/jsMapsApi.min.js'
            }
        }
    });

    var recursiveConcat = function(source, result){
        grunt.file.expand(source).forEach(function(file){
            if(grunt.file.isDir(file)){
                grunt.file.recurse(file, function(f){
                    result = recursiveConcat(f, result);
                });
            } else {
                grunt.log.writeln('Concatenating ' + file + ' to other ' + result.length + ' characters.');
                result += grunt.file.read(file);
            }
        });
        return result;
    };

    grunt.registerTask('concat', 'concatenates files', function(type){
        grunt.config.requires('concat.options.' + type); // fail the task if this property is missing.
        grunt.config.requires('concat.options.dest');

        var files = grunt.config.get('concat.options.' + type),
        dest = grunt.config.get('concat.options.dest'),
        concatenated = recursiveConcat(files, '');

        grunt.log.writeln('Writing ' + concatenated.length + ' chars to ' + 'tmp/' + type);
        grunt.file.write(dest, concatenated);
    });

    grunt.registerTask('concatAll', ['concat:javascripts']);
    grunt.registerTask('default', ['concatAll','uglify']);
}

grunt.loadNpmTasks('grunt-contrib-uglify');
