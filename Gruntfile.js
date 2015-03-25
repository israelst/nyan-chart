/*globals module: true */
module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        browserify: {
            files: {
                src: [
                    'index.js',
                ],
                dest: 'dist/build.js',
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    clearRequireCache: true,
                    growl: true
                },
                src: ['test/**/*.js']
            },
        },
        watch: {
            test: {
                files: ['charts/*.js', 'util.js', 'test/*'],
                tasks: ['mochaTest']
            },
            build: {
                files: ['charts/*.js', 'util.js', 'index.js'],
                tasks: ['browserify']
            }
        }

    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');
};
