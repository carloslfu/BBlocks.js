'use strict';
  
module.exports = function (grunt) {
  
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dist: {
                src: [
                    // thirdparty libs
                    'libs/thirdparty/polymergestures.min.js',
                    'libs/thirdparty/svg.js',
                    'libs/thirdparty/svg.path.min.js',
                    'libs/thirdparty/svg.foreignobject.js',
                    // libs
                    'libs/svg.draggable.js',
                    'libs/svg.pannable.js',
                    'libs/svg.resizable.js',
                    'libs/svg.scalable.js',
                    'libs/utils.js',
                    // Core
                    'core/BB.js',
                    'themes/default/color_palettes.js',
                    'core/block_sequence.js',
                    'core/connection.js',
                    'core/block.js',
                    'core/workspace.js',
                    'core/field.js',
                    // Workspaces
                    'workspaces/workspace_basic.js',
                    // Fields
                    'fields/field_svg.js',
                    'fields/field_text.js',
                    'fields/field_button.js',
                    'fields/field_textinput.js'
                ],
                dest: 'dist/BBlocks_uncompressed.js'
            }
        },
        uglify: {
            options: {
		      mangle: false,
		      compress: false
		    },
		    build: {
		      files: {
		        'dist/BBlocks_compressed.js': ['dist/BBlocks_uncompressed.js']
		      }
		    }
        }
    });
  
    // Where we tell Grunt we plan to use some plug-ins.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
  
    // Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('minification', ['uglify']);
    grunt.registerTask('default', ['concat', 'uglify']);
};