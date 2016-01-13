'use strict';

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    watch: {
      configFiles: {
        files: 'Gruntfile.js',
        options: {
          reload: true
        },
        task: ['default']
      },

      serverFiles: {
        files: ['**/*.js', 'server/config/default.yaml', '!server/test/*'],
        tasks: ['express:dev'],
        options: {
          spawn: false
        }
      }
    },

    // grunt-express-server
    express: {
      options: {
        port: 3001,
        background: true
      },
      dev: {
        options: {
          script: './app.js'
        }
      }
    },

    open: {
      server: {
        url: 'http://localhost:<%= express.options.port %>'
      }
    },

    mochaTest: {
      server: {
        options: {
          reporter: 'list'
        },
        src: 'test/**/*.js'
      }
    }
  });

  grunt.registerTask('server', ['express:dev', 'watch']);

  grunt.registerTask('default', ['server']);

  grunt.registerTask('test', ['mochaTest:server']); // we use server/config, because all source code is in server dir
};
