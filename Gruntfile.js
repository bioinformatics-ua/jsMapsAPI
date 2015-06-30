var grunt = require('grunt');

// taskname + description + task function
grunt.registerTask('world', 'world task description', function(){
    console.log('hello world');
});

grunt.registerTask('hello', 'say hello', function(name, age){
    if(!name || !name.length)
    grunt.warn('you need to provide a name.');

    console.log('hello ' + name +' I am '+age+' years old');
});

// tasklist - multiple tasks associated with it
// grunt.registerTask('default', ['world', 'hello:world:12']);

// Multi tasks
grunt.initConfig({
    print: {
        target1: ['index.html', 'src/styles.css', 2],
        target2: 'data',
        hello: 'world'
    }
});

grunt.registerMultiTask('print', 'print targets', function() {
    grunt.log.writeln(this.target + ': ' + this.data);
});

// Combine multiple files
module.exports = function(grunt){
    grunt.config.init({
        concat: {
            options: {
                dest: 'tmp',
                templates: ['templates/header.html', 'templates/footer.html'],
                javascripts: ['javascripts/*.js'],
                stylesheets: ['stylesheets']
            }
        },
        uglify:{
            js:{
                src:['javascripts/*'],
                dest:'tmp/javascripts'
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
        grunt.file.write(dest + '/' + type, concatenated);
    });

    grunt.registerTask('concatAll', ['concat:templates', 'concat:javascripts', 'concat:stylesheets']);
    grunt.registerTask('default', ['concatAll']);
}

grunt.loadNpmTasks('grunt-contrib-uglify');
