module.exports = function(grunt) {

  'use strict';

  grunt.initConfig({

    pkg: grunt.file.readJSON( 'package.json' ),

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
          'js/libs/jquery*.js',
          'js/libs/fastclick.js',
          'js/libs/d3.js',
          'js/classes/*.js',
          'js/app.js'
        ],
        dest: 'build/js/scripts.js',
      }
    },

    uglify: {
      build: {
        src:  'build/js/scripts.js',
        dest: 'build/js/scripts.js'
      }
    },

    sass: {
      dist: {
        options: {
          style: 'compressed',
          'no-source-map': ''
        },
        src: 'style/style.scss',
        dest: 'build/style/style.css',
      }
    },

    svgembed: {
      build: {
        cwd: 'style/icons',
        src: [ '_icons.scss' ],
        dest: 'style/icons.scss',
        options: {
          flatten: true,
          includePath: 'style/icons/optimized'
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'js/libs/*.js',
          'js/classes/*.js',
          'js/*.js'
        ],
        tasks: [ 'concat' ],
        options: {
          spawn: false,
          livereload: true,
        },
      },
      sass: {
        files: [
          'style/*.scss'
        ],
        tasks: [ 'sass' ],
        options: {
          spawn: false,
          livereload: true,
        },
      },
      html: {
        files: [
          'build/*.html'
        ],
        options: {
          spawn: false,
          livereload: true,
        },
      },
    },

  });

  grunt.loadTasks( 'tasks' );
  grunt.loadNpmTasks( 'grunt-contrib-concat' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );
  grunt.loadNpmTasks( 'grunt-contrib-sass' );
  grunt.loadNpmTasks( 'grunt-contrib-watch' );

  grunt.registerTask('default', [ 'concat', 'uglify', 'sass' ]);

};