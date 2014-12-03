/*globals module: true */
module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        browserify: {
            files: {
                src: [
                    'index.js',
                    'charts.js',
                    '!dist',
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
                options: {
                    spawn: false,
                },
                files: ['**/*.js'],
                tasks: ['mochaTest']
            },
            build: {
                options: {
                    spawn: false,
                },
                files: ['**/*.js', '!test/**/*.js'],
                tasks: ['browserify']
            }
        }

    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');
};
